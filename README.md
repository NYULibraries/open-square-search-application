# DLTS Open Square: Search

[Metadata search](http://opensquare.nyupress.org/search/)
for the DLTS [Open Square website](http://opensquare.nyupress.org/).

## Project setup

### Prerequisites

* [Node](https://nodejs.org/) (at least Node 10.x recommended)
* [Java](https://www.java.com/) (at least Java 8 recommended) - for Selenium tests
* [rsync](https://rsync.samba.org/) - for deployment scripts
* [yarn](https://yarnpkg.com/) is recommended, but not required.  All instructions
below assume `yarn`.

### Installing dependencies

```
# Install dependencies including devDependencies
# If NODE_ENV is not set to production, can leave out --production=false
yarn install --production=false
```

### Compile and hot-reload for development
```
# Serve development version with hot reload at localhost:8080
# Uses environment variables from .env.development
yarn serve
```

### Compile and minify for development, stage, and production
```
# Uses environment variables from .env.dev
yarn build:dev

# Uses environment variables from .env.stage
yarn build:stage

# Uses environment variables from .env.prod
yarn build:prod
```

### Run all tests
```
# Run all unit and browser tests
yarn test
```

Currently there are no unit tests, only browser (e2e) tests.

### Browser (e2e) tests
```
# Run Selenium tests headlessly against localhost ENM
yarn test:browser:local

# Debugging Selenium tests in Chrome only - not in headless mode
# Timeout is set to very hight value to allow for pausing at breakpoints
yarn test:browser:local:debug:chrome

# Debugging Selenium tests in Firefox only - not in headless mode
# Timeout is set to very hight value to allow for pausing at breakpoints
yarn test:browser:local:debug:firefox

# Run tests headlessly against live dev server ENM
yarn test:browser:dev

# Run tests headlessly against live staging server ENM
yarn test:browser:stage

# Run tests headlessly against live production server ENM
yarn test:browser:prod
```

### Run unit tests

Currently there are no unit tests, only browser (e2e) tests.

### Lint and fix files
```
yarn lint
```

### Lint but do not fix files
```
yarn lint --no-fix
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/) and
[Environment Variables and Modes](https://cli.vuejs.org/guide/mode-and-env.html).

### Notes on tests

#### Solr fake

The [`solr` query string parameter](#solr-solr-override) is used by the browser tests to make the application under test
send all Solr requests to a Solr fake running on localhost:3000.
The Solr Fake is currently a very basic in-house implementation included as an
NPM module:
[NYULibraries/dlts-solr-fake](https://github.com/NYULibraries/dlts-solr-fake).

The Solr fake is configured and started automatically in `tests/browser/conf/wdio.main.conf.js`:

```javascript
    // DLTS Solr Fake
    solrFake : {
        url : 'http://localhost:3000/',
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare : function ( config, capabilities ) {
        if ( this.solrFake ) {
            solrFake.startSolrFake( SOLR_FAKE_RESPONSES_INDEX, SOLR_FAKE_RESPONSES_DIRECTORY );
        }
    },
```

The Solr responses served by the Solr fake are in `tests/browser/fixtures/`.
The `index.json` file maps Solr request query strings to response files.

#### Update Solr fixture data

To update the files in `tests/browser/fixtures/`, follow these steps:

1) Make any desired changes to the Solr requests in the
tests.

2) Comment out the `onPrepare` hook code in `tests/browser/conf/wdio.main.conf.js`
that automatically starts the Solr fake (see previous section).

3) Start the Solr fake manually with the `--update-solr-responses-solr-server-url`
option set to the `select` endpoint on the live Solr server to be used for updating
the fixture data:
 
    ```bash
    # At project root
    node node_modules/dlts-solr-fake/cli.js tests/browser/fixtures/index.json tests/browser/fixtures --update-solr-responses-solr-server-url=http://[SOLR HOST]:[PORT]/solr/enm-pages/select --port 3000
    ```

4) Run the tests containing the Solr request changes.

The `index.json` and Solr response files in `tests/browser/fixtures/` will be updated
by the Solr fake.

#### Golden files

The initial golden files were created by a script which generated golden file data
from the Solr fake fixture files in `tests/browser/fixtures/`.  The fixture files
were generated from the live Solr indexes which themselves were programmatically
verified against the metadata files in
[NYULibraries/dlts-epub-metadata](https://github.com/NYULibraries).
 
In the future, if the fixture data for the Solr fake changes, the golden files
can be updated by re-running all tests with environment variable `UPDATE_GOLDEN_FILES`
set to `1`.  Example:

```
UPDATE_GOLDEN_FILES=1 yarn test:browser:local
```

## Query parameters

### `solr`: Solr override

The Solr server used for ENM Search can be overridden using the `solr` query parameter.

Example:

`http://opensquare.nyupress.org/search/?solr=http://stagediscovery.dlib.nyu.edu:8983/solr/enm-pages/`

...informs the application that all Solr requests should be routed to the stage Solr
server instead of the production Solr server.

### `solrErrorSimulation`: intentionally produce Solr request errors for testing purposes

* `?solrErrorSimulation=search`
  * Simulates Solr request error for initial topic/full-text search

## Deployment
```
# Build dev server version, copy to server, and run tests
yarn deploy:dev

# Build stage server version, copy to server, and run tests
yarn deploy:stage

# Build prod server version, copy to server, and run tests
yarn deploy:prod
```

A deploy task does the following:

1) Builds the specified version of the search application
2) Copies it to the appropriate server
3) Runs tests against the newly deployed application 

Note that the scripts assume "devweb1", "stageweb1", and "web1" in ~/.ssh/config.
This is necessary to get the username, which can't be hardcoded in the repo.
It also allows for convenient handling of the tunneling through bastion, if using
a configuration like this:

```
Host bastion
     Hostname b.dlib.nyu.edu
     User     [USERNAME]

Host devdb1
     Hostname devdb1.dlib.nyu.edu
     ProxyCommand ssh bastion -W %h:%p
     User     [USERNAME]
```

## Built With

* [Babel](https://babeljs.io/)
* [ESLint](https://eslint.org/)
* [Selenium](https://www.seleniumhq.org/)
* [Solr](http://lucene.apache.org/solr/)
* [Vue.js](https://vuejs.org/)
* [Vue CLI 3](https://cli.vuejs.org/)
* [Vuex](https://vuex.vuejs.org/)
* [WebdriverIO](https://webdriver.io/)
* [Webpack](https://webpack.js.org/e0b5805d423a4ec9473ee315250968b2.svg)
