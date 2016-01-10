'use strict';

let rcon = require('../');
let should = require('should');

describe('integration', () => {
    it('should connect to server', () => rcon(getIntegrationAuth()).connect().catch(
        err => should.not.exist(err)
    ));

    it('should run single packet command', () => {
        let server = rcon(getIntegrationAuth());
        return server.connect().then(
            () => server.command('status')
        ).then(
            status => status.should.containEql('hostname')
        );
    });

    it('should work with multi packet commands', () => {
        let server = rcon(getIntegrationAuth());
        return server.connect().then(
            () => server.command('cvarlist')
        ).then(
            cvarlist => cvarlist.should.containEql('concommands')
        );
    });
});

function getIntegrationAuth() {
    return {
        address: '127.0.0.1',
        password: 'test'
    };
}

