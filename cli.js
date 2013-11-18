var fs = require('fs'),
    path = require('path'),
    mails = require('./index'),
    Tao = require('tao'),
    optimist = require('optimist'),
    argv = optimist.argv,
    consoler = require('consoler');

exports.socket = function(port, html) {
    var socket = "<script src=\"http://localhost:" + (port + 1) + "/socket.io/socket.io.js\"></script><script>var socket = io.connect('http://localhost:" + (port + 1) + "');socket.on('rendered', function (result) { if (result.stat === 'ok' && result.html) { document.write(result.html); } });</script>";
    return html + socket;
}

exports.serve = function(dir, params, callback) {
    // 初始化服务
    var server = new Tao({
        dir: dir,
        port: params.port,
        socket: true
    });
    // 直接访问时渲染页面
    server.use(function(req, res, next){
        if (req.url === '/') {
            res.end('ok');
        } else {
            next();
        }
    });
    server.use(function(req, res, next) {
        var file = req._parsedUrl.pathname,
            afterfix = file.substr(file.lastIndexOf('.') + 1);
        fs.exists(path.join(dir, file), function(exist) {
            if (exist) {
                if (afterfix !== 'json') {
                    mails._render({
                        template: file,
                        data: params.data,
                        engine: {
                            name: params.data.engine,
                            _engine: params.engine
                        }
                    }, function(err, html) {
                        if (!err) {
                            res.end(exports.socket(server.configs.port, html));
                        } else {
                            res.end('render error: ' + err.toString());
                        }
                    })
                } else {
                    res.end(fs.readFileSync(path.join(dir, file)));
                }
            } else {
                res.end('404');
            }
        })
    });
    // 当页面源码变动时传回页面源代码
    server.watch(function(event, file, stat) {
        var afterfix = file.substr(file.lastIndexOf('.') + 1);
        if (params.engine && event !== 'removed' && afterfix !== 'json') {
            mails._render({
                template: file,
                data: params.data,
                engine: {
                    name: params.data.engine,
                    _engine: params.engine
                }
            }, function(err, html) {
                if (!err) {
                    server.emit('rendered', {
                        stat: 'ok',
                        file: file,
                        html: exports.socket(server.configs.port, html)
                    });
                } else {
                    server.emit('error', {
                        stat: 'error',
                        file: file,
                        error: err
                    });
                    consoler.error(err);
                }
            });
        }
    });
    server.run();
    return server;
}

// mails(1)
exports.cli = function() {
    var arguments = argv._,
        command = arguments[0],
        data = arguments[1],
        dir = process.cwd(),
        self = this;

    if (command == 'watch') {
        if (data) {
            fs.readFile(path.resolve(dir, data.toString()), function(err, file) {
                if (!err) {
                    try {
                        var data = JSON.parse(file);
                        if (data.engine) {
                            try {
                                var engine = require(data.engine),
                                    port = argv.p && !isNaN(parseInt(argv.p, 10)) ? parseInt(argv.p, 10) : 3001;
                                self.server = exports.serve(dir, {
                                    port: port,
                                    engine: engine,
                                    data: data
                                });
                                consoler.success('Mails is watching: http://localhost:' + port);
                            } catch (err) {
                                consoler.error('view engine required');
                                consoler.error(err);
                                return false;
                            }
                        } else {
                            consoler.error('view engine required');
                            return false;
                        }
                    } catch (err) {
                        consoler.error('configs format must be json');
                        return false;
                    }
                } else {
                    consoler.log('404', 'configs not found');
                    return false;
                }
            })
        } else {
            consoler.error('configs required');
            return false;
        }
    } else {
        return false;
    }
}