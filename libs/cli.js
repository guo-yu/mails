var fs = require('fs');
var path = require('path');
var exeq = require('exeq');
var consoler = require('consoler');
var optimist = require('optimist');
var argv = optimist.argv;
var serve = require('./serve');

module.exports = cli;

var commands = {
  init: function(self, pkg, dir) {
    var commands = [
      'git clone https://github.com/turingou/mails-scaffold.git .',
      'rm -rf .git',
      'npm install'
    ];

    exeq(commands)
      .on('done', done);
      .run();

    function done(count) {
      consoler.success('another mail theme created, enjoy!');
    }
  },
  watch: function(self, pkg, dir) {
    if (!pkg) 
      return consoler.error('configs required');

    pkg = pkg.toString();

    fs.readFile(path.resolve(dir, pkg), watch);

    function watch(err, file) {
      if (err) 
        return consoler.log('404', 'configs not found');

      try {
        var data = JSON.parse(file);
        if (!data['view engine']) 
          return consoler.error('view engine required');

        try {
          var engine = require(data['view engine']);
          var port = argv.p && !isNaN(parseInt(argv.p, 10)) ? parseInt(argv.p, 10) : 3001;

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
    }
  }
}

function cli() {
  var arguments = argv._;
  var command = arguments[0];
  if (!command)
    return false;
  if (!commands[command])
    return false;

  return commands[command](this, arguments[1], process.cwd());
}
