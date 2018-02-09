// Randomize the jumbotron background
const gradients = ['bg-1', 'bg-2', 'bg-3', 'bg-4']
const randomGradient = Math.floor(Math.random() * gradients.length) + 1

document.querySelector('.jumbotron').classList.add(gradients[randomGradient - 1])

// Render multiple svgs
const now = Date.now()
document.querySelectorAll('.avatar-hash').forEach((e, i) => new AvatarHash(now + 'avatar-hash' + i * Math.random()).render(e))

// Listen the query event
const queryInput = document.querySelector('.query')
const queryAvatar = document.querySelector('.avatar-query')

queryInput.addEventListener('keyup', function (e) {
  const value = queryInput.value && queryInput.value.length > 0 ? queryInput.value : 'avatar-hash'
  new AvatarHash(value).render(queryAvatar)
})
