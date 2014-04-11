var fs = require('fs');
var path = require('path');
var exeq = require('exeq');
var consoler = require('consoler');
var optimist = require('optimist');
var argv = optimist.argv;
var serve = require('./serve');

var commands = {
  init: function(self, pkg, dir) {
    var init = exeq([
      'git clone https://github.com/turingou/mails-scaffold.git .',
      'rm -rf .git',
      'npm install'
    ]);
    init.on('done', function(count) {
      return consoler.success('another mail theme created, enjoy!');
    });
    init.run();
  },
  watch: function(self, pkg, dir) {
    if (!pkg) return consoler.error('configs required');
    pkg = pkg.toString();
    fs.readFile(path.resolve(dir, pkg), function(err, file) {
      if (err) return consoler.log('404', 'configs not found');
      try {
        var data = JSON.parse(file);
        if (!data['view engine']) return consoler.error('view engine required');
        try {
          var engine = require(data['view engine']),
            port = argv.p && !isNaN(parseInt(argv.p, 10)) ? parseInt(argv.p, 10) : 3001;
          self.server = serve(dir, {
            port: port,
            engine: engine,
            data: data,
            pkg: path.resolve(dir, pkg)
          });
          return consoler.success('Mails is watching: http://localhost:' + port);
        } catch (err) {
          consoler.error('view engine required');
          consoler.error(err);
          return false;
        }
      } catch (err) {
        return consoler.error('configs format must be json');
      }
    });
  }
}

// mails(1)
module.exports = function() {
  var arguments = argv._;
  var command = arguments[0];
  if (!command) return false;
  if (!commands[command]) return false;
  return commands[command](this, arguments[1], process.cwd());
};