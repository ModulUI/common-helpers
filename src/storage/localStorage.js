import storageFactory from './storage.js';
import fakeStorage from './fakeStorage.js';
import cookies from './cookies.js';

let storage;
if (cookies.enabled()) {
  try {
    const key = '___TEST__ENABLED__LOCALSTORAGE__';
    localStorage.setItem(key, 1);
    localStorage.removeItem(key);
    storage = localStorage;
  }	catch (ex) {
    storage = fakeStorage;
  }
} else {
  storage = fakeStorage;
}


export default storageFactory(storage)
