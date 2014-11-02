var fs     = require('fs');
var Tao    = require('tao');
var path   = require('path');
var render = require('./render');

module.exports = serve;

/**
 * [开发 mails 主题的辅助工具, 监听本地文件变动，并实时刷新页面]
 * @param  {[String|Path]}   dir      [description]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function serve(dir, params, callback) {
  var server = new Tao({
    dir: dir,
    port: params.port,
    socket: true
  });

  // 直接访问时渲染页面
  server.use(function(req, res, next) {
    if (req.url === '/') 
      return res.end('ok');
    
    return next();
  });

  server.use(function(req, res, next) {
    var file = req._parsedUrl.pathname;
    var afterfix = file.substr(file.lastIndexOf('.') + 1);

    fs.exists(path.join(dir, file), function(exist) {
      if (!exist) 
        return res.end('404');

      if (afterfix === 'json') 
        return res.end(fs.readFileSync(path.join(dir, file)));

      render._render({
        template: path.join(dir, file),
        data: JSON.parse(fs.readFileSync(params.pkg)),
        engine: {
          name: params.data['view engine'],
          _engine: params.engine
        }
      }, function(err, html) {
        if (err) 
          return res.end('render error: ' + err.toString());

        res.end(socketclient(server.configs.port, html));
      });
    })
  });

  // 检测到模板变动时刷新页面
  server.watch(function(event, file, stat) {
    if (!(params.engine && event !== 'removed')) return false;
    server.emit('updated', {
      stat: 'ok',
      file: file
    });
  });

  server.run();

  return server;
};

function socketclient(port, html) {
  return html + "<script src=\"http://localhost:" + (port + 1) + "/socket.io/socket.io.js\"></script><script>var socket = io.connect('http://localhost:" + (port + 1) + "');socket.on('updated', function (result) { window.location.reload(); });</script>";
};
