var Rcon = require('../lib/Rcon.js');

//var rcon = new Rcon('192.168.0.2:27015', 'test');
var rcon = new Rcon({
    address: '192.168.0.2:27015',
    password: 'test',
    initCvars: false
});

rcon.connect(function() {
    //rcon.sv_airaccelerate(10, function(err, res) {
    rcon.runCommand('sv_airaccelerate 10', function(err, res) {
        console.log('sv_airaccelerate server response', res);
        //rcon.changelevel('de_dust2', function(err, res) {
        rcon.runCommand('changelevel de_dust2', function(err, res) {
            !err && console.log('Changed map to de_dust2');
        });
    });
});

