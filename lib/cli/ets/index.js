'use strict';

const

    util    = require('../util'),
    Emitter = require('events'),
    spawn   = require('child_process').spawn,
    request = require('request'),
    exit    = require('exit-hook'),
    toError = require('string.toerror');

module.exports = require('./index_implementation')(
    util, Emitter, exit, request, spawn, toError
);
