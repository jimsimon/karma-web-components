var path = require('path');

var pattern = function (file, included) {
    return {pattern: file, included: included, served: true, watched: false};
};

var framework = function (files) {
    files.push(pattern(path.join(__dirname, 'framework.js'), false));
    files.push(pattern(path.join(__dirname, 'runner.js'), true));
};

var proxyBowerComponentsMiddlewareFactory = function () {
    return function (request, response, next) {
        next();
    };
};

var proxyNodeModulesMiddlewareFactory = function () {
    return function (request, response, next) {
        next();
    };
};

framework.$inject = ['config.files'];
module.exports = {
    'framework:web-components': ['factory', framework],
    'middleware:proxy-bower-components': ['factory', proxyBowerComponentsMiddlewareFactory],
    'middleware:proxy-node-modules': ['factory', proxyNodeModulesMiddlewareFactory]
};