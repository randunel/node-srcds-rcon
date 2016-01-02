'use strict';

let rcon = require('..')({
    address: '127.0.0.1',
    password: 'test'
});

rcon.connect().then(() => {
    return rcon.command('sv_airaccelerate 10').then(() => {
        console.log('changed sv_airaccelerate');
    });
}).then(
    () => rcon.command('status').then(status => console.log(`got status ${status}`))
).then(
    () => rcon.command('cvarlist').then(cvarlist => console.log(`cvarlist is \n${cvarlist}`))
).then(
    () => rcon.command('cvarlist', 1).then(cvarlist => console.log(`cvarlist is \n${cvarlist}`))
).then(
    () => rcon.command('changelevel de_dust2').then(() => console.log('changed map'))
).catch(err => {
    console.log('caught', err);
    console.log(err.stack);
});

