'use strict';

module.exports = Object.freeze({
    promiseTimeout: timeout => new Promise(resolve => setTimeout(resolve, timeout))
});

