## ![logo](http://ww2.sinaimg.cn/large/61ff0de3gw1eajmy0wdikj2014014wea.jpg) mails ![npm](https://badge.fury.io/js/mails.png)

Send beautiful emails made easy, with responsive templates built in.

Mails supports [ink](http://zurb.com/ink) responsive email template now!

### Installation
```bash
$ npm install mails
```

### Example
```js
var mails = require('mails');

// Use built in templates
mail.render('basic', {
  name: 'mySite',
  banner: 'http://mysite.com/banner.jpg'
}, function(err,html){
  if (!err) {
    console.log(html);
  } else {
    console.log(err);
  }
});
```
### Built-in themes
Mails supports several kinds of themes, they are:

- ink themes:
  - basic
  - hero
  - newsletter
  - sidebar
  - sidebar-hero
- mails theme:
  - one

#### built-in theme useage:
```js
var mails = require('mails');

mails.render('basic', {
  name: 'mySite',
  banner: 'http://mysite.com/banner.jpg'
}, function(err, html){
  // do sth.
});
```
#### built-in theme variables:
Take a look:
(screenshots coming soon...)

### Templates as NPM modules
You can also push templates as NPM modules, like this:
```js
var mails = require('mails');

// Using templates named `single` under module `mails-mailmao`
mails.render('mails-mailmao/single', {
    name: 'mySite',
    banner: 'http://mysite.com/banner.jpg'
}, function(err, html){
    // do sth.
});
```
please feel free to publish your templates to NPM.

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2013 turing &lt;o.u.turing@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor](https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/doctor.png)
generated using [docor](https://github.com/turingou/docor.git) @ 0.1.0. brought to you by [turingou](https://github.com/turingou)