'use strict';

let net = require('net');

module.exports = address => {
    let connection;

    return Object.freeze({
        create: create,
        send: send,
        getData: getData
    });

    function create() {
        return _createConnection().then(newConnection => {
            connection = newConnection;
        });
    }

    function _createConnection() {
        return new Promise((resolve, reject) => {
            let host = address.split(':')[0];
            let port = Number(address.split(':')[1]) || 27015;
            let connection = net.createConnection({
                host: host,
                port: port
            }, () => {
                connection.removeListener('error', errorHandler);
                resolve(connection);
            });

            connection.on('error', errorHandler);

            function errorHandler(err) {
                reject(err);
            }
        });
    }

    function getData(cbSync) {
        return new Promise((resolve, reject) => {
            connection.on('error', errorHandler);
            connection.on('data', dataHandler);

            function dataHandler(data) {
                if (!cbSync(data)) {
                    connection.removeListener('error', errorHandler);
                    connection.removeListener('data', dataHandler);
                    resolve(data);
                }
            }

            function errorHandler(err) {
                reject(err);
            }
        });
    }

    function send(buffer) {
        connection.write(buffer);
    }
};

