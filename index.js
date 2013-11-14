var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    juice = require('juice').juiceContent,
    optimist = require('optimist'),
    argv = optimist.argv,
    Tao = require('tao');

// engines map
exports._render = function(params) {
    // return func: (file, params);
    var engines = {
        jade: func.renderFile,
        swig: func.compileFile
    };
    if (engines[name]) {
        return engines[name];
    } else {
        return engines.jade;
    }
}

// render mails html
exports.render = function(tpl, params, callback) {
    var localTemplate = path.join(__dirname, 'templates', tpl + '.html');
    if (fs.existsSync(localTemplate)) {
        // local themes
        juice(swig.compileFile(localTemplate)(params), {
            url: 'file://' + localTemplate
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
                                juice(engines(pkg['view engine'], engine)(file, params), {
                                    url: 'file://' + file
                                }, callback);
                            } else {
                                callback(new Error('selected file not found'))
                            }
                        } else {
                            callback(new Error('which template your want to create mail ?'))
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
    var filename = file.substr(file.lastIndexOf('/') + 1, file.lastIndexOf('.') - 1) + '.dest.html';
    var filedest = path.reslove(file, './' + filename);
    console.log(filename);
    console.log(filedest);
    fs.writeFile(filedest,html,function(err){
        callback(err, filedest);
    });
};

// mails(1)
exports.cli = function() {
    var arguments = argv._,
        command = arguments[0],
        data = arguments[1],
        dir = process.cwd(),
        self = this;
    if (command == 'watch') {
        var server = new Tao({ dir: dir });
        if (data) {
            fs.readFile(path.reslove(dir, data), function(err, file) {
                if (!err) {
                    try {
                        var data = JSON.parse(file);
                        if (data.engine) {
                            try {
                                var engine = require(path.join(dir, './node_modules/', data.engine));
                                self.engine = engine;
                                self.data = data;
                            } catch (err) {
                                consoler.error('view engine required');
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
                    consoler.error('configs required');
                    return false;
                }
            })
        } else {
            consoler.error('configs required');
            return false;
        }
        server.watch(function(file, event, stat, io) {
            if (self.engine && event !== 'removed') {
                exports._render({
                    template: file,
                    data: self.data,
                    engine: {
                        name: self.data.engine, 
                        engine: self.engine
                    }
                }, function(err, html) {
                    if (!err) {
                        // compile and emit
                        exports.output(file, html, function(err, dest){
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
        });
        server.run();
    }
}