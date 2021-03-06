/*
 * Copyright (c) 2015-2016 PointSource, LLC.
 * MIT Licensed
 */
var request = require('request-promise'),
    assert = require('assert'),
    util = require('./launchUtil'),
    path = require('path');

describe('SERVER6 - duplicate service name should fail on startup', function () {
    this.timeout(5000);

    after(function (done) {
        util.finish(done);
    });

    it('Launch server and check for failure', function (done) {
        util.launch('server6', function(output) {
            assert.ok(output.indexOf('already exists') > -1);
            done();
        });
    });
});

describe('SERVER9 - service module with invalid name should fail on startup', function () {
    this.timeout(5000);

    after(function (done) {
        util.finish(done);
    });

    it('Launch server and check for failure', function (done) {
        util.launch('server9', function(output) {
            assert.ok(output.indexOf('Names cannot contain periods') > -1);
            done();
        });
    });
});

describe('SERVER10 - handler with invalid name should fail on startup', function () {
    this.timeout(5000);

    after(function (done) {
        util.finish(done);
    });

    it('Launch server and check for failure', function (done) {
        util.launch('server10', function(output) {
            assert.ok(output.indexOf('Names cannot contain periods') > -1);
            done();
        });
    });
});

describe('SERVER10 - handler with invalid name should fail on startup', function () {
    this.timeout(5000);

    after(function (done) {
        util.finish(done);
    });

    it('Launch server and check for failure', function (done) {
        util.launch('server10', function(output) {
            assert.ok(output.indexOf('Names cannot contain periods') > -1);
            done();
        });
    });
});

describe('SERVER11 - middleware should get loaded from node modules', function () {
    this.timeout(5000);

    after(function (done) {
        util.finish(done);
    });

    it('Launch server and load middleware', function (done) {
        util.launch('server11', {appDir: path.resolve(__dirname, 'fixtures/server11')}, function(output) {
            assert.ok(output === null);
            done();
        });
    });
});

describe('SERVER12 - single mock service should get loaded when specified by the --mock-services CLI argument',
    function () {
        this.timeout(5000);

        before(function (done) {
            util.launch('server12',
                {
                    appDir: path.resolve(__dirname, 'fixtures/server12'),
                    mockServices: 'pet-service1'
                },
                done
            );
        });

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var req = {
                uri: 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets1',
                json: true
            };
            request(req)
                .then(function(res) {
                    assert.equal('mock1 pet', res.name);
                    req.uri = 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets2';
                    return request(req);
                })
                .then(function(res) {
                    assert.equal('service2 pet', res.name);
                    req.uri = 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets3';
                    return request(req);
                })
                .then(function(res) {
                    assert.equal('module pet', res.name);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });
    });

describe('SERVER12 - multiple mock services should get loaded when specified by the --mock-services CLI argument',
    function () {
        this.timeout(5000);

        before(function (done) {
            util.launch('server12',
                {
                    appDir: path.resolve(__dirname, 'fixtures/server12'),
                    mockServices: 'pet-service1,pet-service2'
                },
                done
            );
        });

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var req = {
                uri: 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets1',
                json: true
            };
            request(req)
                .then(function(res) {
                    assert.equal('mock1 pet', res.name);
                    req.uri = 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets2';
                    return request(req);
                })
                .then(function(res) {
                    assert.equal('mock2 pet', res.name);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });
    });

describe('SERVER12 - mock service modules should get loaded when specified by the --mock-services CLI argument',
    function () {
        this.timeout(5000);

        before(function (done) {
            util.launch('server12',
                {
                    appDir: path.resolve(__dirname, 'fixtures/server12'),
                    mockServices: 'pet-service-module'
                },
                done
            );
        });

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var req = {
                uri: 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets3',
                json: true
            };
            request(req)
                .then(function(res) {
                    assert.equal('module mock pet', res.name);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });
    });

describe('SERVER12 - single mock middleware should get loaded when specified by the --mock-middleware CLI argument',
    function () {
        this.timeout(5000);

        before(function (done) {
            util.launch('server12',
                {
                    appDir: path.resolve(__dirname, 'fixtures/server12'),
                    mockMiddleware: 'pet-middleware1'
                },
                done
            );
        });

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var req = {
                uri: 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets1',
                resolveWithFullResponse: true
            };
            request(req)
                .then(function(res) {
                    assert.equal('pet-middleware1-mock', res.headers['x-pet-middleware1']);
                    assert.equal('pet-middleware2', res.headers['x-pet-middleware2']);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });
    });

describe('SERVER12 - multiple mock middlewares should get loaded when specified by the --mock-middleware CLI argument',
    function () {
        this.timeout(5000);

        before(function (done) {
            util.launch('server12',
                {
                    appDir: path.resolve(__dirname, 'fixtures/server12'),
                    mockMiddleware: 'pet-middleware1,pet-middleware2'
                },
                done
            );
        });

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var req = {
                uri: 'http://localhost:' + (process.env.PORT || 5000) + '/api/pets1',
                resolveWithFullResponse: true
            };
            request(req)
                .then(function(res) {
                    assert.equal('pet-middleware1-mock', res.headers['x-pet-middleware1']);
                    assert.equal('pet-middleware2-mock', res.headers['x-pet-middleware2']);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });
    });

describe('SERVER13 - user should be warned if mock service cannot be found',
    function () {
        this.timeout(5000);

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var opts = {
                appDir: path.resolve(__dirname, 'fixtures/server13'),
                mockServices: 'pet-service2,pet-service-module',
                outputLevel: 'WARN'
            };

            util.launch('server13', opts, function(output) {
                assert.ok(output.indexOf('The requested mock services') > -1);
                assert.ok(output.indexOf('were not found in the mock services directory') > -1);
                done();
            });
        });
    });

describe('SERVER13 - user should be warned if mock middleware cannot be found',
    function () {
        this.timeout(5000);

        after(function (done) {
            util.finish(done);
        });

        it('Launch server and load mocks', function (done) {
            var opts = {
                appDir: path.resolve(__dirname, 'fixtures/server13'),
                mockMiddleware: 'pet-middleware',
                outputLevel: 'WARN'
            };

            util.launch('server13', opts, function(output) {
                assert.ok(output.indexOf('The requested mock middleware') > -1);
                assert.ok(output.indexOf('were not found in the mock middleware directory') > -1);
                done();
            });
        });
    });
