'use strict';

const

    fs          = require('fs-extra'),
    formatQuery = require('querystring').stringify,
    setDefaults = require('lodash/defaultsDeep'),
    log         = require('./log'),
    summary     = require('./summary'),
    hostile     = require('hostile');

module.exports = require('./index_implementation')(
    fs, log, setDefaults, hostile, formatQuery, summary
);
