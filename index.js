var fs = require('fs'),
    path = require('path'),
    juice = require('juice').juiceContent,
    engines = {
        jade: require('jade').renderFile,
        swig: require('swig').render
    };

exports.render = function(tpl, params, callback) {
    var template = path.join(__dirname, 'templates', tpl + '.jade');
    if (fs.existsSync(template)) {
        // local theme
        juice(engines.jade(template, params),{
            url: 'file://' + template
        }, callback);
    } else {
        // try fetch local module
        if (tpl.indexOf('/') > -1) {
            tpl = { name: tpl.substr(0,tpl.indexOf('/')), file: tpl.substr(tpl.indexOf('/') + 1) }
        } else {
            tpl = { name: tpl }
        }
        var moduleDir = path.resolve(__dirname, '../node_modules/', tpl.name);
        if (fs.existsSync(moduleDir)) {
            // theme from local modules
            try {
                var pkg = require(path.join(moduleDir, '/package.json'));
                if (pkg['view engine']) {
                    // 有没有比较好的方法拿到这个view engine? 在mails模块不依赖它的前提下
                    juice(pkg['view engine'](template, params),{
                        url: 'file://' + template
                    }, callback);
                    callback(null, engines[pkg.mails.engine](path.join(moduleDir, pkg.mails.template), params));
                } else {
                    callback(new Error('template not existed'));
                }
            } catch (err) {
                callback(new Error('template not existed'));
            }
        } else {
            callback(new Error('template not existed'));
        }
    }
}