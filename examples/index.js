var fs = require('fs'),
    mails = require('../index');

mails.render('mails-default/basic', {
    title: 'mySite2',
    desc: 'http://mysite.com/banner.jpg'
}, function(err, html) {
    // 得到最终的邮件 html 代码
    if (err) return console.log(err);
    fs.writeFileSync(__dirname + '/demo.html', html);
    return console.log('email saved!');
});