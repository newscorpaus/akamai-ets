'use strict';

/**
 * @function implementation
 * Factory for creating an interface to an express server
 *
 * @param   {Function}  Emitter     native events module
 * @param   {Function}  express     HTTP server
 * @param   {Function}  bodyParser  req.post parsing
 * @param   {Function}  md5         generate a MD5 hash
 */

module.exports = (Emitter, express, bodyParser, md5, async, request) => {

    /**
     * @function playground
     * Start an express server, returning an emitter as a communication
     * channel
     *
     * @param   {Object}    options     configuration options
     *
     * @returns {Object}    event emitter instance
     */

    let self = (options) => {

        options = options || {};

        let emitter   = new Emitter(),
            server    = express(),
            parseJSON = bodyParser.json({ limit : '5mb' }),
            port      = options.port || '3000',
            cache     = {};

        server.post('/process', parseJSON, self.process.bind(null, cache));

        server.get('/source/:id', self.source.bind(null, cache));
        server.get('*', (req, res) => {
            console.log(req);
            res.status(404).send('Nothing to see here');
        });

        server.listen(port, () => {
            emitter.emit('listening');
        });

        return emitter;

    };

    /**
     * @function process
     * Receives an incoming request payload and caches the result for
     * later retrieval. Caching against an MD5 hash of the received payload.
     *
     * @param {Object}  cache   store for recording responses.
     * @param {object}  req     Standard HTTP/Express request object
     * @param {object}  res     Standard HTTP/Express response object
     */

    self.process = (cache, req, res) => {

        if (!req.body) {
            return res.status(400).send('Invalid submission received');
        }

        let body = req.body.esi,
            id   = md5(body);

        cache[id] = {
            id     : id,
            source : body
        };

        async.each(['preview', 'debug'], (path, next) => {

            request(`http://${path}.playground.ets/${id}`, (err, res, body) => {
                if (err) { return next(err); }
                body = body.trim();
                body = body.split(/^\\n/)[0];
                cache[id][path] = body;
                next();
            });

        }, (err) => {

            if (err) {
                return res.status(400).send(
                    `Unable to find preview for ${id}`
                );
            }

            res.json(cache[id]);

        });

    };

    /**
     * @function result
     * Returns a previously cached requests based upon an MD5
     * generated ID.
     *
     * @param {Object}  cache   store for recording responses.
     * @param {object}  req     Standard HTTP/Express request object
     * @param {object}  res     Standard HTTP/Express response object
     */

    self.source = (cache, req, res) => {

        var id     = req.params.id,
            result = cache[id] && cache[id].source;

        if (!result) {
            return res.status(404).send(`Unable to retrieve result for ${id}`);
        }

        return res.send(result);

    };

    return self;

};
