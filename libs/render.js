var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    pluse = require('pluse'),
    juice = require('juice').juiceContent;

// environments
swig.setDefaults({
    cache: false
});

// dirs
var dirs = {
    local: path.resolve(__dirname, '../templates'),
    parent: path.resolve(__dirname, '../../')
};

// engines map
exports._render = function(params, callback) {
    var engine = params.engine, html;
    if (engine.name === 'jade') html = engine._engine.renderFile(params.template, params.data);
    if (engine.name === 'swig') html = engine._engine.compileFile(params.template)(params.data);
    if (!html) return callback(new Error('template engine is not supported'));
    return juice(html, { url: 'file://' + params.template }, callback);
};

// check local theme file
exports.check = function(file) {
    if fs.existsSync(path.join(dirs.local, file + '.html')) return path.join(dirs.local, file + '.html');
    return false;
};

// shorthand to render local theme
exports.local = function(file, data, callback) {
    return exports._render({
        template: file,
        data: data,
        engine: {
            name: 'swig',
            _engine: swig
        }
    }, callback);
};

// shorthand to render module theme
exports.theme = function(file, data, engine, callback) {
    return exports._render({
        template: file,
        data: data,
        engine: engine
    }, callback);
};

// render mails html
exports.render = function(template, params, callback) {
    var local = exports.check(template);
    if (local) return exports.local(local, params, callback);
    // try fetch local themes module
    pluse.load(template, function(err, plugin, file){
        if (err) return callback(new Error('theme not existed'));
        if (!plugin) return callback(new Error('theme not found'));
        if (!plugin['view engine']) return callback(new Error('template engine required'));
        if (!file) return callback(new Error('template not found'));
        // if we are going to load a file
        try {
            var engine = require(plugin['view engine']);
            exports.theme(file.dir, params, {
                name: plugin['view engine'],
                _engine: engine
            }, callback);
        } catch (err) {
            return callback(new Error('template engine required'));
        }
    });
};
