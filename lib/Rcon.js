var Request = require('./protocol/packets/Request.js');
var Response = require('./protocol/packets/Response.js');
var Protocol = require('./protocol/Protocol.js');
var EventEmitter = require('events').EventEmitter;
var toArray = require('./util.js').to_array;
var log = require('./util.js').log;

module.exports = Rcon;

function Rcon(address, password) {
    if ('object' === typeof address && !password) {
        this.password = address.password;
        this.address = address.address;
        this.initCvars = address.initCvars;
    }
    if (typeof this.address === 'string') {
        this.address = {
            host: this.address.split(':')[0],
            port: this.address.split(':')[1]
        };
    }

    if ('boolean' !== typeof this.initCvars) {
        this.initCvars = true;
    }

    this.connected = false;
    this.connecting = false;
    this.password = this.password || password;
    this.protocol = null;
    this.commands = {};

    log('Initialized rcon instance', this);
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
        log('Error: Connection already established');
        return (cb && cb( {code:'CONNECTION_EXISTS'}));
    }

    this.connecting = true;
    this.protocol = new Protocol();
    log('Connecting', address || this.address, password || this.password);
    this.protocol.connect(address || this.address, password || this.password, function(err) {
        if(!err) {
            log('Connected, initializing cvarlist');
            self.connecting = false;
            self.connected = true;
            if (self.initCvars && !self.cvarlist) {
                self.runCommand('cvarlist', initializeCommands);
                return;
            } else {
                self.emit('connect');
                cb && cb();
            }
            return;
        }
        log('Connection error', err);
        cb && cb(err);
    });
    this.protocol.on('error', function(err) {
        log('Protocol error', err);
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
        log('Adding ' + cvars.length + ' cvarlist commands to rcon instance')
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
        log('Invalid command:', command);
        return setImmediate(cb.bind(self, {code: 'INVALID_COMMAND'}));
    }
    if(!this.connected) {
        log('Command issued before connection, adding to queue');
        this.once('connect', this.runCommand.bind(this, command, cb));
        if(!this.connecting) this.connect();
        return;
    }
    this.protocol.exec(command, function(err, res) {
        // err is always null
        res = res || '';
        // TODO: parse response string
        // TODO: update internal var
        cb && cb(err, res);
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

Rcon.prototype.disconnect = function(cb) {
    var self = this;
    this.connected = false;
    this.protocol.disconnect(cb);
};

