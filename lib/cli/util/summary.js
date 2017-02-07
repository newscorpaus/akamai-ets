'use strict';

module.exports = (() => {

    let self = (config) => {

        let ports = [
                `PLAYGROUND [ ${config.ports.playground} ]`,
                `ORIGIN [ ${config.ports.origin} ]`,
                `DEBUG [ ${config.ports.debug} ]`
            ].join(' '),

            status = [
                `${'  PORTS   '.yellow}      :  ${ports}`,
                `${'  ORIGIN  '.yellow}      :  ${config.origin || config.www}`,
                `${'  ALIASES '.yellow}      :  ${(config.alias || 'n/a')}`,
                `${config.esi.geo && '\n' + self.formatTable(config.esi.geo) || ''}`
            ].join('\n').trim();

        return status;

    };

    self.pad = (value, maxLength) => {
        value = String(value);
        let len = (maxLength - value.length),
            padding;
        padding = (new Array(len + 1).join(' '));
        return value + padding;
    };

    self.maxLength = (items) => {
        let list = [].concat(items).sort(function(a, b) {
            return b.length - a.length;
        });
        return list[0] && list[0].length || 0;
    };

    self.formatTable = (obj) => {

        var keys  = Object.keys(obj),
            len   = {
                keys   : self.maxLength(keys),
                values : self.maxLength(keys.map(key => obj[key]))
            },
            separater = '  :  ',
            table     = '';

        keys.forEach((key, index) => {
            let nextKey = keys.splice(index + 1, 1),
                values  = {
                    left  : `  ${self.pad(key, len.keys)}${separater}${self.pad(obj[key], len.values)}`,
                    right : nextKey.length &&
                            `${self.pad(nextKey, len.keys)}${separater}${self.pad(obj[nextKey], len.values)}` || ''
                };
            table += `${values.left} |   ${values.right}\n`;
        });

        return table;

    };

    return self;

})();
