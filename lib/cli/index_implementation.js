'use strict';

/**
 * @function implementation
 * Factory for creating akamai-ets cli app
 *
 * @param   {Object}        defaults    configuration defaults
 * @param   {Object}        util        collection of helper functions
 * @param   {Function}      playgroud   esi playground server
 * @param   {Function}      ets         ets server
 */

module.exports = (defaults, util, playground, ets) => {

    let log = util.log, self;

    /**
     * @function implementation
     * Initialise akamai-ets using supplied config
     *
     * @param   {Object}    config     context as received via cli
     */

    self = (config) => {

        let hosts     = defaults.hosts.concat(config.alias || []),
            etsConfig = util.setDefaults({}, config, { esi : defaults.esi });

        log('info') + console.log(`\n${util.summary(etsConfig)}\n`);

        try {
            hosts.forEach((host) => {
                util.setHosts(host);
            });
        } catch (err) {
            log('error', { data : 'Unable to update /etc/hosts' });
        }

        // initialise ets server

        ets(etsConfig).on('listening', () => {

            log('info', {
                event : 'RUNNING'.green,
                data  : 'ESI PROXY'
            });

            // start the playground server next, not much point
            // running it if ETS is not running

            playground({
                port : 3000
            }).on('listening', () => {

                log('info', {
                    event : 'RUNNING'.green,
                    data  : 'ESI PLAYGROUND'
                });

            });

        }).on('error', (error) => {
            log('error', { data : error.message });
        });

    };

    return self;

};
