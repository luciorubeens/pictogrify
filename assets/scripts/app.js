// Randomize the jumbotron background
const gradients = ['bg-1', 'bg-2', 'bg-3', 'bg-4']
const randomGradient = Math.floor(Math.random() * gradients.length) + 1

document.querySelector('.jumbotron').classList.add(gradients[randomGradient - 1])

// Render multiple svgs
const now = Date.now()
document.querySelectorAll('.pictogram').forEach((e, i) => {
  const theme = e.getAttribute('data-theme')
  const pic = new Pictogrify(now + 'pictogram' + i * Math.random(), theme)
  pic.render(e)
})

// Listen the query event
const queryInput = document.querySelector('.query')
const queryAvatar = document.querySelector('.avatar-query')

queryInput.addEventListener('keyup', function (e) {
  const theme = queryAvatar.getAttribute('data-theme')
  const value = queryInput.value && queryInput.value.length > 0 ? queryInput.value : 'pictogram'
  new Pictogrify(value, theme).render(queryAvatar)
})
