const navButton = document.getElementById('menu-button')
const navBar = document.getElementById('navbar')
let navBarOpen = false

navButton.addEventListener('click', _ => {
    if (!navBarOpen) {
	navBar.classList.remove('nav-is-open')
	navBar.classList.add('nav-is-open')
	navBarOpen = true
    } else {
	navBar.classList.remove('nav-is-open')
	navBar.classList.add('nav-is-closed')	
	navBarOpen = false
    }
});
