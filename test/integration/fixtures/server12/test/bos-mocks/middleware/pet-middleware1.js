exports.init = function (app, config, logger, callback) {
    app.use(middleware);
    logger.info('Pet Middleware1 Mock initialized');
    callback();
};

function middleware(req, res, next) {
    res.header('x-pet-middleware1', 'pet-middleware1-mock');
    next();
}
