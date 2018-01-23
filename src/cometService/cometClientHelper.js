
//получение правильного урл по типу подключения
export function getTransportUrl(transport, url) {
	if (url.indexOf("http://") >= 0 || url.indexOf("https://") >= 0
		|| url.indexOf("ws://") >= 0 || url.indexOf("wss://") >= 0)
		return url;

	let siteProtocol = window.document.location.protocol;
	let host = window.document.location.host;
	let protocol = siteProtocol;
	if (transport == 'webSockets')
		protocol = siteProtocol === "https:" ? "wss:" : "ws:";

	if (url.indexOf('//') >= 0) {
		return protocol + url;
	} else {
		return protocol + "//" + host + url
	}
}


export function logger() {
	var self = {
		logEnabled: false,
		configurate: (options)=> {
			self.logEnabled = (options && options.logging ? true : false);
		},
		log: (...args)=> {
			if (self.logEnabled) {
				// eslint-disable-next-line no-console
				console.log(...args);
			}
		}
	};
	return self;
}

