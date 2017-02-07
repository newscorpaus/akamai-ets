'use strict';

var ace = require('brace');

require('brace/mode/html');
require('brace/theme/chrome');

module.exports = require('./editor_implementation')(ace);
