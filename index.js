var render = require('./libs/render'),
    mailer = require('./libs/mail');

exports.send = mailer.send;
exports.mail = mailer.mail;
exports.compile = render.compile;
exports.render = render.render;