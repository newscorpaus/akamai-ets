'use strict';

var fetch    = window.fetch,
    byId     = require('./util/byId'),
    editor   = require('./util/editor'),
    example  = require('./example/default'),
    debounce = require('lodash/debounce');

module.exports = require('./index_implementation')(editor, byId, fetch, debounce, example);
