const colors = require('./colors.json')

module.exports = {
  'defaultTheme': 'male-flat',
  'themes': {
    'male-flat': {
      'name': 'Male Flat',
      'shapes': {
        'body': {
          'length': 1,
          'fill': 'skin',
          'currentColor': '#ffbd9d'
        },
        'beard': {
          'length': 5,
          'fill': 'foreground',
          'currentColor': '#84483d'
        },
        'nose': {
          'length': 5,
        },
        'mouth': {
          'length': 5
        },
        'eye': {
          'length': 5,
          'fill': 'eye',
          'currentColor': '#323232',
        },
        'eyebrow': {
          'length': 5,
        },
        'hair': {
          'length': 9,
          'fill': 'foreground',
          'currentColor': '#84483d'
        }
      },
      'colors': {
        'background': [
          colors['red-a700'],
          colors['pink-a700'],
          colors['purple-a700'],
          colors['deep-purple-a700'],
          colors['indigo-a700'],
          colors['blue-a700'],
          colors['cyan-a700'],
          colors['teal-a700'],
          colors['amber-a700'],
          colors['light-blue-a700'],
        ],
        'foreground': [
          colors['brown-800'],
          colors['cyan-a200'],
          colors['grey-800'],
          colors['blue-grey-800'],
          colors['orange-300'],
          colors['yellow-300'],
          colors['grey-100'],
          colors['dark-blue-100']
        ],
        'eye': [
          colors['green-800'],
          colors['blue-800'],
          colors['brown-800'],
          colors['grey-800'],
          colors['black']
        ],
        'skin': [
          colors['skin-100'],
          colors['skin-200'],
          colors['skin-300'],
          colors['brown-200'],
          colors['brown-300'],
          colors['brown-400'],
        ]
      }
    }
  }
}
