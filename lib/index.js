var app = require('app');
var remote = require('chrome-remote-interface');
var chokidar = require('chokidar');
var debug = require('util').debuglog('electron-hot');
var fs = require('fs');

var scriptIds = {};
var watcher;

function connectToClient(port) {
  return new Promise(function(resolve, reject) {
    remote({
      port: port
    }, function(client) {
      resolve(client);
    }).on('error', function() {
      reject(Error('Unable to connect to client'));
    });
  });
}

module.exports = function(options) {
  options = options || {};
  options.port = options.port || 9222;

  app.commandLine.appendSwitch('remote-debugging-port', options.port.toString());

  app.on('ready', function() {
    connectToClient(options.port).then(function(client) {
      client.Debugger.scriptParsed(function(script) {
        debug('=> ' + script.url);
        var url = script.url;
        if (url.indexOf('file://') > -1) {
          url = url.replace('file://', '');
        }
        if (scriptIds[url]) return;
        scriptIds[url] = script.scriptId;
        if (!watcher) {
          watcher = chokidar.watch(url);
          watcher.on('change', function(path) {
            debug('~> ' + path + ' @ ' + scriptIds[path]);
            var scriptId = scriptIds[path];
            if (scriptId) {
              fs.readFile(path, {
                encoding: 'utf-8'
              }, function(err, data) {
                if (err) throw err;
                debug(data);
                client.Debugger.setScriptSource({
                  scriptId: scriptId,
                  scriptSource: data
                }, function(err, data) {
                  if (err) throw err;
                  debug(data);
                });
              });
            }
          });
        } else {
          watcher.add(url);
        }
      });
      // TODO Handle script failed to parse
      client.Debugger.enable();
    });
  });
};
