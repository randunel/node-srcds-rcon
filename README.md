node-srcds-rcon
===============

Node.JS high-level wrapper for SRCDS's remote console (RCON) https://developer.valvesoftware.com/wiki/RCON


## Install

> npm install srcds-rcon

If you think the npm version is outdated, you may install from github

> npm install randunel/node-srcds-rcon

## Introduction

This is a node driver for SRCDS's RCON. While it should work on all SRCDS versions, it has only been tested against the Source 2009 (orangebox) protocol.

## Example

``` javascript
var Rcon = require('srcds-rcon');

var rcon = new Rcon('127.0.1.1:27015', 'mySecretRconPassword');

rcon.connect(function() {
    rcon.sv_airaccelerate(6, function(err, res) {
        console.log('sv_airaccelerate set to 6', res);
        rcon.changelevel('de_dust2', function(err, res) {
            console.log('Changed map to de_dust2');
        });
    });
});
```

## Known issues

 - Don't keep the SRCDS console open when initializing the service. The internal watchdog timer detects a timeout due to the console's slow display speed and aborts, dumps the core and restarts the server. You may open the SRCDS console afterwards. There are two workarounds, setting watchdog's timeout to a higher value which may not be accesible, or disabling logging to console which may hinder debugging.
 - Rcon's internal cvar state is not maintained, the settings in `rcon.commands` are only valid after initialization, and must be considered outdated afterwards. That goes down as **work in progress**, feel free to assist.
 - Error handling - mostly works, haven't encountered that many during tests


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/randunel/node-srcds-rcon/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

