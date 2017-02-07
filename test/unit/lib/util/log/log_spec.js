'use strict';

var base   = '../../../../../',
    imp    = require('implementation')(base + '/lib/util/log'),
    noop   = function () {},

    getImp = function (deps) {
        deps = deps || {};
        deps.bristol = deps.bristol || {
            addTarget : function () { return { withFormatter : noop }; }
        };
        var fork = imp(deps.bristol, deps.formatter, deps.toError, deps.parentPID);
        return fork;
    };

describe('util/log', function () {

    it('should be a function', function () {
        var log = getImp();
        expect(log, 'is a function').to.be.a('function');
        expect(log.length, 'has an arity of 2').to.equal(2);
    });

    describe('calls bristol.log with correct arguments when', function () {

        describe('level', function () {

            it('is known => "info"', function (done) {
                var log = getImp({
                        bristol: {
                            addTarget : function () { return { withFormatter : noop }; },
                            log       : function (severity) {
                                expect(
                                    severity,
                                    'severity is "info"'
                                ).to.equal('info');
                                done();
                            }
                        }
                    });
                log('info');
            });

            it('is unknown => "debug"', function (done) {
                var log = getImp({
                        bristol: {
                            addTarget : function () { return { withFormatter : noop }; },
                            log       : function (severity) {
                                expect(
                                    severity,
                                    'severity is "debug"'
                                ).to.equal('debug');
                                done();
                            }
                        }
                    });
                log('foo');
            });

        });

        describe('payload', function () {

            it('data is a string', function (done) {
                var log = getImp({
                        bristol: {
                            addTarget : function () { return { withFormatter : noop }; },
                            log       : function (severity, context, message) {
                                expect(
                                    message,
                                    'message is correctly formatted'
                                ).to.equal('foo bar');
                                done();
                            }
                        }
                    });
                log('info', { data: 'foo bar' });
            });

            describe('is error', function () {

                it('native error', function (done) {
                    var log = getImp({
                            bristol: {
                                addTarget : function () {
                                    return { withFormatter : noop };
                                },
                                log       : function (severity, context, error) {
                                    expect(
                                        error.message,
                                        'error correctly passed'
                                    ).to.equal('I am an error');
                                    done();
                                }
                            }
                        });
                    log('info', { error: new Error('I am an error') });
                });

                it('toError called if error is a string', function (done) {
                    var log = getImp({
                            toError : function (strError) {
                                expect(
                                    strError,
                                    'string error correctly passed'
                                ).to.equal('I am an error');
                                return new Error('I am an error');
                            },
                            bristol : {
                                addTarget : function () { return { withFormatter : noop }; },
                                log       : function (severity, context, error) {
                                    expect(
                                        error.message,
                                        'error correctly passed'
                                    ).to.equal('I am an error');
                                    done();
                                }
                            }
                        });
                    log('info', { error: 'I am an error' });
                });

            });

            it('data is not a string', function (done) {
                var log = getImp({
                        bristol: {
                            addTarget : function () { return { withFormatter : noop }; },
                            log       : function (severity, context, data) {
                                expect(
                                    data,
                                    'data correctly passed'
                                ).to.eql({ foo: 'bar' });
                                done();
                            }
                        }
                    });
                log('info', { data: { foo: 'bar' } });
            });

        });

    });

});
