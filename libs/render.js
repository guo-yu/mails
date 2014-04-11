var render = require('pkghub-render');
var juice = require('juice').juiceContent;

// 根据给定的主题名称或者文件名称渲染邮件
// e.g: exports.render('mails-flat/message', {...}, callback);
module.exports = function(template, data, callback) {
  var href = {};
  return render(template, data, function(err, html, dest) {
    if (err) return callback(err);
    href.url = 'file://' + dest;
    return juice(html, href, callback);
  });
}