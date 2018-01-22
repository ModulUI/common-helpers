export default function storageFactory(storage) {
  return {
    getItem(key) {
      const value = storage.getItem(key);

      if (typeof value !== 'string') {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch (ex) {
        return value;
      }
    },

    setItem(key, value) {
      const strValue = typeof value === 'string' ? value : JSON.stringify(value);
      storage.setItem(key, strValue);
    },

    removeItem(key) {
      storage.removeItem(key);
    },
  };
}
