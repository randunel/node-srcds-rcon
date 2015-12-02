'use strict';

let rcon = require('..')({
    address: '192.168.1.10',
    password: 'test'
});

rcon.connect().then(() => {
    console.log('running command1');
    return rcon.command('sv_airaccelerate 10').then(res => {
        console.log('got res', res);
    });
}).then(() => {
    return rcon.command('changelevel de_dust2').then(res => {
        console.log('got res', res);
    });
}).catch(err => {
    console.log('caught', err);
    console.log(err.stack);
});

