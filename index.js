var render = require('./libs/render');
var mailer = require('./libs/mail');

exports.send = mailer.send;
exports.mail = mailer.mail;
exports.render = render;