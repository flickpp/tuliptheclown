const API_URL = "https://api.jameswelchman.com"
// const API_URL = "http://localhost:8080"
const admin = document.getElementById('admin')

// Check if we are logged in
const sessionReq = fetch(new Request(API_URL + '/user/session', {
    credentials: "include"
}))

// Navbar
let navbar = document.createElement('nav');
navbar.className = "navbar"
let ul = document.createElement('ul')
let events = document.createElement('li')
events.innerHTML = 'Events'
let messages = document.createElement('li')
messages.innerHTML = 'Messages';
let reviews = document.createElement('li')
reviews.innerHTML = 'Reviews';
let logout = document.createElement('a')
logout.className = "logout"
logout.textContent = "Logout"

ul.appendChild(events)
ul.appendChild(messages)
ul.appendChild(reviews)
navbar.appendChild(ul)
navbar.appendChild(logout)



function urlBase() {
    let url = window.location.protocol + '//' + window.location.hostname;

    if (window.location.port) {
	url = url + ':' + window.location.port
    }

    return url
}


function eventUrl(event_id, user_tk) {
    return urlBase() + `/en/event.html?user_tk=${user_tk}&event_id=${event_id}`
}

function logoutUrl() {
    return urlBase() + '/logout'
}

function eventPage(event_id, user_tk) {
    return function(event) {
	window.location.href = eventUrl(event_id, user_tk)
    }
}

function newInput(type, placeholder) {
    let input = document.createElement('input')
    input.setAttribute('type', type)
    if (placeholder) {
	input.setAttribute('placeholder', placeholder)
    }
    return input
}

function newEvent(name, phoneOrEmail) {
    admin.textContent = ''
    let h3 = document.createElement('h3')
    h3.textContent = 'New Event'
    admin.appendChild(h3)

    let form = document.createElement('div')
    form.className = 'events__new-event'
    let formChildren = []

    let nameInput = newInput('text', 'name')
    if (name) {
	nameInput.setAttribute('value', name)
    }
    formChildren.push(nameInput)

    let phoneOrEmailInput = newInput('text', 'phone or email')
    if (phoneOrEmail) {
	phoneOrEmailInput.setAttribute('value', phoneOrEmail)
    }
    formChildren.push(phoneOrEmailInput)

    let dateInput = document.createElement('span')
    dateInput.className = 'events__labeled-input'
    let dateLabel = document.createElement('p')
    dateLabel.textContent = 'date:'

    let datePicker = newInput('date')

    dateInput.appendChild(dateLabel)
    dateInput.appendChild(datePicker)
    formChildren.push(dateInput)

    let timeInput = document.createElement('span')
    timeInput.className = 'events__labeled-input'

    let timeLabel = document.createElement('p')
    timeLabel.textContent = 'time:'

    let startTimeInput = newInput('time')

    let to = document.createElement('p')
    to.textContent = '-'

    let endTimeInput = newInput('time')

    timeInput.appendChild(timeLabel)
    timeInput.appendChild(startTimeInput)
    timeInput.appendChild(to)
    timeInput.appendChild(endTimeInput)
    formChildren.push(timeInput)

    let description = newInput('text', 'description')
    description.setAttribute('value', 'A party for children')
    formChildren.push(description)

    let price = document.createElement('span')
    price.className = 'events__labeled-input'
    let priceLabel = document.createElement('p')
    priceLabel.textContent = 'Price: '
    let priceInput = newInput('number')
    priceInput.setAttribute('min', '0')

    price.appendChild(priceLabel)
    price.appendChild(priceInput)
    formChildren.push(price)

    let deposit = document.createElement('span')
    deposit.className = 'events__labeled-input'
    let depositLabel = document.createElement('p')
    depositLabel.textContent = 'Deposit: '
    let depositInput = newInput('number')
    depositInput.setAttribute('min', '0')

    deposit.appendChild(depositLabel)
    deposit.appendChild(depositInput)
    formChildren.push(deposit)

    // Submit button
    let submit = document.createElement('button')
    submit.className = 'events__new-event-button-not-ready'
    submit.setAttribute('type', 'submit')
    submit.textContent = 'create'

    for (let i = 0; i < formChildren.length; i++) {
	form.appendChild(formChildren[i])
    }
    form.appendChild(submit)

    admin.appendChild(form)

    const checkSubmitReady = function() {
	const inputs = [
	    nameInput.value,
	    phoneOrEmailInput.value,
	    datePicker.value,
	    startTimeInput.value,
	    endTimeInput.value,
	    description.value,
	    priceInput.value,
	    depositInput.value
	]

	for (let i = 0; i < inputs.length; i++) {
	    if(!inputs[i]) {
		submit.className = 'events__new-event-button-not-ready'
		submit.onclick = null
		return;
	    }
	}
	
	submit.className = 'events__new-event-button-ready'
	submit.onclick = function() {
	    form.removeChild(submit)

	    let formPayload = {
		name: nameInput.value,
		phoneOrEmail: phoneOrEmailInput.value,
		date: datePicker.value,
		startTime: startTimeInput.value,
		endTime: endTimeInput.value,
		description:  description.value,
		totalPrice: parseFloat(priceInput.value),
		deposit: parseFloat(depositInput.value)
	    }

	    console.log(JSON.stringify(formPayload))

	    fetch(new Request(API_URL + '/tuliptheclown/event', {
		method: "POST",
		credentials: "include",
		headers: {
		    "Content-Type": "application/json"
		},
		body: JSON.stringify(formPayload)
	    }))
		.then(resp => {
		    if (resp.ok) {
			resp.json().then(body => {
			    const url = eventUrl(body['eventId'], body['userToken'])
			    navigator.clipboard.writeText(url)

			    let link = document.createElement('p')
			    link.textContent = url
			    link.onclick = function() { navigator.clipboard.writeText(url) }
			    form.appendChild(link)
			})
		    } else {
			let error = resp.headers.get('X-Error')
			console.log(error)
			let errorP = document.createElement('p')
			errorP.textContent = error
			form.appendChild(errorP)
		    }
		})
	}
    }

    for (let i = 0; i < formChildren.length; i++) {
	formChildren[i].onchange = checkSubmitReady
    }
}


function showMessage(msg) {
    let msgDiv = document.createElement('div')
    msgDiv.className = 'messages__message'

    // Title
    let title = document.createElement('div')
    title.className = 'messages__message-title'
    let h3 = document.createElement('h3')
    h3.textContent = 'Message'
    title.appendChild(h3)

    msgDiv.appendChild(title)

    title.addEventListener('click', messagesHandler)

    // Body
    let contact = document.createElement('h5')
    contact.textContent = `${msg['name']} - ${msg['phoneOrEmail']}`
    let datetime = document.createElement('h5')
    datetime.textContent = msg['creationTime']
    let message = document.createElement('p')
    message.textContent = msg['message']

    msgDiv.appendChild(contact)
    msgDiv.appendChild(datetime)
    msgDiv.appendChild(message)

    return function(event) {
	admin.textContent = '';
	admin.appendChild(msgDiv);
    }
}

logout.addEventListener('click', _ => {
    fetch(new Request(logoutUrl()))
	.then(resp => {
	    window.location.assign(urlBase())
	  })
})


function eventsHandler() {
    admin.textContent = '';
    let h3 = document.createElement('h3')
    h3.textContent = 'Events'
    admin.appendChild(h3)

    // Existing events request
    let eventsProm = fetch(new Request(API_URL + '/tuliptheclown/events', { credentials: "include" }))

    // New Event interface
    let eventButton = document.createElement('button')
    eventButton.textContent = 'New Event'
    eventButton.className = 'event__new-event-button'
    eventButton.onclick = function() {
	newEvent(null, null)
    }

    admin.appendChild(eventButton)

    // Existing events
    eventsProm
	.then(resp => resp.json())
	.then(body => {
	    let div = document.createElement('div')
	    div.setAttribute('id', 'events')

	    for (let i = 0; i < body['events'].length; i++) {
		const event = body['events'][i]
		let line = document.createElement('div')

		if (i % 2 == 0) {
		    line.className = 'events__line events__line-even'
		} else {
		    line.className = 'events__line events__line-odd'
		}

		let datetime = document.createElement('p')
		datetime.textContent = event['date'] + ' ' + event['startTime']
		let copy = document.createElement('p')
		copy.className = 'events__copylink'
		copy.textContent = 'copy'
		copy.addEventListener('click', _ => {
		    navigator.clipboard.writeText(eventUrl(event['eventId'], event['userToken']))
		})

		line.appendChild(datetime)
		line.appendChild(copy)

		div.appendChild(line)
	    }

	    admin.appendChild(div)
	})
}

events.onclick = eventsHandler

function messagesHandler() {
    const req = new Request(API_URL + "/tuliptheclown/messages", {
	credentials: "include"
    })

    admin.textContent = '';
    let h3 = document.createElement('h3')
    h3.textContent = 'Messages'
    admin.appendChild(h3)

    fetch(req)
	.then(resp => resp.json())
	.then(body => {
	    let div = document.createElement('div')
	    div.setAttribute('id', 'messages')

	    for (let i = 0; i < body['messages'].length; i++) {
		let msg = body['messages'][i]
		let line = document.createElement('div')

		if (i % 2 == 0) {
		    line.className = 'messages__line messages__line-even'
		} else {
		    line.className = 'messages__line messages__line-odd'
		}

		let contact = document.createElement('h5')
		if (msg['phoneOrEmail'].length > 12) {
		    contact.textContent = msg['phoneOrEmail'].slice(0, 10) + '..'
		} else {
		    contact.textContent = msg['phoneOrEmail']
		}

		let datetime = document.createElement('p')
		datetime.textContent = msg['creationTime'].slice(0, 10)

		line.appendChild(contact)
		line.appendChild(datetime)

		const contactDetails = `${msg['name']} - ${msg['phoneOrEmail']}`
		line.addEventListener('click', showMessage(msg))

		div.appendChild(line)
	    }

	    admin.appendChild(div);
	})
}

messages.onclick = messagesHandler


function reviewsHandler() {
    admin.textContent = '';
    let h3 = document.createElement('h3')
    h3.textContent = 'Reviews'
    admin.appendChild(h3)

    fetch(new Request(API_URL + '/tuliptheclown/review', { credentials: "include" }))
	.then(resp => resp.json())
	.then(body => {
	    let div = document.createElement('div')
	    div.setAttribute('id', 'reviews');
	    let line = document.createElement('div')
	    line.className = 'reviews__line reviews__line-odd'

	    let title = document.createElement('h5')
	    title.textContent = 'Review'
	    let weight = document.createElement('h5')
	    weight.textContent = 'Weight'
	    let evButton = document.createElement('h5')
	    evButton.textContent = 'Event'

	    line.appendChild(title)
	    line.appendChild(weight)
	    line.appendChild(evButton)

	    div.appendChild(line)

	    const reviews = body['reviews'].sort((a, b) => (b['weight'] - a['weight']))
	    for (let i = 0; i < reviews.length; i++) {
		let review = reviews[i]
		let line = document.createElement('div')
		if (i % 2 == 0) {
		    line.className = 'reviews__line reviews__line-even'
		} else {
		    line.className = 'reviews__line reviews__line-odd'
		}

		let reviewStart = document.createElement('p')
		if (review['review'].length > 20) {
		    reviewStart.textContent = review['review'].slice(0, 18) + '..'
		} else {
		    review['review'].textContent = review['review']
		}

		let weight = document.createElement('input')
		weight.setAttribute("type", "number")
		weight.setAttribute("value", review['weight'])
		weight.setAttribute('min', 0)
		weight.setAttribute('max', 255)

		weight.onchange = function() {
		    const payload = {
			weight: parseInt(weight.value),
			response: null,
			reviewId: review['reviewId']
		    }

		    fetch(new Request(API_URL + '/tuliptheclown/reviewResponse', {
			credentials: "include",
			method: "POST",
			headers: {
			    "Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		    }))
		}

		let eventLink = document.createElement('button')

		line.appendChild(reviewStart)
		line.appendChild(weight)
		line.appendChild(eventLink)

		div.appendChild(line)
	    }

	    admin.appendChild(div)

	})
}

reviews.onclick = reviewsHandler

sessionReq
    .then(resp => resp.json())
    .then(body => {
	if (body['loginId'] === null) {
	    // Begin OAuth flow
	    const oauthReq = new Request(API_URL + '/oauth/login', {
		method: "POST",
		credentials: "include",
		headers: {
		    "Content-Type": "application/json"
		},
		body: JSON.stringify({
		    currentUrl: window.location.href
		})
	    })

	    fetch(oauthReq)
		.then(body => {
		    if (body.ok) {
			// TODO: Redirect to Google OAUTH
			window.location.assign(API_URL + '/tuliptheclown/login')
		    }
		})
	} else {
	    // Display navbar
	    document.getElementById('admin-navbar').appendChild(navbar)

	    const defaultPage = "events"
	    
	    let url = new URL(window.location.href)
	    let page = url.searchParams.get('page')

	    if (!page) {
		page = defaultPage
	    }

	    if (page == "events") {
		eventsHandler()
	    } else if (page == "messages") {
		messagesHandler()
	    } else if (page == "reviews") {
		reviewsHandler()
	    } else if (page == "new-event") {
		newEvent(url.searchParams.get('name'), url.searchParams.get('phone-or-email'))
	    }
	}
    })

