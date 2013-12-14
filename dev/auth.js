var Rcon = require('../lib/Rcon.js');

var rcon = new Rcon('127.0.1.1:27015', 'test');

rcon.connect(function() {
    //console.log(rcon);
    rcon.xbox_throttlespoof(function(err, res) {
        console.log('res', res);
        rcon.changelevel('de_dust2', function(err, res) {
            !err && console.log('Changed map to de_dust2');
        });
    });
});

