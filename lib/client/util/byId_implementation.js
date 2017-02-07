'use strict';

module.exports = (getElementById) => {

    return (...elements) => {

        elements = elements.reduce((acc, id) => {

            let element = document.getElementById(id);

            if (!element) { return; }

            acc[id] = element;

            return acc;

        }, {});

        return elements;

    };

};
