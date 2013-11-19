var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    glob = require("glob"),
    juice = require('juice').juiceContent;

// environments
swig.setDefaults({
    cache: false
});

// engines map
exports._render = function(params, callback) {
    var engine = params.engine,
        html = '';
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
    var localTemplate = path.resolve(__dirname, '../templates', tpl + '.html');
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
        var moduleDir = path.resolve(__dirname, '../', template.name);
        if (fs.existsSync(moduleDir)) {
            // themes as local modules
            try {
                var pkg = require(path.join(moduleDir, '/package.json'));
                if (pkg['view engine']) {
                    try {
                        var engine = require(pkg['view engine']);
                        if (template.file) {
                            var file = path.join(moduleDir, template.file);
                            glob(file + '*', function(err, files) {
                                if (!err) {
                                    if (files && files.length > 0) {
                                        exports._render({
                                            template: files[0],
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
                                    callback(err);
                                }
                            });
                        } else {
                            callback(new Error('which template your want to use ?'));
                        }
                    } catch (err) {
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