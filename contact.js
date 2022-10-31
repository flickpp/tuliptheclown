
const contactName = document.getElementById('contact-name')
const contactPhoneOrEmail = document.getElementById('contact-method')
const contactMessage = document.getElementById('contact-text')
const button = document.getElementById('contact-button')

button.addEventListener('click', _ => {
    let body = {
	name: contactName.value,
	phoneOrEmail: contactPhoneOrEmail.value,
	message: contactMessage.value
    }

    const r = new Request("https://api.jameswelchman.com/tuliptheclown/message", {
	method: "POST",
	headers: {
	    "Content-Type": 'application/json'
	},
	body: JSON.stringify(body),
	credentials: "include",
    })

    fetch(r)
});
