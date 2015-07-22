import should from 'should'
import render from '../dist/render'

describe('render', () => {
  it('#render(): should render a exist template', done => {
    render('basic', {
      title: 'Im a test title'
    }).then(html => {
      done()
    }).catch(done)
  })
})

