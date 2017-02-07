'use strict';

const

    defaults   = require('./config.json'),
    util       = require('./util'),
    playground = require('./playground'),
    ets        = require('./ets');

module.exports = require('./index_implementation')(
    defaults, util, playground, ets
);
