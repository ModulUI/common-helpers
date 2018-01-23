/**
 * Работа с comet-сервером по long-polling-у
 */

//import Q from './../Q.js';
import api from './../api.js'
import AbstractCometClient from './AbstractCometClient'

class PollingCometClient extends AbstractCometClient {
    constructor({httpClient}) {
        super('longPolling');
        this.httpClient = httpClient;
    }

    available() {
        return true;
    }

    stop() {
        super.stop();
        if (this.xhrInstance && this.xhrInstance.readyState != 4) {
            this.xhrInstance.abort();
            this.xhrInstance = null;
        }
    }

    start({onConnectComplete, onErrorConnect, onRetryFail}) {
        super.start();

        var self = this;

        connect().then(() => {
            // eslint-disable-next-line no-console
            console.debug(`[${new Date()}] Comet: Long Polling Start`);
        });

        function success({data, xhr}) {
            self.xhrInstance = xhr;
            //console.log('long puling success', self);

            if (self.needReconnect)
                connect();
            onConnectComplete({data});
        }

        function error(exception) {
            onErrorConnect(exception);
            self.reconnectAfterError(onRetryFail, connect);
            return new Promise((resolve, reject) => {
                reject(exception);
            });
            //return Q.reject(exception);
        }

        function connect() {
            let url = '';
            if (self.params.url.substring(self.params.url.length - 1) == '/') {
                url = self.params.url + self.params.instanceId
            } else {
                url = self.params.url + "/" + self.params.instanceId + '?q=' + new Date().getTime();
            }
            // return api().http.http('GET', url, {
            //     ignoreFailed: true
            // }, {'X-TOKEN': self.params.xToken})
            //     .then(success)
            //     .catch(error)
            return this
                .httpClient({
                    method: 'GET',
                    url: url,
                    header: {'X-TOKEN': self.params.xToken},
                    data: {
                        ignoreFailed: true
                    }
                })
                .then(success)
                .catch(error)
        }
    }

}

export  default PollingCometClient
