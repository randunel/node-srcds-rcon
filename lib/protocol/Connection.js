var net = require('net');
var EventEmitter = require('events').EventEmitter;
var log = require('../util.js').log;

module.exports = Connection;

function Connection(options) {
    this._host = options.host;
    this._port = options.port;
    this._connection = null;
    log('Instantiated connection', options);
}

Connection.prototype.__proto__ = EventEmitter.prototype;

Connection.prototype.connect = function(cb) {
    var self = this;
    log('Initializing TCP connection to ' + this._host + ':' + this._port)
    this._connection = net.createConnection( {
        host: this._host,
        port: this._port
    }, cb);

    this._connection.on('connect', function() {
        log('TCP connection established');
        self.emit('connect');
    });
    this._connection.on('error', function(err) {
        log('TCP connection error', err);
        self.emit('error', err);
    });
    this._connection.on('data', function(data) {
        self.emit('data', data);
    });
};

Connection.prototype.write = function(buffer, cb) {
    log('Sending TCP data', buffer);
    this._connection.write(buffer, cb);
};

Connection.prototype.disconnect = function(cb) {
    this._connection.end();
    setImmediate(cb);
};

Connection.prototype.destroy = function(cb) {
    this._connection.destroy();
    setImmediate(cb);
};

