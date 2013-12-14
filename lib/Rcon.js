var Request = require('./protocol/packets/Request.js');
var Response = require('./protocol/packets/Response.js');
var Protocol = require('./protocol/Protocol.js');
var EventEmitter = require('events').EventEmitter;
var toArray = require('./to_array.js');

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
    this.commands = {};
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
            if(!self.cvarlist) {
                self.runCommand('cvarlist', initializeCommands);
                return;
            }
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

    function initializeCommands(err, res) {
        var cvars = res.split('\n');
        cvars.shift();
        cvars.shift();
        while(cvars[cvars.length - 1].indexOf('---------') < 0) {
            cvars.pop();
        }
        cvars.pop();
        for(var i = 0; i < cvars.length; ++i) {
            self._addCommand.call(self, parseCommand(cvars[i]));
        }
        self.emit('connect');
        cb && cb(err);
    }

    function parseCommand(string) {
        var split = string.split(':');
        return {
            command: split[0].trim(),
            value: split[1].trim(), // 'cmd' for commands or actual value
            cheat: split[2].indexOf('cheat') > -1,
            description: split[3]
        };
    }
};

Rcon.prototype.runCommand = function(command, cb) {
    var self = this;
    if(typeof(command) !== 'string') {
        return setImmediate(cb.bind(self, {code: 'INVALID_COMMAND'}));
    }
    if(!this.connected) {
        this.on('connect', this.runCommand.bind(this, command, cb));
        if(!this.connecting) this.connect();
        return;
    }
    this.protocol.exec(command, function(err, res) {
        // err is always null
        res = res || '';
        // TODO: parse response string
        // TODO: update internal var
        cb(err, res);
    });
};

Rcon.prototype._addCommand = function(options) {
    var self = this;
    this.commands[options.command] = {
        value: options.value,
        cheat: options.cheat,
        description: options.description
    };
    this[options.command] = function() {
        // Check arguments for callback
        if(arguments.length == 0) return self.commands[options.command];
        var args = toArray(arguments);
        var cb = args.pop();
        self.runCommand.call(self, [options.command].concat(args).join(' '), cb);
    };
};

