# Electron Hot Loader

Live reload Scripts in Electron Applications. Under the hood it uses Chrome's remote debugger protocol, and reloads scripts after each change. The state of the application is maintained.

## INSTALLATION

```sh
$ npm install electron-hot
```

## USAGE

In index.js:

```js
require('electron-hot')();
```

### Options
* port: Port for the debugger
