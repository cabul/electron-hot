var app = require('app');
var remote = require('chrome-remote-interface');
var chokidar = require('chokidar');
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

  app.on('quit', function() {
    if (watcher) {
      watcher.close();
      watcher = null;
    }
  });

  app.on('ready', function() {
    connectToClient(options.port).then(function(client) {
      client.Debugger.scriptParsed(function(script) {
        if (script.url.indexOf('file://') === -1) return;
        var url = script.url.replace('file://', '');
        if (scriptIds[url]) return;
        scriptIds[url] = script.scriptId;
        if (!watcher) {
          watcher = chokidar.watch(url);
          watcher.on('change', function(path) {
            var scriptId = scriptIds[path];
            fs.readFile(path, {
              encoding: 'utf-8'
            }, function(err, data) {
              if (err) throw err;
              client.Debugger.setScriptSource({
                scriptId: scriptId,
                scriptSource: data
              }, function(err) {
                if (err) throw err;
              });
            });
          });
        } else {
          watcher.add(url);
        }
      });
      client.Debugger.enable();
    });
  });

};
