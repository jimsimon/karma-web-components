var path = require('path');
var fs = require('fs');

var pattern = function (file, included) {
    return {pattern: file, included: included, served: true, watched: false};
};

var framework = function (files) {
    files.push(pattern(path.join(__dirname, 'framework.js'), false));
    files.push(pattern(path.join(__dirname, 'runner.js'), true));
};

var createProxyForDirectory = function (directory) {
    return function (request, response, next) {
        var filePath = request.url.replace('/base/', '');
        console.log('Fragment: ' + filePath);
        fs.exists(filePath, function (exists) {
            if (exists) { //File exists at root, let karma attempt to serve it.
                next();
            } else {
                filePath = path.join(directory, request.url.replace(/base\/|node_modules\//g, ''));
                fs.exists(filePath, function (exists) {
                    if (exists) { //Serve from bower_components
                        // Content-type is very interesting part that guarantee that
                        // Web browser will handle response in an appropriate manner.
                        response.writeHead(200, {
                            "Content-Type": "application/octet-stream",
                            "Content-Disposition" : "attachment; filename=" + path.basename(filePath)});
                        fs.createReadStream(filePath).pipe(response);
                    } else { //Let karma serve the 404
                        next();
                    }
                });
            }
        });
    };
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