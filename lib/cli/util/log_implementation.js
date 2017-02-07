'use strict';

/**
 * @function implementation
 * Factory for creating a custom logger
 *
 * @param   {Object}    bristol     bristol logging library
 * @param   {Function}  formatter   formatter for bristol output
 * @param   {Function}  toError     concert strings to errors
 */

module.exports = (bristol, formatter, toError) => {

    let logger = bristol,

        // akamai-ets will emitt events which originate from
        // various source, map these sources to log events

        levels = {
            exit   : 'info',
            info   : 'info',
            warn   : 'warn',
            error  : 'error',
            stdout : 'info',
            stderr : 'error'
        },

        /**
         * @function format
         * Generic formatting function which removed un-required data,
         * when not needed
         */

        format = (options, severity, date, elems) => {
            let context = elems.pop();
            delete context.file;
            delete context.line;
            elems.push(context);
            return formatter(options, severity, date, elems);
        },

        self;

    logger.addTarget('console').withFormatter(format);

  /**
   * @function log
   * Generic logging function
   *
   * @param   {String}    level      received log event
   * @param   {String}    data       log data
   */

    self = (level, payload) => {

        payload = payload || {};

        let event = payload.event || '',
            data  = payload.data,
            error = payload.error,

            name    = [event].join(' '),
            context = {},
            args    = [(levels[level] || 'debug'), context];

        if (name) { context.scope = name; }

        if (error) {
            error = typeof error === 'object' ? error : toError(error);
            args.push(error);
        }

        if (data) { args.push(data); }

        return logger.log.apply(logger, args);

    };

    self.format = format;

    return self;

};
