'use strict';

module.exports = (fs, log, setDefaults, hostile, formatQuery, summary) => {

    return {
        fs          : fs,
        log         : log,
        setDefaults : setDefaults,
        summary     : summary,
        setHosts    : hostile.set.bind(hostile, '127.0.0.1'),
        formatQuery : (src) => { return formatQuery(src, ','); }
    };

};
