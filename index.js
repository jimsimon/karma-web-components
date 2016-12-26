var path = require('path');
var fs = require('fs');
var mime = require('mime');

var pattern = function (file, included) {
    return {pattern: file, included: included, served: true, watched: false};
};

var framework = function (files) {
    files.push(pattern(path.join(__dirname, 'framework.js'), false));
    files.push(pattern(path.join(__dirname, 'runner.js'), true));
};

var createProxyForDirectory = function (directory) {
    return function (request, response, next) {
        var filePath = path.join(directory, request.url.replace('/base/', ''));
        fs.exists(filePath, function (exists) {
            if (exists) { //Serve from directory
                console.log('Proxying "' + request.url + '" to "' + filePath + '"');
                // Content-type is very interesting part that guarantee that
                // Web browser will handle response in an appropriate manner.
                response.writeHead(200, {
                    "Content-Type": mime.lookup(filePath)
                });
                fs.createReadStream(filePath).pipe(response);
            } else { //Let karma serve the 404
                console.log('Unable to find a proxy candidate for "' + request.url + '"');
                next();
            }
        });
    }
};

var proxyBowerComponentsMiddlewareFactory = function () {
    return createProxyForDirectory('bower_components');
};

var proxyNodeModulesMiddlewareFactory = function () {
    return createProxyForDirectory('node_modules');
};

framework.$inject = ['config.files'];
module.exports = {
    'framework:web-components': ['factory', framework],
    'middleware:proxy-bower-components': ['factory', proxyBowerComponentsMiddlewareFactory],
    'middleware:proxy-node-modules': ['factory', proxyNodeModulesMiddlewareFactory]
};