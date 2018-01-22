/* global XMLHttpRequest, ActiveXObject */

// import Q from 'q'
// import config from 'config'
// import {Http} from './api'

function createApi(http) {
	// let beacon = sendBeacon;
	// if (__CLIENT__ && 'sendBeacon' in navigator) {
	//     beacon = navigator.sendBeacon;
	// }


  let httpMixin = {
    http(method, url, params, options) {
      return http.http(normalizeHttpOptions(method, url, params, options));
    },
		// beacon(url, params) {
		//     var blob = new Blob([JSON.stringify(params)], {
		//         type: 'application/json; charset=UTF-8'
		//     });
		//     return Q(beacon(url, blob)).then(
		//         function (result) {
		//             return Q.resolve(result);
		//         },
		//         function (error) {
		//             return Q.reject(error);
		//         }
		//     );
		// }
  };

  httpMixin = ['get', 'post', 'put', 'patch', 'delete', 'options'].reduce(bindHttpShortCut, httpMixin);

  const api = createResourse(getResourceProto());
  api.generatePath = function () {
    return __API_URL__;
  };

  return api;

  function getResourceProto() {
    return {
      http: httpMixin,

      getResource(resourseName) {
        return function resourseFactory(id) {
          return this[normalizeResourceName(resourseName)](id);
        }.bind(this);
      },

      addResource,
    };
  }

  function addResource(name, alias) {
    const parentResource = this;
    const methodName = normalizeResourceName(name);

    parentResource.$$prto[methodName] = resource;

    const resourceProto = getResourceProto();

    return resource();

    function resource(...params) {
      const parentResource = this;
      const res = createResourse(resourceProto);
      res.generatePath = createGeneratePathFunc(parentResource, res, ...params);
      createRestApiFor(res);
      return res;
    }

    function createGeneratePathFunc(parentResource, curentResource, ...params) {
      return function generatePath(endPoint) {
        const path = [];

        if (parentResource.generatePath) {
          path.push(parentResource.generatePath());
        }

        path.push(alias || name);

        if (params) {
          // if (Array.isArray(id)) { id.forEach(s => path.push(s)); } else						{ path.push(id); }
          [...params].forEach(s => path.push(s));
        }

        if (endPoint) {
          path.push(endPoint);
        }

        return path.join('/');
      };
    }

		/**
		 * Добавляет к объекту resource методы 'get', 'post', 'put', 'patch'
		 * @param resource - расширяемый объект
		 */
    function createRestApiFor(resource) {
			//  создаем в resource методы .get, .post и т.п.
      ['get', 'post', 'put', 'patch', 'delete', 'options', 'beacon'].reduce(bindApiRestResourceShortCut, resource);

      function bindApiRestResourceShortCut(api, method) {
        api[method] = apiRestResourceShortCut;
        return api;

        function apiRestResourceShortCut(params, options) {
          return resource.http[method](resource.generatePath(), params, options);
        }
      }
    }
  }

	// function sendBeacon(url, params) {
	//     httpMixin.api('POST', url, params, {});
	//     return true;
	// }
}

function createResourse(resourseProto) {
  const resourse = Object.create(resourseProto);
  resourse.$$prto = resourseProto;
  resourse.addResource = resourse.addResource.bind(resourse);
  return resourse;
}

function normalizeResourceName(name) {
  return name.replace(/-([a-zA-Z])/ig, (str, p1) => p1.toUpperCase());
}

function normalizeHttpOptions(method, url, params, options) {
  return {url, data: params, method, ...options};
}

function bindHttpShortCut(httpMixin, method) {
  httpMixin[method] = httpShortCut;
  return httpMixin;

  function httpShortCut(url, params, options) {
    return httpMixin.http(method, url, params || null, options || null);
  }
}

export default createApi;

