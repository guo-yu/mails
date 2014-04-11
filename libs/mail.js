var nodemailer = require("nodemailer");
var render = require('./render').render;

// 发送邮件
exports.mail = function(params, callback) {
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
};

// 根据某个主题渲染并发送邮件
exports.send = function(tpl, params, callback) {
  return render(tpl, params, function(err, html) {
    if (err) return callback(err);
    params.html = html;
    return exports.mail(params, callback);
  });
};