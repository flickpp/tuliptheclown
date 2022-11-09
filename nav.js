const navButton = document.getElementById('menu-button')
const navBar = document.getElementById('navbar')
const navIcon = document.getElementById('control-bar__navicon')
let navBarOpen = false

// Footer
const footer = document.getElementById('footer')

navButton.onclick = () => {
  if (!navBarOpen) {
    navBar.classList.remove('nav-is-closed')
    navBar.classList.add('nav-is-open')
    navIcon.src =
        "../images/47029440df7f75de6acc77333c4d54067a1f0870d82ade5ef0092edce7246659.png"
    navBarOpen = true
  } else {
    navBar.classList.remove('nav-is-open')
    navBar.classList.add('nav-is-closed')
    navIcon.src =
        "../images/04e86f62a3a279f7dc7d4feb4bc9d99d739692029b71bd8293bcc86e848d6914.png"
    navBarOpen = false
  }
}
