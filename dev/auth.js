var Rcon = require('../lib/Rcon.js');

var rcon = new Rcon('192.168.0.2:27015', 'test');

rcon.connect(function() {
    //console.log(rcon);
    console.log('sv_airaccelerate object after initialization', rcon.sv_airaccelerate());
    rcon.sv_airaccelerate(10, function(err, res) {
        console.log('sv_airaccelerate server response', res);
        rcon.changelevel('de_dust2', function(err, res) {
            !err && console.log('Changed map to de_dust2');
        });
    });
});

