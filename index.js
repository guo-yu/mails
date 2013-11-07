var path = require('path'),
    engines = {
        jade: require('jade').renderFile,
        swig: require('swig').render
    };

exports.render = function(tpl, params) {
    var template = path.join(__dirname, templates, tpl);
    if (fs.existsSync(template)) {
        // local theme
        return engines[engine](template, params);
    } else {
        // try fetch local module
        var moduleDir = path.resolve(__dirname, '../node_modules/', tpl);
        if (fs.existsSync(moduleDir)) {
            // theme from local modules
            try {
                var pkg = require(path.join(moduleDir, '/package.json'));
                if (pkg.mails && pkg.mails.engine && pkg.mails.template) {
                    return engines[pkg.mails.engine](path.join(moduleDir, pkg.mails.template), params);
                } else {
                    return null;
                }
            } catch (err) {
                return null;
            }
        } else {
            return null;
        }
    }
}