function getRandomTimeout(optionTimeout, aberration) {
	var min = optionTimeout - aberration;
	var max = optionTimeout + aberration;
	return Math.floor(Math.random() * (max - min)) + min;
}

class AbstractCometClient {
	constructor(clientName) {
		// if (new.target === AbstractCometClient) {
		// 	throw new TypeError("Cannot construct Abstract instances directly");
		// }
		if (!clientName) {
			throw new Error("clientName required field for instance");
		}
		this.clientName = clientName;
		this.reconnectCount = 0;
		this.disposed = false; //флаг чтобы повторно не кидать событие фейла
	}

	available() {
		throw new Error("Not implemented method available");
	}

	reconnectAfterError(retryFail, reconnect) {
		if (this.reconnectCount < this.params.retryCount) {
			//при ошибке подключаемся через рандомный интервал времени
			let timeoutReconnect = getRandomTimeout(this.params.timeoutReconnect, 2000);
			if (this.needReconnect) {
				this.reconnectCount++;
				if (reconnect)
					this.reconnectId = setTimeout(reconnect, timeoutReconnect);
			}
		} else {
			this.dispose(retryFail);
		}
	}

	dispose(retryFail) {
		if (this.disposed == true)
			return;
		this.disposed = true;
		if (this.reconnectId) {
			clearTimeout(this.reconnectId);
			this.reconnectId = null;
		}
		if (retryFail)
			retryFail(this.clientName);
	}

	start() {
		this.needReconnect = true;
		this.reconnectCount = 0;
	}

	stop() {
		this.needReconnect = false;
	}

	setParams(params) {
		this.params = params;
	}
}

export default AbstractCometClient