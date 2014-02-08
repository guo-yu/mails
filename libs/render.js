var Hub = require('pkghub'),
    juice = require('juice').juiceContent;

// 根据指定模板引擎编译 html 
exports.compile = function(params, callback) {
    var html;
    var engine = params.engine;
    var href = {
        url: 'file://' + params.template;
    };
    if (engine.name === 'jade') html = engine._engine.renderFile(params.template, params.data);
    if (engine.name === 'swig') html = engine._engine.compileFile(params.template)(params.data);
    if (!html) return callback(new Error('template engine is not supported'));
    return juice(html, href, callback);
};

// 根据给定的主题名称或者文件名称渲染邮件
// e.g: exports.render('mails-flat/message', {...}, callback);
exports.render = function(template, params, callback) {
    // 加载本地的模块主题
    var hub = new Hub;
    hub.load(template, function(err, theme, file) {
        if (err) return callback(new Error('theme not existed'));
        if (!theme) return callback(new Error('theme not found'));
        if (!theme['view engine']) return callback(new Error('template engine required'));
        if (!file) return callback(new Error('template not found'));
        // 加载模板引擎
        try {
            var engine = require(theme['view engine']);
        } catch (err) {
            return callback(new Error('template engine required'));
        }
        // 加载模板
        try {
            return exports.compile({
                // 如果匹配不到模板文件，取最相似的第一个
                data: params,
                template: file.exist ? file.dir : file.availables[0],
                engine: {
                    name: theme['view engine'],
                    _engine: engine
                }
            }, callback);
        } catch (err) {
            return callback(new Error('template not existed'));
        }
    });
};