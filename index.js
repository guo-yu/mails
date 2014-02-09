var render = require('./libs/render'),
    mailer = require('./libs/mail');

exports.send = mailer.send;
exports.mail = mailer.mail;
exports.render = render;