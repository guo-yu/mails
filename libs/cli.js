var fs = require('fs'),
    path = require('path'),
    exeq = require('exeq'),
    consoler = require('consoler'),
    optimist = require('optimist'),
    argv = optimist.argv,
    serve = require('./serve'),
    sys = require('../package.json');

var commands = {
    init: function(self, pkg, dir) {
        var init = exeq([
            'git clone ' + sys.repository.url + ' .',
            'rm -rf .git',
            'rm -rf bin',
            'rm index.js cli.js package.json README.md README.en.md LICENSE',
            'cp ./package.sample.json ./package.json',
            'rm package.sample.json',
            'cp ./README.sample.md ./README.md',
            'rm README.sample.md',
            'npm install'
        ]);
        init.on('done', function(count) {
            return consoler.success('another mails theme created, enjoy!');
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
exports = module.exports = function() {
    var arguments = argv._,
        command = arguments[0];
    if (!command) return false;
    if (!commands[command]) return false;
    return commands[command](this, arguments[1], process.cwd());
};
