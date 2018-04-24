const setup = require('./setup')

const req = require.context('../themes', true, /\.svg$/)
req.keys().forEach(req)

const spriteDist = __SPRITE_DIST__ // eslint-disable-line no-undef

module.exports = class Pictogrify {
  constructor (text, theme) {
    this.prop = setup(text, theme)
  }

  get svg () {
    return Pictogrify.template(this.prop)
  }

  get base64 () {
    const data = Pictogrify.template(this.prop, 'inline')
    return `data:image/svg+xml;base64,${window.btoa(data)}`
  }

  render ($element) {
    $element.innerHTML = this.svg
  }

  download (name, mime = 'image/png') {
    const canvas = document.createElement('canvas')
    canvas.width = this.prop.width
    canvas.height = this.prop.height
    const ctx = canvas.getContext('2d')

    const image = new Image()
    image.onload = () => {
      ctx.drawImage(image, 0, 0)
      const src = canvas.toDataURL(mime)
      const a = document.createElement('a')
      a.download = `${name}.png`
      a.href = src
      a.click()
    }
    image.src = this.base64
  }

  static template (prop, mode = 'use') {
    let includes = []

    for (let item of Object.keys(prop.shapes)) {
      includes.push(Pictogrify.include(prop, item, prop.shapes[item], mode))
    }

    return `
      <svg viewBox="0 0 ${prop.width} ${prop.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>
          <rect fill="${prop.colors.background}" x="0" y="0" width="${prop.width}" height="${prop.height}"></rect>
          ${includes.join('\n')}
        </g>
      </svg>`
  }

  static include (prop, part, index, mode) {
    const fillable = prop.fill[part] ? `fill="${prop.fill[part]}"` : ''

    if (mode === 'use') {
      return `<use class="${part}" ${fillable} xlink:href="${location.origin}${spriteDist.url}${prop.theme}.svg#${part}-${(index)}" />`
    }

    if (mode === 'inline') {
      const svg = prop.symbols[`${part}-${index}`]

      return `
        <svg class="${part}" ${fillable} xmlns="http://www.w3.org/2000/svg">
        ${svg}
        </svg>`
    }
  }
}
