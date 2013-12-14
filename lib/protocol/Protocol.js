var Request = require('./packets/Request.js');
var Response = require('./packets/Response.js');
var Connection = require('./Connection.js');
var EventEmitter = require('events').EventEmitter;

module.exports = Protocol;

function Protocol(options) {
    options = options || {};
    this._config = options.server || {};
    this._config.host = this._config.host || 'localhost';
    this._config.port = this._config.port || 27015;
    this._auth = options.password || '';
    this._connection = null;
    this._packetId = 1;
    this.connected = false;
}

Protocol.prototype.__proto__ = EventEmitter.prototype;

Protocol.prototype.connect = function(config, cb) {
    var self = this;
    this.busy = true;
    if(typeof(config) == 'function') {
        cb = config;
        config = null;
    }
    config && (this._config = config);

    this._connection = new Connection(this._config);
    this._connection.connect(function(err) {
        if(err) {
            return cb(err);
        }
        self._request(self._auth, 'SERVERDATA_AUTH');
        self.once('-1', function(data) {
            self.removeAllListeners('1');
            cb.call(self, {code: 'WRONG_PASSWORD'});
        });
        self.once('1', function(res) {
            self.removeAllListeners('-1');
            cb.call(self);
        });
    });

    this._connection.on('data', function(data) {
        var res = new Response(data);
        self.emit(res.id.toString(10), res);
    });
    this._connection.on('error', function(err) {
        console.log('ERROR in connection', err);
        self.emit('error', err);
    });
};

Protocol.prototype.exec = function(command, cb) {
    var self = this;
    if(!this.connected) {
        if(!this.connecting) this.connect();
        this.on('connect', function() {
            self.exec.bind(self, command, cb);
        });
        return;
    }
    throw new Error('not implemented');
};

Protocol.prototype._request = function(content, type, id, cb) {
    //var self = this;
    if(typeof(id) == 'function') {
        cb = id;
        id = null;
    }
    if(typeof(type) == 'function') {
        cb = type;
        type = null;
    }
    var id = id || this._getNextPacketId();
    this._connection.write(new Request( {
        id: id,
        type: type || 'SERVERDATA_EXECCOMMAND',
        body: content
    }).buffer, function(err) {
        if(err) {
            self.emit('error', err);
        }
    });
    return id.toString(10);
};

Protocol.prototype._getNextPacketId = function() {
    return this._packetId += 1;
};

