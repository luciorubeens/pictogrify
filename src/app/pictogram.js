import setup from './setup'
import config from '../config'

const files = require.context('../themes', true, /\.svg$/)
files.keys().forEach(files)

export default class Pictogrify {
  constructor (text, theme) {
    this.prop = setup(text, theme)
  }

  get svg () {
    return template(this.prop)
  }

  get base64 () {
    return `data:image/svg+xml;base64,${Buffer.from(this.svg).toString('base64')}`
  }

  render ($element) {
    $element.innerHTML = this.svg
  }
}

function template (prop) {
  let uses = []

  for (let item of Object.keys(prop.shapes)) {
    uses.push(use(prop, item, prop.shapes[item]))
  }

  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/2000/xlink">
      <g>
        <rect fill="${prop.colors.background}" x="0" y="0" width="200" height="200"></rect>
        ${uses.join('\n')}
      </g>
    </svg>`
}

function use (prop, part, index) {
  let fillable = prop.fill[part] ? `fill="${prop.fill[part]}"` : ''
  return `<use class="${part}" ${fillable} xlink:href="${location.origin}${sprite.url}#${part}-${(index)}" />`
}
