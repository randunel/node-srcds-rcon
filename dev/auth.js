'use strict';

let rcon = require('..')({
    address: '127.0.1.1:53',
    password: 'test'
});

rcon.connect().then(() => {
    return rcon.command('sv_airaccelerate 10').then(res => {
        console.log('got res', res);
    });
}).then(() => {
    return rcon.command('changelevel de_dust2').then(res => {
        console.log('got res', res);
    });
}).catch(err => {
    console.log('caught', err);
});

