# Karma Web Components

Karma Web Components is a karma plugin that provides the following:
* A framework for running *.test.html specs, each in their own isolated iframe
* An optional middleware for proxying requests that go above the directory structure to the bower_components directory (similar to Polyserve and Web Component Tester)
* An optional middleware for proxying requests that go above the directory structure to the node_modules directory

This plugin piggybacks off of other framework plugins.  It currently supports:
* karma-mocha
* karma-chai

The framework portion of this plugin must be loaded after all other frameworks have been loaded.  This is because it relies on the presence of the other framework's functions, and hijacks the karma start function defined by other test frameworks.

## Why this?
1. Web Component Tester is a great tool, but we felt that having the ability to leverage the various plugins available for Karma provides even more value than what Web Component Tester offers.
2. Web Component Tester only supports proxying the bower_components directory and there was at least one project that wanted to avoid using bower in favor of npm.

## How do I use it?
Create and serve any number of files with a `.test.html` file extension, then use the provided karma framework (and optionally one of the provided middlewares) to run the tests.

**IMPORTANT: Make sure your `.test.html` files are not set to be "included" by Karma or else it will load them as HTML imports and your tests will run twice** 

This plugin provides a framework and 2 optional middlewares.

### Framework
There's two steps to using the framework.  

The first step is to add it to the frameworks list in your karma configuration:
```javascript
module.exports = function (config) {
    config.set({

        // Some config before here...
        
        // list of files / patterns to load in the browser
        files: [
            {
                pattern: '*.test.html',
                watched: true,
                included: false // <--- THIS PART IS IMPORTANT!!!
            }
        ],
         
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'web-components']
        
        // More config here...
    });
}
```

The second step is to add framework.js to each of your test pages:
```html
<html>
    <head>
        <link rel="import" href="../my-element/my-element.html">
        <!-- more elements and some scripts... -->
        <script src="node_modules/karma-web-components/framework.js"></script>
        <!-- more scripts... -->
    </head>
    <body>
        <script>
            // specs/tests/etc go here!
        </script>
    </body>
</html>
```

### Middlewares
Using one of the middlewares is as simple as adding an entry to the `middleware` section of your karma config:
Note: The framework provides the middlewares, so you must add the framework in order to use them.

To proxy bower_components:
```javascript
module.exports = function (config) {
    config.set({

        // Some config before here...
         
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'web-components'],
        
        // middlewares to use
        middleware: ['proxy-bower-components']
        
        // More config here...
    });
}
```

To proxy node_modules:
```javascript
module.exports = function (config) {
    config.set({

        // Some config before here...
         
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'web-components'],
        
        // middlewares to use
        middleware: ['proxy-node-modules']
        
        // More config here...
    });
}
```

Once you've added one of the middlewares, any requests for files that would 404 will be intercepted.  The middleware will check bower_components/node_modules for a file at the requested path and serve it if found.  If the file doesn't exist, you will receive a normal 404 response.

## Running the tests
This project uses yarn instead of npm, so it's test scripts are set up to use it.  To run the tests simply install yarn, clone the repository, and then run `yarn test`.

## Contributing
Contributions are always welcome!

If you'd like to contribute, please open a pull request with the following:
* Your code changes including tests for your changes.
* A brief description of what you're fixing/changing including a link/reference to an issue number if applicable
* Your name added to the list of contributors in the project's package.json (if it's not already there)