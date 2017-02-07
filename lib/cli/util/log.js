'use strict';

const

    bristol   = require('bristol'),
    palin     = require('palin'),
    toError   = require('string.toerror');

module.exports = require('./log_implementation')(bristol, palin, toError);
