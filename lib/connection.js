'use strict';

let net = require('net');

module.exports = address => {
    let connection;

    return Object.freeze({
        create: create,
        send: send,
        getData: getData,
        destroy: destroy
    });

    function create() {
        return _createConnection().then(newConnection => {
            connection = newConnection;

            connection.on('close', _disconnectHandler);
        });
    }

    function destroy() {
        return _destroyConnection();
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
                connection.on('error', _errorHandler);
                resolve(connection);
            });

            connection.on('error', errorHandler);

            function errorHandler(err) {
                connection.removeListener('error', errorHandler);
                reject(err);
            }
        });
    }

    function _destroyConnection() {
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.end();

                connection.on('close', resolve);
            }
            else {
                resolve();
            }
        });
    }

    function _errorHandler(err) {
        console.error(err);
    }

    function _disconnectHandler() {
        connection = undefined;
    }

    function getData(cbSync) {
        return new Promise((resolve, reject) => {
            connection.removeListener('error', _errorHandler);
            connection.on('error', errorHandler);
            connection.on('data', dataHandler);

            function dataHandler(data) {
                if (!cbSync(data)) {
                    resetListeners();
                    resolve(data);
                }
            }

            function errorHandler(err) {
                resetListeners();
                reject(err);
            }

            function resetListeners() {
                connection.removeListener('error', errorHandler);
                connection.removeListener('data', dataHandler);
                connection.on('error', _errorHandler);
            }
        });
    }

    function send(buffer) {
        connection.write(buffer);
    }
};
