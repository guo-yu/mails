## ![logo](http://ww2.sinaimg.cn/large/61ff0de3gw1eajmy0wdikj2014014wea.jpg) mails ![npm](https://badge.fury.io/js/mails.png)

Mails 使发送邮件变得更简单与优雅，提高模板复用率。

使用 Mails 内建的标准模板 `mails-default` 来发送邮件，或者快速发布自己的邮件主题，Mails 推荐您把邮件主题发布到 NPM

Mails 内建的标准邮件模板由 [ink](http://zurb.com/ink) 改造而来，对二次开发表现友好，也对各个终端的兼容表现优秀。稍作修改，亦可以适配智能手机等小屏幕终端。

### 如何安装
````
$ npm install mails --save
````

### 快速指引

mails 包括三个部分：

- 一个邮件模板加载器和发送工具（基于 Nodemailer 的 SMTP 服务）  
- 一个支持实时编辑（live reload）的邮件模板设计工具（CLI）  
- 一个快速生成邮件主题项目文件的脚手架工具（CLI）  

如果你是邮件主题开发者，希望分享自己的主题，或者将他们发布到 NPM，你可能会想要使用到第二个与第三个工具；
如果你只是使用 mails 发送邮件的程序员，并不需要了解后两者如何运作，只需了解API的使用方法即可：

### 范例代码
最快上手使用 mails，我们来看一段渲染邮件的代码：
````javascript
var mails = require('mails'); // 引用 mails

// 使用 mails-default/basic 别名渲染邮件模板，并填入对应的变量:
mails.render('mails-default/basic', {
    name: 'The First Email To You',
    banner: 'http://mysite.com/banner.jpg'
}, function(err,html){
    // 得到最终的邮件 html 代码
    if (err) return console.log(err)
    console.log(html);
});

// 如果不需要使用渲染后的片段做其他用途，
// mails 推荐您直接使用 mails.send 发送邮件。
mails.send('mails-default/basic', {
    from: 'xxx <xxx@qq.com>', // 来自您的邮箱
    to: 'abc@qq.com', // 接受者邮箱
    subject: 'hi,abc', // 邮件标题
    // 用做渲染的模板变量
    name: 'mySite',
    banner: 'http://mysite.com/banner.jpg',
    // 用做发送的 smtp 配置
    host: 'smtp.qq.com',
    port: 25,
    use_authentication: true,
    auth: {
        user: "xxx@qq.com",
        pass: 'yourpassword'
    }
}, function(err, response) { ...... });
````

### 加载 NPM 模块作为主题
你可以将 mails 提供的标准邮件主题进行简单的二次开发，然后发布到 NPM 作为您的邮件主题，使他人获益。

在这个例子中，我们使用 `mails-flat` 模块中的 `message` 主题进行邮件渲染：
````javascript
var mails = require('mails');

mails.render('mails-flat/message', { ...... }, function(err, html){
    console.log(html);
});
````
#### 如何进行主题的二次开发

1. 首先，将 mails 作为全局模块安装：

````
$ [sudo] npm install mails -g
````

2. 建立新项目文件夹，初始化邮件主题：

````
$ mkdir my-mails-theme && cd my-mails-theme
$ mails init
````

3. 编辑 `package.json`，这个文件定义了模板引擎的配置，也保存了调试所需要的变量，确保此文件中有正确的 `view engine` 字段：

````
$ vi ./package.json
$ { "view engine": "swig" } // 比如使用swig作为模板引擎
````

4. 使用 live reload 设计工具进行开发

````
// ./package.json 也是存放模板变量的文件
$ mails watch ./package.json [-p] [port] 
````
使用 mails 提供的 live reload 工具进行开发，程序会监听当前文件夹下文件的变动，包括样式表文件，模板文件和提供模板变量的 json 文件。打开相应的端口服务，指定相应文件的url即可访问，比如：
````
$ GET http://localhost:3001/message.html
````


#### 如何发布主题到 NPM
在使用 `npm publish` 发布到社区之前，确认以下几项：
- 确保你的项目中 `package.json` 符合 NPM 社区规范
- 确保 `package.json` 文件中有 `view engine` 字段并且符合邮件模板引擎
- 确保填写了相应的依赖模块名
- 建议在 readme.md 中附上一张模板最终渲染效果的截图

### API
查看这个文件: `index.js`

### 贡献我的代码
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2013 turing

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