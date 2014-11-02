var nodemailer = require("nodemailer");
var render = require('./render').render;

exports.mail = mail;
exports.send = send;

/**
 * [Send Mails]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function mail(params, callback) {
  var smtpTransport = nodemailer.createTransport("SMTP", params);
  return smtpTransport.sendMail({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html
  }, function(error, response) {
    callback(error, response);
    return smtpTransport.close();
  });
}

/**
 * [根据某个主题渲染并发送邮件]
 * @param  {[type]}   tpl      [description]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function send(tpl, params, callback) {
  return render(tpl, params, function(err, html) {
    if (err) return callback(err);
    params.html = html;
    return exports.mail(params, callback);
  });
}
