var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    juice = require('juice').juiceContent,
    optimist = require('optimist'),
    argv = optimist.argv,
    Tao = require('tao'),
    consoler = require('consoler');

// engines map
exports._render = function(params, callback) {
    var engine = params.engine,
        html;
    if (engine.name === 'jade') {
        html = engine._engine.renderFile(params.template, params.data);
    } else if (engine.name === 'swig') {
        html = engine._engine.compileFile(params.template)(params.data);
    } else {
        callback(new Error('template engine not supported'))
        return false;
    }
    juice(html, {
        url: 'file://' + params.template
    }, callback);
}

// render mails html
exports.render = function(tpl, params, callback) {
    var localTemplate = path.join(__dirname, 'templates', tpl + '.html');
    if (fs.existsSync(localTemplate)) {
        // local themes
        exports._render({
            template: localTemplate,
            data: params,
            engine: {
                name: 'swig',
                _engine: swig
            }
        }, callback);
    } else {
        // try fetch local themes module
        var template = {
            name: tpl.indexOf('/') > -1 ? tpl.substr(0, tpl.indexOf('/')) : tpl,
            file: tpl.indexOf('/') > -1 ? tpl.substr(tpl.indexOf('/') + 1) : null
        };
        var moduleDir = path.resolve(__dirname, '../node_modules/', template.name);
        if (fs.existsSync(moduleDir)) {
            // themes as local modules
            try {
                var pkg = require(path.join(moduleDir, '/package.json'));
                if (pkg['view engine']) {
                    try {
                        var engine = require(pkg['view engine']);
                        if (template.file) {
                            var file = path.join(moduleDir, template.file);
                            if (fs.existsSync(file)) {
                                exports._render({
                                    template: file,
                                    data: params,
                                    engine: {
                                        name: pkg['view engine'],
                                        _engine: engine
                                    }
                                }, callback);
                            } else {
                                callback(new Error('selected file not found'));
                            }
                        } else {
                            callback(new Error('which template your want to create mail ?'));
                        }
                    } catch (err) {
                        console.log(err);
                        callback(new Error('view engine not found'));
                    }
                } else {
                    callback(new Error('template engine not select'));
                }
            } catch (err) {
                callback(new Error('template not existed'));
            }
        } else {
            callback(new Error('template not existed'));
        }
    }
};

exports.output = function(file, html, callback) {
    var filename = file.substr(file.lastIndexOf('/') + 1, file.lastIndexOf('.') - file.lastIndexOf('/') - 1) + '.dest.html',
        filedest = path.resolve(file, '../', filename);
    console.log(filedest);
    fs.writeFile(filedest, html, function(err) {
        callback(err, filedest);
    });
};

exports.watcher = function(dir, params) {
    var port = params.port ? params.port : 3001;
    var server = new Tao({
        dir: dir
    });
    server.watch(function(file, event, stat, io) {
        if (params.engine && event !== 'removed') {
            if (file.indexOf('dest') === -1) {
                exports._render({
                    template: file,
                    data: params.data,
                    engine: {
                        name: params.data.engine,
                        _engine: params.engine
                    }
                }, function(err, html) {
                    if (!err) {
                        console.log(html);
                        // compile and emit
                        var socket = "<script src=\"http://localhost:" + (port + 1) + "/socket.io/socket.io.js\"></script><script>var socket = io.connect('http://localhost:" + (port + 1) + "');socket.on('rendered', function (data) {alert(data);});</script>";
                        exports.output(file, html + socket, function(err, dest) {
                            if (!err) {
                                io.sockets.on('connection', function(socket) {
                                    socket.emit('rendered', dest);
                                });
                            } else {
                                consoler.error(err);
                            }
                        });
                    } else {
                        consoler.error(err);
                    }
                });
            }
        }
    });
    server.run(port);
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
                                    port = 3001;
                                self.watcher = exports.watcher(dir, {
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