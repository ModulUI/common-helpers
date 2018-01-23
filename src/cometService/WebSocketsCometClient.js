/**
 * Работа с comet-сервером по web socket-у
 */
import AbstractCometClient from './abstractCometClient.js'

class WebSocketsCometClient extends AbstractCometClient {
	constructor() {
		super('webSockets');
	}

	available() {
		return !!window.WebSocket;
	}

	stop() {
		super.stop();
		this.closeConnection();
		this.instance = null;
	}

	closeConnection() {
		if (this.instance && this.instance.readyState == 1) {
			this.instance.close();
		}
	}

	start({onConnectComplete, onErrorConnect, onRetryFail}) {
		super.start();
		var self = this;
		var reconnectCountResetId = null;
		var stateCheckerId = null;
		const checkConnectionSeconds = 30;

		connect();

		function connect() {
			try {
				let readyState = self.instance ? self.instance.readyState : 3; //state - closed
				if (readyState == 3) //если соединение закрыто, то открываем заново
				{
					self.instance = new WebSocket(self.params.url + "/" + self.params.instanceId);
					self.instance.addEventListener('open', open);
					self.instance.addEventListener('close', close);
					self.instance.addEventListener('message', message);
					self.instance.addEventListener('error', error);
				}
			} catch (ex) {
				self.dispose(onRetryFail);
			}
		}

		function close(evt) {
			// eslint-disable-next-line no-console
			console.debug(`[${new Date()}] Comet: Web Socket Close`, evt);
			//если в течении 30 сек. произошло закрытие соединения или ошибка то нужно сбросить
			//таску "self.reconnectCount = 0;"
			clearConnectionStableTask();
			clearConnectionChecker();
			self.reconnectAfterError(onRetryFail, connect);
		}

		function open(evt) {
			startConnectionStableTask();
			checkConnectionStability();
			// eslint-disable-next-line no-console
			console.debug(`[${new Date()}] Comet: Web Socket Open`, evt);
		}

		function message(data) {
			checkConnectionStability();
			eventReceive(data);
		}

		function eventReceive(message) {
			if (message && message.data) {
				try {
					if (onConnectComplete)
						onConnectComplete({data: JSON.parse(message.data)});
				} catch (ex) {
					//console.debug(`[${new Date()}] Comet: Web Socket Could not parse data`, message.data, ex);
				}
			}
		}

		function error(exception) {
			onErrorConnect(exception);
			self.closeConnection();
			//если в течении 30 сек. произошло закрытие соединения или ошибка то нужно сбросить
			//таску "self.reconnectCount = 0;"
			clearConnectionStableTask();
			clearConnectionChecker();
		}

		/**
		 * обнуляем счетчик если успешно соединились
		 * могут быть случаи когда соединение успешное, но тут же обрывается. По этому было решено
		 * обнулять счетчик только после 30 сек. стабильной работы транспорта
		 */
		function startConnectionStableTask() {
			reconnectCountResetId = setTimeout(() => {
				self.reconnectCount = 0;
				clearConnectionStableTask();
			}, 30000);
		}

		/**
		 * Убиваем таску сброса счетчика реконнектов
		 */
		function clearConnectionStableTask() {
			if (reconnectCountResetId) {
				clearTimeout(reconnectCountResetId);
				reconnectCountResetId = null;
			}
		}


		/**
		 * После каждого приема сообщения запускаем таймер,
		 * если след. пуш не пришел в течении 30 сек то убиваем сокет и делаем реконнект
		 */
		function checkConnectionStability() {
			clearConnectionChecker();

			stateCheckerId = setTimeout(() => {
				if (self.instance) {
					//удаляем подписку на закрытие, чтобы не призошел  реконнект
					self.instance.removeEventListener('close', close);
					self.instance.removeEventListener('error', error);
					self.instance.close();
				}
				self.instance = null;
				clearConnectionStableTask();
				clearConnectionChecker();
				connect();
			}, checkConnectionSeconds * 1000);
		}

		function clearConnectionChecker() {
			if (stateCheckerId) {
				clearTimeout(stateCheckerId);
				stateCheckerId = null;
			}
		}

	}
}

export  default WebSocketsCometClient
