var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    pluse = require('pluse'),
    juice = require('juice').juiceContent,
    DIR = path.resolve(__dirname, '../templates');

// environments
swig.setDefaults({
    cache: false
});

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
    if (fs.existsSync(path.join(DIR, file + '.html'))) return path.join(DIR, file + '.html');
    return false;
};

// shorthand to render module theme
exports.theme = function(file, data, callback, engine) {
    return exports._render({
        template: file,
        data: data,
        engine: engine || { name: 'swig', _engine: swig }
    }, callback);
};

// render mails html
exports.render = function(template, params, callback) {
    var local = exports.check(template);
    if (local) return exports.theme(local, params, callback);
    // try fetch local themes module
    pluse.load(template, function(err, plugin, file){
        if (err) return callback(new Error('theme not existed'));
        if (!plugin) return callback(new Error('theme not found'));
        if (!plugin['view engine']) return callback(new Error('template engine required'));
        if (!file) return callback(new Error('template not found'));
        // if we are going to load a file
        try {
            var engine = require(plugin['view engine']);
            exports.theme(file.dir, params, callback, {
                name: plugin['view engine'],
                _engine: engine
            });
        } catch (err) {
            return callback(new Error('template engine required'));
        }
    });
};
