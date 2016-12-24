var TEST_REGEXP = /(spec|test)\.html$/i;
var MOCHA_REGEXP = /mocha.js$/i;
var karma = window.__karma__;

var tests = [];
Object.keys(karma.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        tests.push(file);
    } else if (MOCHA_REGEXP.test(file)) {
        window.MOCHA_PATH = file;
    }
});

window.addEventListener('message', handleMessage);

karma.start = function() {
    tests.forEach(function (testFile) {
        var iframe = document.createElement("iframe");
        document.body.appendChild(iframe);
        iframe.src = testFile;
    })
}

/**
 *  These are all the events you can subscribe to in mocha:
 *   - `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `hook`  (hook) hook execution started
 *   - `hook end`  (hook) hook complete
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 */
var handlers = {
    start: onStart,
    end: onEnd
}

var startCount = 0;
var endCount = 0;
var totalTests = 0;

function handleMessage (event) {
    var eventType = event.data.type;
    var eventHandler = handlers[eventType];
    if (eventHandler) {
        eventHandler(event);
    }
}

function onStart(event) {
    totalTests += event.data.totalTests;
    startCount++;

    if (startCount === tests.length) {
        karma.info({total: totalTests});
    }
}

function onEnd(event) {
    endCount++;
    if (endCount === tests.length) {
        karma.complete();
    }
}


//iframe for each test
//collect total from each iframe
//once all iframes report, start all iframes


