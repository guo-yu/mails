var render = require('./render').render;

exports.mail = mail;
exports.send = send;

function mail(params, callback) {
  var smtpTransport = nodemailer.createTransport("SMTP", params);
  return smtpTransport.sendMail({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html
  }, function(error, response) {
    callback(error, response);
    return smtpTransport.close()
  })
}
