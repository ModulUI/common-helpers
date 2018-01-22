export default {
  defaults: {},
  expiresMultiplier: 60 * 60 * 24,

  set(key, value, options) {
    if (isPlainObject(key)) {
      for (const k in key) {
        if (key.hasOwnProperty(k)) this.set(k, key[k], value);
      }
    } else {
      options = isPlainObject(options) ? options : {expires: options};

      let expires = options.expires !== undefined ? options.expires : (this.defaults.expires || '');
      const expiresType = typeof (expires);

      if (expiresType === 'string' && expires !== '') expires = new Date(expires);
      else if (expiresType === 'number') expires = new Date(+new Date() + 1000 * this.expiresMultiplier * expires);

      if (expires !== '' && 'toGMTString' in expires) expires = `;expires=${ expires.toGMTString() }`;

      let path = options.path || this.defaults.path;
      path = path ? `;path=${ path }` : '';

      let domain = options.domain || this.defaults.domain;
      domain = domain ? `;domain=${ domain }` : '';

      const secure = options.secure || this.defaults.secure ? ';secure' : '';

      document.cookie = `${ escape(key) }=${ escape(value) }${ expires }${ path }${ domain }${ secure }`;
    }
    return this; // Return the `cookie` object to make chaining possible.
  },

  get(keys, fallback) {
    const cookies = this.all();

    if (Array.isArray(keys)) {
      return keys.reduce((result, value, key) => {
        result[value] = retrieve(cookies[value], fallback);
        return result;
      });
    } return retrieve(cookies[keys], fallback);
  },

  remove(...keys) {
    keys.forEach((key) => {
      this.set(key, '', -1);
    });
    return this; // Return the `cookie` object to make chaining possible.
  },

  empty() {
    return this.remove(Object.keys(this.all()));
  },

  all() {
    if (document.cookie === '') return {};

    return document.cookie.split('; ').reduce((result, cookie) => {
      const item = cookie.split('=');
      result[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
      return result;
    }, {});
  },

  enabled() {
    if (navigator.cookieEnabled) return true;

    const result = this.set('(.)', '(.)').get('(.)') === '(.)';
    this.remove('(.)');
    return result;
  },
};

function retrieve(value, fallback) {
  return value == null ? fallback : value;
}

function isPlainObject(value) {
  return !!value && Object.prototype.toString.call(value) === '[object Object]';
}

function escape(value) {
  return String(value).replace(/[,;"\\=\s%]/g, (character) => {
    return encodeURIComponent(character);
  });
}
