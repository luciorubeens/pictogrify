import config from '../config'
import hash from 'string-hash'
import xmldoc from 'xmldoc'
import _ from 'lodash'

const spriteSources = __SPRITE_SOURCES__ // eslint-disable-line no-undef
const spriteXml = _.transform(spriteSources, (result, value, key) => result[key] = new xmldoc.XmlDocument(value).firstChild, {})

export default function setup (text, theme = config.defaultTheme) {
  const options = config.themes[theme]
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

  const symbols = _.transform(spriteXml[theme].children, (result, value) => {
    result[value.attr.id] = value.children.join('')
  }, {})

  return { theme, shapes, colors, fill, symbols }
}
