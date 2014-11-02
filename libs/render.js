var render = require('pkghub-render');
var juice = require('juice').juiceContent;

module.exports = renderer;

/**
 * [根据给定的主题名称或者文件名称渲染邮件]
 * @param  {String}   template [description]
 * @param  {Object}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 * @example
 *   exports.render('mails-flat/message', {...}, callback);
 */
function renderer(template, data, callback) {
  var href = {};
  return render(template, data, function(err, html, dest) {
    if (err) 
      return callback(err);
    
    href.url = 'file://' + dest;
    return juice(html, href, callback);
  });
}