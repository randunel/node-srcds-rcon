var net = require('net');
var EventEmitter = require('events').EventEmitter;

module.exports = Connection;

function Connection(options) {
    this._host = options.host;
    this._port = options.port;
    this._connection = null;
}

Connection.prototype.__proto__ = EventEmitter.prototype;

Connection.prototype.connect = function(cb) {
    var self = this;
    this._connection = net.createConnection( {
        host: this._host,
        port: this._port
    }, cb);

    this._connection.on('connect', function() {
        self.emit('connect');
    });
    this._connection.on('error', function(err) {
        self.emit('error', err);
    });
    this._connection.on('data', function(data) {
        self.emit('data', data);
    });
};

Connection.prototype.write = function(buffer, cb) {
    console.log('Sending', buffer);
    this._connection.write(buffer, cb);
};

