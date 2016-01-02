node-srcds-rcon
===============

Node.JS high-level wrapper for SRCDS's remote console (RCON) https://developer.valvesoftware.com/wiki/RCON


## Install

> npm install srcds-rcon

If you think the npm version is outdated, you may install from github

> npm install randunel/node-srcds-rcon

## Introduction

This is a node driver for SRCDS's RCON. While it should work on all SRCDS versions, it has only been tested against the Source 2009 (orangebox) protocol. Development uses the latest CS:GO server build.

The current version `2.x` requires node.js version 4.x or newer. For older node.js versions including 0.8, install srcds-rcon `1.1.7`. All development uses node.js 5.x.

## Usage

#### First establish connection

``` javascript
let Rcon = require('srcds-rcon');
let rcon = Rcon({
    address: '192.168.1.10',
    password: 'test'
});
rcon.connect().then(() => {
    console.log('connected');
}).catch(console.error);
```

#### Run commands

``` javascript
let rcon = require('srcds-rcon')({
    address: '192.168.1.10',
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
    () => rcon.command('changelevel de_dust2').then(() => console.log('changed map'))
).catch(err => {
    console.log('caught', err);
    console.log(err.stack);
});
```

#### Specify command timeout

rcon.command('cvarlist', 1000).then(console.log, console.error);

## Errors

Some errors may contain partial command output. That indicates that the command was run, but reply packets have been lost.

``` javascript
rcon.command('cvarlist').then(() => {}).catch(err => {
    console.log(`Command error: ${err.message}`);
    if (err.details && err.details.partialResponse) {
        console.log(`Got partial response: ${err.details.partialResponse}`);
    }
});

When an error is returned, even if an error doesn't contain a partial output, there is no guarantee the command was not run. The protocol uses udp and the packets sometimes get lost. The only guarantee is when the error does contain a partial output, the command was definitely run, but some reply packets got lost.

