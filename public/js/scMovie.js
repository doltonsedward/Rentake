const parties = document.querySelector('.parties')
setTimeout(function() {
  parties.classList.add('end-loader')
  parties.classList.remove('have-loader')
}, 2000)