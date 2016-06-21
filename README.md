### debugger.html

This is a prototype debugger written without any XUL and based on React and Redux.

[![Build Status](https://travis-ci.org/jlongster/debugger.html.svg?branch=master)](https://travis-ci.org/jlongster/debugger.html)

#### Getting Started

* `npm install` - Install Dependencies
* `npm run firefox` - Start Firefox
* `npm start` - Start Debugger

![screen shot 2016-05-16 at 1 24 29 pm](https://cloud.githubusercontent.com/assets/254562/15297643/34575ca6-1b69-11e6-9703-8ba0a029d4f9.png)

#### Running tests
##### Unit Tests
* `npm test` - Run tests headlessly
* `npm run mocha-server` - Run tests in the browser

##### Integration tests
* `npm run cypress` - Run tests headlessly
* `npm run cypress-intermittents` - Runs tests 100 times and writes the output to cypress-run.log
* `cypress open` - Run tests in the browser

**Notes:**
+ Firefox needs to be open and listening on port 6080 before the tests are run. You can start Firefox on the right port with this command `npm run firefox`.
+ Cypress needs to be installed before tests can be run. When you run cypress the first time, you will be prompted to install it. `cypress install`.

##### Linting
* `npm run lint` - Run CSS and JS linter
* `npm run lint-css` - Run CSS linter
* `npm run lint-js` - Run JS linter

##### Miscellaneous
+ `npm run test-all` - Run unit tests, lints, and integration tests

##### Storybook
* `npm run storybook` - Open Storybook

#### Advanced :see_no_evil:

##### User Configuration

You can edit config values in `public/js/configs/development.json`.

Config:
+ `chrome.debug` enable local chrome development

Features
+ `features.sourceTabs` enable editor tabs

##### Remote Debugging
If you'd like to connect an existing Firefox browser to debugger.html, you can press `shift+F2` to open the developer toolbar and type `listen 6080` into the developer toolbar console.

##### Starting Firefox

Sometimes you will want to open firefox manually.

1) open a specific version of firefox
2) use a different profile

It is easy to open firefox with the `firefox-bin` script:

```
$ /Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin -P development --start-debugger-server 6080
```

* *--start-debugger-server 6080* Start Firefox in remote debugging mode.
* *-P development* parameter specifies a profile to use:

Firefox needs to some settings configured in `about:config` to remotely connect to devtools:

- `devtools.debugger.remote-enabled` to `true`
- `devtools.chrome.enabled` to `true`
- `devtools.debugger.prompt-connection` to `false`
