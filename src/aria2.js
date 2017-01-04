import 'whatwg-fetch';

export default class Aria2 {
  constructor() {
    // initial uuid
    this._uuid = 1;
    // websocket callback array
    this.callbacks = [];
  }

  // connect to aria2 server
  connect(path, secret) {
    // show connect infomation
    return new Promise((resolve, reject) => {
      // get rpc path and secret
      this.path = path || 'http://127.0.0.1:6800/jsonrpc';
      this.secret = secret || '';

      // connect to aria2 server
      if (this.mode === 'websocket') {
        if (typeof WebSocket === 'undefined') {
          return reject('当前浏览器不支持 WebSocket，请升级后使用。');
        }
        // create WebSocket connect to aria2 server
        this.socket = new WebSocket(this.path);
        // message incoming handler
        this.socket.onmessage = event => {
          const data = JSON.parse(event.data),
            cb = this.callbacks[data.id];
          if (cb) {
            if (data.error) {
              cb.reject(data.error);
            } else {
              cb.resolve(data.result);
            }
          }
        };
        // error handler
        this.socket.onerror = error => {
          reject('连接到服务器时发生错误，请稍后再试。');
        };
        // open handler
        this.socket.onopen = event => {
          resolve('aria2 成功连接到服务器。');
        };
      } else { // http mode
        resolve('aria2 成功连接到服务器。');
      }
    });
  }

  // send request
  request(method, ...options) {
    const uuid = this.uuid;
    let jsonrpc = { jsonrpc: '2', id: uuid };

    // default namespace is aria2
    if (method.indexOf('.') === -1) {
      method = 'aria2.' + method;
    }
    jsonrpc.method = method;

    // prepend secret
    options.unshift(this.secret);
    jsonrpc.params = options;

    jsonrpc = JSON.stringify(jsonrpc);
    return new Promise((resolve, reject) => {
      if (this.mode === 'http') {
        fetch(this.path, {
          method: 'POST',
          body: jsonrpc,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          res.json().then(data => {
            if (data.error) {
              reject(data.error);
            } else {
              resolve(data.result);
            }
          });
        }, err => {
          reject(err);
        });
      } else if (this.mode === 'websocket') {
        this.callbacks[uuid] = { resolve, reject };
        this.socket.send(jsonrpc);
      }
    });
  }

  // generate unique id
  get uuid() {
    return this._uuid++;
  }

  // get and set rpc path
  get path() {
    return this._path;
  }
  set path(val) {
    if (!/^(http|ws)s?:\/\//.test(val)) {
      throw new Error('不支持的协议地址：' + val);
    }
    this._path = val;
    if (this.path.indexOf('http') === 0) {
      this.mode = 'http';
    } else {
      this.mode = 'websocket';
    }
  }
  // get and set secret
  get secret() {
    return this._secret;
  }
  set secret(val) {
    this._secret = 'token:' + val;
  }
}
