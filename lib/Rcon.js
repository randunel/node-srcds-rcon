var Request = require('./protocol/packets/Request.js');
var Response = require('./protocol/packets/Response.js');
var Protocol = require('./protocol/Protocol.js');
var EventEmitter = require('events').EventEmitter;

module.exports = Rcon;

function Rcon(address, password) {
    if(typeof(address) == 'string') {
        address = {
            host: address.split(':')[0],
            port: address.split(':')[1]
        };
    }

    this.connected = false;
    this.connecting = false;
    this.address = address || null;
    this.password = password || null;
    this.protocol = null;
};

Rcon.prototype.__proto__ = EventEmitter.prototype;

Rcon.prototype.connect = function(address, password, cb) {
    var self = this;
    if(typeof(password) == 'function') {
        cb = password;
        password = null;
    }
    if(typeof(address) == 'function') {
        cb = address;
        address = null;
    }
    if(this.connected === true) {
        return (cb && cb( {code:'CONNECTION_EXISTS'}));
    }

    this.connecting = true;
    this.protocol = new Protocol();
    this.protocol.connect(address || this.address, password || this.password, function(err) {
        if(!err) {
            self.connecting = false;
            self.connected = true;
            self.emit('connect');
        }
        cb && cb(err);
    });
    this.protocol.on('error', function(err) {
        console.log('Protocol error', err);
        if(err.fatal === true) {
            this.connected = false;
        }
        self.emit('error', err);
    });
};

Rcon.prototype.exec = function(command, cb) {
    var self = this;
    if(typeof(command) !== 'string') {
        return setImmediate(cb.bind(self, {code: 'INVALID_COMMAND'}));
    }
    if(!this.connected) {
        this.on('connect', this.exec.bind(this, command, cb));
        if(!this.connecting) this.connect();
        return;
    }
    this.protocol.exec(command, cb);
};
