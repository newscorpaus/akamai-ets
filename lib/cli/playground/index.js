'use strict';

var Emitter    = require('events'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    md5        = require('md5'),
    async      = require('async'),
    request    = require('request');

module.exports = require('./index_implementation')(
    Emitter, express, bodyParser, md5, async, request
);
