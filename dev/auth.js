'use strict';

let rcon = require('..')({
    address: '192.168.1.10',
    password: 'test'
});

rcon.connect().then(() => {
    return rcon.command('sv_airaccelerate 10').then(res => {
        console.log('got res1', res);
    });
}).then(
    () => rcon.command('status').then(res => console.log('got res2', res))
).then(
    () => rcon.command('cvarlist').then(res => console.log('got res3', res))
).then(
    () => rcon.command('changelevel de_dust2').then(res => console.log('got res4', res))
).catch(err => {
    console.log('caught', err);
    console.log(err.stack);
});

