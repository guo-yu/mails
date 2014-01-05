var fs = require('fs'),
    path = require('path'),
    render = require('./render'),
    Tao = require('tao'),
    optimist = require('optimist'),
    argv = optimist.argv,
    consoler = require('consoler'),
    exeq = require('exeq'),
    sys = require('../package.json');

var socketclient = function(port, html) {
    return html + "<script src=\"http://localhost:" + (port + 1) + "/socket.io/socket.io.js\"></script><script>var socket = io.connect('http://localhost:" + (port + 1) + "');socket.on('updated', function (result) { window.location.reload(); });</script>";
};

exports.serve = function(dir, params, callback) {
    // 初始化服务
    var server = new Tao({
        dir: dir,
        port: params.port,
        socket: true
    });

    // 直接访问时渲染页面
    server.use(function(req, res, next) {
        if (req.url === '/') return res.end('ok');
        return next();
    });

    server.use(function(req, res, next) {
        var file = req._parsedUrl.pathname,
            afterfix = file.substr(file.lastIndexOf('.') + 1);
        fs.exists(path.join(dir, file), function(exist) {
            if (!exist) return res.end('404');
            if (afterfix === 'json') return res.end(fs.readFileSync(path.join(dir, file)));
            render._render({
                template: path.join(dir, file),
                data: JSON.parse(fs.readFileSync(params.pkg)),
                engine: {
                    name: params.data['view engine'],
                    _engine: params.engine
                }
            }, function(err, html) {
                if (err) return res.end('render error: ' + err.toString());
                res.end(socketclient(server.configs.port, html));
            });
        })
    });

    // 检测到模板变动时刷新页面
    server.watch(function(event, file, stat) {
        if (!(params.engine && event !== 'removed')) return false;
        server.emit('updated', {
            stat: 'ok',
            file: file
        });
    });

    server.run();

    return server;
};

// mails(1)
exports.cli = function() {

    var arguments = argv._,
        command = arguments[0],
        pkg = arguments[1],
        dir = process.cwd(),
        self = this;

    if (command == 'watch') {
        if (!pkg) return consoler.error('configs required');
        pkg = pkg.toString();
        fs.readFile(path.resolve(dir, pkg), function(err, file) {
            if (err) return consoler.log('404', 'configs not found');
            try {
                var data = JSON.parse(file);
                if (data['view engine']) {
                    try {
                        var engine = require(data['view engine']),
                            port = argv.p && !isNaN(parseInt(argv.p, 10)) ? parseInt(argv.p, 10) : 3001;
                        self.server = exports.serve(dir, {
                            port: port,
                            engine: engine,
                            data: data,
                            pkg: path.resolve(dir, pkg)
                        });
                        consoler.success('Mails is watching: http://localhost:' + port);
                    } catch (err) {
                        consoler.error('view engine required');
                        consoler.error(err);
                        return false;
                    }
                } else {
                    return consoler.error('view engine required');
                }
            } catch (err) {
                return consoler.error('configs format must be json');
            }
        });
    } else if (command == 'init') {
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
            consoler.success('another mails theme created, enjoy!');
        });
        init.run();
    } else {
        return false;
    }
};