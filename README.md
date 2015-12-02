node-srcds-rcon
===============

Node.JS high-level wrapper for SRCDS's remote console (RCON) https://developer.valvesoftware.com/wiki/RCON


## Install

> npm install srcds-rcon

If you think the npm version is outdated, you may install from github

> npm install randunel/node-srcds-rcon

## Introduction

This is a node driver for SRCDS's RCON. While it should work on all SRCDS versions, it has only been tested against the Source 2009 (orangebox) protocol.

The current version `2.x` requires node.js version 4.x or newer. For older node.js versions including 0.8, install srcds-rcon `1.1.7`. All development uses node.js 5.x.

## Usage

``` javascript
let rcon = require('srcds-rcon')({
    address: '192.168.1.10',
    password: 'test'
});

rcon.connect().then(() => {
    return rcon.command('sv_airaccelerate 10').then(res => {
        console.log('changed sv_airaccelerate');
    });
}).then(
    () => rcon.command('status').then(status => console.log('got status', status))
).then(
    () => rcon.command('cvarlist').then(cvarlist => console.log('cvarlist is'))
).then(
    () => rcon.command('changelevel de_dust2').then(res => console.log('changed map'))
).catch(err => {
    console.log('caught', err);
    console.log(err.stack);
});
```

