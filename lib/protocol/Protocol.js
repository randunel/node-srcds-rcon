var Request = require('./packets/Request.js');
var Response = require('./packets/Response.js');
var Connection = require('./Connection.js');
var EventEmitter = require('events').EventEmitter;

module.exports = Protocol;

function Protocol() {
    this.connection = null;
    this.packetId = 0;
    this.connected = false;
    this.queue = {};
}

Protocol.prototype.__proto__ = EventEmitter.prototype;

Protocol.prototype.connect = function(server, password, cb) {
    var self = this;

    this.connection = new Connection(server);
    this.connection.connect(function(err) {
        if(err) {
            return cb(err);
        }
        var reqId = self.request(password, 'SERVERDATA_AUTH');
        self.once('-1', function(data) {
            self.removeAllListeners('1');
            cb.call(self, {code: 'WRONG_PASSWORD'});
        });
        self.once(reqId, function(res) {
            self.removeAllListeners('-1');
            cb.call(self);
        });
    });

    this.connection.on('data', function(data) {
        var res = new Response(data);
        self.emit(res.id.toString(10), res);
    });
    this.connection.on('error', function(err) {
        // Connection errors cannot be recovered on the same object
        err.fatal = true;
        self.emit('error', err);
    });
};

Protocol.prototype.exec = function(command, cb) {
    var self = this;

    var reqId = this.request(command);
    var ackId = this.request('', 'SERVERDATA_RESPONSE_VALUE');

    this.on(reqId, parseRequest);
    this.once(ackId, function() {
        this.removeListener(reqId, parseRequest);
        var res = self.queue[reqId];
        delete self.queue[reqId];
    });

    function parseRequest(req) {
        if(self.queue[reqId]) {
            console.log('Multiple packets response detected');
            return self.queue[reqId] += req.body;
        }
        self.queue[reqId] = req.body;
    }
};

Protocol.prototype.request = function(content, type, id, cb) {
    var id = id || this.getNextPacketId();
    this.connection.write(new Request( {
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

Protocol.prototype.getNextPacketId = function() {
    return this.packetId += 1;
};

