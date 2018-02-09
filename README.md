<p align="center">
  <h2 align="center">Avatar Hash</h2>
  <p align="center">🎭 Generate unique avatars from any text: https://luciorubeens.github.io/avatar-hash/</p>
</p>

<p align="center"><img src="https://i.imgur.com/V7WcroX.png" width="600px" alt="Avatar"></p>
<p align="center">(More shapes and themes soon)</p>

## Installation

```html
<script src='https://luciorubeens.github.io/avatar-hash/dist/avatar-hash.js'></script>

<div class="avatar"></div>
```

## Usage

```javascript
<script>
new AvatarHash('my text').render(document.querySelector('.avatar'))
</script>
```

## Contributing

The "api" is totally customizable, so you can contribute with a design pack for what you want, people, monsters, animals, houses..

- Create folders with the shapes name. Eg: `hair`, `mouth`, ...
- Name the file with the folder name and include a version number. Eg: `hair-01`
- Edit the config file and add your new theme. (Set the name, colors and shapes order)

## Author

- Lúcio Rubens <luciorubeens@gmail.com>
 
## Similar Tools

This project was based on [nimiq/robohash](https://github.com/nimiq/robohash).

- [RoboHash](https://robohash.org)
- [FlatHash](http://flathash.com)

## License

[MIT](LICENSE) © Lúcio Rubens
