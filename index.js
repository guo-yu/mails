var fs = require('fs'),
    path = require('path'),
    swig = require('swig'),
    juice = require('juice').juiceContent;

exports.engines = function(name, func) {
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