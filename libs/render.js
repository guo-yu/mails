import juice from 'juice'
import Promise from 'bluebird'
import render from 'pkghub-render'

/**
 * 根据给定的主题名称或者文件名称渲染邮件
 * @example
 *   render('mails-flat/message', {...}).then(inlineHTML).catch(err)
 */
export default function(template, data) {
  return render(template, data).then(html => {
    try {
      return Promise.resolve(juice(html))
    } catch (err) {
      return Promise.reject(err)
    }
  })
}