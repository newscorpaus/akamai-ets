'use strict';

const MAX_ATTEMPTS = 10;

/**
 * @function implementation
 * Factory for creating an interface to a spawned Apache server
 *
 * @param   {Object}    util        collection of helper functions
 * @param   {Function}  Emitter     native events module
 * @param   {Function}  exit        catch all process exit
 * @param   {Function}  request     provides HTTP requests
 * @param   {Function}  spawn       child_process.spawn
 * @param   {Function}  toError     convert string to an error
 */

module.exports = (util, Emitter, exit, request, spawn, toError) => {

    /**
     * @function proxy
     * Start an apache server, returning an emitter as a communication
     * channel
     *
     * @param     {Object}  options     configuration options
     *
     * @returns   {Object}  event emitter instance
     */

    let self = (config) => {

        config = config || {};

        let emitter  = new Emitter(),
            filename = '/usr/local/apache2/conf/ets/vh_origin.conf',

            origin   = config.origin  || 'http://origin.ets.local/',
            aliases  = config.aliases || [],
            geo      = config.esi.geo ? util.formatQuery(config.esi.geo) : 'off',

            content  = [
                'UndefMacro AddOrigin',
                '## ETS PLAYGROUND ##',
                `Use Playground "preview" "off" "${geo}"`,
                `Use Playground "debug" "on" "${geo}"`,
                'UndefMacro Playground'
            ];

        // generate configuration

        [
            { port : 81, debug : 'on', aliases : ['debug.ets'].concat(aliases) },
            { port : 80, debug : 'off', aliases : ['origin.ets'].concat(aliases) }
        ].forEach((ctx) => {
            content.unshift(
                `Use AddOrigin "${origin}" "${ctx.port}" "${ctx.aliases}" "${ctx.debug}" "${geo}"`
            );
        });

        util.fs.outputFile(
            filename,
            content.join('\n'), self.start.bind(null, emitter, config)
        );

        return emitter;

    };

    self.start = (emitter, config) => {

        let child   = spawn('apachectl', ['start', '-DFOREGROUND']),
            attempt = 1;

        child.stdout.on('data', (data) => {
            emitter.emit('data', data.toString());
        });

        child.stderr.on('data', (data) => {
            emitter.emit('error', toError(data.toString()));
        });

        exit((...params) => {
            emitter.emit.apply(emitter, ['exit'].concat(params));
        });

        (function check() {

            // attempt to connect to the proxy server, polling for a
            // maxium of x3 connection attempts

            if (attempt > MAX_ATTEMPTS) {
                return emitter.emit('error', {
                    message : 'ETS Unavailable - Max connection attempts reached'
                });
            }

            attempt++;

            request('http://localhost/', (err, res, body) => {
                if (err) {
                    emitter.emit('warn', err);
                    return setTimeout(check, 100);
                }
                emitter.emit('listening');
            });

        }());

    };

    return self;

};
