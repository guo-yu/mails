'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _juice = require('juice');

var _juice2 = _interopRequireDefault(_juice);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _pkghubRender = require('pkghub-render');

/**
 * 根据给定的主题名称或者文件名称渲染邮件
 * @example
 *   render('mails-flat/message', {...}).then(inlineHTML).catch(err)
 */

var _pkghubRender2 = _interopRequireDefault(_pkghubRender);

exports['default'] = function (template, data) {
  return (0, _pkghubRender2['default'])(template, data).then(function (html) {
    try {
      return _bluebird2['default'].resolve((0, _juice2['default'])(html));
    } catch (err) {
      return _bluebird2['default'].reject(err);
    }
  });
};

module.exports = exports['default'];
//# sourceMappingURL=render.js.map