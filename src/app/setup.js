import config from '../config'
import hash from 'string-hash'
import xmldoc from 'xmldoc'
import _ from 'lodash'

const spriteXml = new xmldoc.XmlDocument(__SPRITE_FILE__).firstChild // defs

export function setup (text, theme) {
  const options = config.themes[theme || config.defaultTheme]
  const uid = ('' + hash(text)).replace(/0/g, '1').split('')

  const shapes = _(options.shapes)
                    .keys()
                    .map((shape, index) => [shape, uid[index] > options.shapes[shape].length ? '01' : _.padStart(uid[index], 2, '0')])
                    .fromPairs()
                    .value()

  const colors = _(options.colors)
                    .keys()
                    .map((color, index) => {
                      const item = options.colors[color]
                      const maxLength = item.length - 1

                      return [color, uid[index] > maxLength ? item[1] : item[uid[index]]]
                    })
                    .fromPairs()
                    .value()

  const fill = _(options.shapes)
                  .mapValues((shape) => colors[shape.fill])
                  .pickBy(_.identity)
                  .value()

  return { shapes, colors, fill }
}

export function getSymbols () {
  return _.transform(spriteXml.children, (result, value) => {
    result[value.attr.id] = value.children.join('')
  }, {})
}
