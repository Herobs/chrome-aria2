// localStorage wrapper for compatible with chrome storage api
export default {
  get: (keys, callback) => {
    let results = {}, error;
    if (Array.isArray(keys)) {
      keys.reduce((c, i) => { c[i] = undefined; return c; }, results);
    } else if (typeof keys === 'string') {
      results[keys] = undefined;
    } else {
      results = keys;
    }

    try {
      for (let key of Object.keys(results)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const jsonResult = JSON.parse(raw);
          results[key] = jsonResult.value;
        }
      }
    } catch(e) {
      error = e;
    }

    if (typeof callback === 'function') {
      callback(results);
    } else {
      return new Promise((resolve, reject) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    }
  },
  set: (items, callback) => {
    let error;
    try {
      for (let key of Object.keys(items)) {
        localStorage.setItem(key, JSON.stringify({
          value: items[key]
        }));
      }
    } catch(e) {
      error = e;
    }

    if (typeof callback === 'function') {
      callback(null);
    } else {
      return new Promise((resolve, reject) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    }
  },
  remove: (keys, callback) => {
    let error;
    try {
      keys = keys.push ? keys : [keys];
      for (let key of keys) {
        localStorage.removeItem(key);
      }
    } catch(e) {
      error = e;
    }

    if (typeof callback === 'function') {
      callback(null);
    } else {
      return new Promise((resolve, reject) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    }
  },
  clear: callback => {
    let error;
    try {
      localStorage.clear();
    } catch(e) {
      error = e;
    }

    if (typeof callback === 'function') {
      callback(null);
    } else {
      return new Promise((resolve, reject) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    }
  }
}

// export default chrome.storage.sync
