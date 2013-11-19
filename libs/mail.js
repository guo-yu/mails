var nodemailer = require("nodemailer"),
    render = require('./render');

exports.mail = function(params, callback) {
    // smtp config
    var smtpTransport = nodemailer.createTransport("SMTP", params);
    // send mail
    smtpTransport.sendMail({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html
    }, function(error, response) {
        callback(error, response);
        smtpTransport.close();
    });
};

exports.send = function(tpl, params, callback) {
    render(tpl, params, function(err, html){
        if (!err) {
            params.html = html;
            exports.mail(params, callback);
        } else {
            callback(err);
        }
    });
};