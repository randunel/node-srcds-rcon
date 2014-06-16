'use strict';

var utils = {
    to_array: function to_array(args) {
        // Taken from mranney/node_redis
        var len = args.length,
        arr = new Array(len), i;
        for (i = 0; i < len; i += 1) {
            arr[i] = args[i];
        }
        return arr;
    },
    log: function log() {}
};

if (process.env.DEBUG) {
    utils.log = console.log.bind(console);
}

module.exports = utils;

