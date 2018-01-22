class Interceptors {
  constructor() {
    this.interceptors = [];
  }

  push(interceptor) {
    this.interceptors.push(interceptor);
  }

  apply(promise, fn) {
    const interceptors = this.interceptors;
    const chain = [fn, null];

    interceptors.forEach((interceptor) => {
      if (interceptor.request || interceptor.requestError) {
        chain.unshift(interceptor.request, interceptor.requestError);
      }
      if (interceptor.response || interceptor.responseError) {
        chain.push(interceptor.response, interceptor.responseError);
      }
    });

    let thenFn;
    let rejectFn;
    while (chain.length) {
      thenFn = chain.shift();
      rejectFn = chain.shift();

      promise = promise.then(thenFn, rejectFn);
    }

    return promise;
  }
}

export default Interceptors;
