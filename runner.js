var TEST_REGEXP = /(spec|test)\.html$/i;
var karma = window.__karma__;

var onIframeLoadedCounter = 0;
var testFiles = [];
Object.keys(karma.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        testFiles.push(file);
    }
});

var karmaMochaStart = karma.start;
karma.start = function() {
    testFiles.forEach(function (testFile) {
        var iframe = document.createElement("iframe");
        document.body.appendChild(iframe);
        iframe.src = testFile;
        iframe.onload = onIframeLoaded;
    });
};

var onIframeLoaded = function () {
    onIframeLoadedCounter++;

    if (onIframeLoadedCounter === testFiles.length) {
        karmaMochaStart();
    }
};