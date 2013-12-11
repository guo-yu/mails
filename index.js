var render = require('./libs/render'),
    mailer = require('./libs/mail'),
    cli = require('./libs/cli').cli;

exports._render = render._render;
exports.render = render.render;
exports.send = mailer.send;
exports.mail = mailer.mail;
exports.cli = cli;