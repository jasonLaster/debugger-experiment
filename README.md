### debugger.html

This is a prototype debugger written without any XUL and based on React and Redux.

#### Getting Started

```js
$ npm install
$ npm start
```

Start Firefox in remote debugging mode and go to a tab you want to debug.

```
npm run start-firefox
```

NOTE: you might need to enable two settings in your browsers settings. Go to `about:config` and set `devtools.debugger.remote-enabled`, `devtools.chrome.enabled` to true.

Go to the Debugger!

```
$ localhost:8000
```


#### Advanced

##### User Settings

You can add an `environment.json` to customize your local environment. Start by copying `environment.json.sample`.

```json
{
  "firefoxBinDir": "/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox-bin"  
}
```

#### Quickly Running Firefox

If you have [Firefox DeveloperEdition](https://www.mozilla.org/en-US/firefox/developer/) installed, you can easily start firefox with this command `npm run start-firefox`.

You can also run start firefox nightly, by changing the `firefoxBinDir` field in environment.json.

NOTE: for some reason `npm run start-firefox` fails when trying to start Firefox.app.
If you want to start Firefox.app, you can run the command directly:

```
/Applications/Firefox.app/Contents/MacOS/firefox-bin --start-debugger-server 6080
```


##### Remote Debugging

If you'd like to connect an existing browser to debugger.html, you can press "shift+F2" and type "listen" with the port 6080.
