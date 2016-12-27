// Mocha
if (parent.mocha) {
    // BDD or QUnit
    window.before = parent.before;
    window.after = parent.after;
    window.beforeEach = parent.beforeEach;
    window.afterEach = parent.afterEach;
    window.run = parent.run;

    // BDD
    window.describe = parent.describe;
    window.it = parent.it;
    window.xit = parent.xit;

    // QUnit
    window.suite = parent.suite;
    window.test = parent.test;

    // TDD
    window.setup = parent.setup;
    window.teardown = parent.teardown;
    window.suiteSetup = parent.suiteSetup;
    window.suiteTeardown = parent.suiteTeardown;
}

if (parent.chai) {
    // Chai
    window.AssertionError = parent.chai.AssertionError;
    window.should = parent.should;
    window.expect = parent.expect;
    window.assert = parent.assert;
}