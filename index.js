var render = require('./libs/render'),
    mailer = require('./libs/mail');

exports.send = mailer.send;
exports.mail = mailer.mail;
exports._render = render._render;
exports.render = render.render;