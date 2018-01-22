class Http {
  constructor(axios, interceptors) {
    this.interceptors = interceptors;
    this.axios = axios;
  }

  http(params) {
    const self = this;
    return this.interceptors
      .apply(Promise.resolve(self._normalizeHttpOptions(params)), ::self._serverRequest);
  }

  _normalizeHttpOptions(params) {
    params.headers = params.headers || {};
    if (params.method.toUpperCase() === 'GET' && params.data) {
      params.params = params.data;
      delete params.data;
    }
    if (params.querystring) {
      params.url += `?${ params.querystring }`;
    }
    return params;
  }

  _serverRequest(params) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.axios(params).then(resolve, reject);
    });
  }
}


export default Http;
