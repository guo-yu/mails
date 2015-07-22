import should from 'should'
import render from '../dist/render'

describe('Mails', () => {
  it('#render(): should render a exist template', done => {
    render('basic', {
      title: 'Im a test title'
    }).then(html => {
      done()
    }).catch(done)
  })

  it('#render(): should NOT render a unexist template', done => {
    render('not-this-file', {
      title: 'Im a test title'
    }).then(html => {
      done(new Error('WTF'))
    }).catch(err => done())
  })

  it('#render(): should render a third-party module template', done => {
    render('mails-flat/message', {
      footer: {
        a: 'http://adbc.com'
      }
    }).then(html => {
      done()
    }).catch(done)
  })
})
