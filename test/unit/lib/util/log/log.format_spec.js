'use strict';

var base   = '../../../../../',
    imp    = require('implementation')(base + '/lib/util/log'),
    noop   = function () {},

    getImp = function (deps) {
        deps = deps || {};
        deps.bristol = deps.bristol || {
            addTarget : function () { return { withFormatter : noop }; }
        };
        var fork = imp(deps.bristol, deps.formatter, deps.parentPID);
        return fork;
    };

describe('util/log.format', function () {

    it('should be a function', function () {
        var format = getImp().format;
        expect(format, 'is a function').to.be.a('function');
        expect(format.length, 'has an arity of 4').to.equal(4);
    });

    it('calls formatter', function (done) {
        var format = getImp({
                formatter: function () {
                    done();
                }
            }).format;
        format({}, 'info', 'data', [{}]);
    });

    it(
        'removes file & line from context object',
        function (done) {

            var format = getImp({
                    formatter: function (options, severity, date, elems) {
                        var context = elems.pop();
                        expect(
                            context,
                            'should not have "file" or "line" key'
                        ).to.have.all.keys(['scope']);
                        done();
                    }
                }).format;

            format({}, 'info', 'data', [{
                scope : 'somescope',
                file  : 'somefile',
                line  : 50
            }]);

        }
    );

});
