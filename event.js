// const API_URL = "http://localhost:8080"
const API_URL = "https://api.tuliptheclown.co.uk"

const event = document.getElementById('event')
const eventTime = document.getElementById('event-time')
const description = document.getElementById('event-description')
const deposit = document.getElementById('event-deposit')
const totalMoney = document.getElementById('event-total-price')
const review = document.getElementById('event-review')
const button = document.getElementById('event-review-button')

const eventId = new URL(window.location.href).searchParams.get('event_id')
if (eventId !== null) {

    fetch(new Request(API_URL + '/tuliptheclown/event?event_id=' + eventId, { credentials: "include" }))
    .then(resp => resp.json())
    .then(body => {
	eventTime.textContent = body['date'] + " " + body['startTime'] + ' - ' + body['endTime']
	description.textContent = body['description']
	deposit.textContent = '£' + body['deposit']
	totalMoney.textContent = '£' + body['totalPrice']
	if (body['review']) {
	    review.value = body['review']
	}
    })
}



review.onchange = function() {
    if (!review.value) {
	button.onclick = null
	return;
    }

    button.onclick = function() {
	const payload = {
	    review: review.value,
	    eventId: eventId
	}

	fetch(new Request(API_URL + '/tuliptheclown/review', {
	    method: "POST",
	    credentials: "include",
	    headers: {
		"Content-Type": "application/json"
	    },
	    body: JSON.stringify(payload)
	}))
	    .then(resp => {
		if (resp.ok) {
		    resp.json().then(body => {
			console.log("reviewId = " + body['reviewId'])
		    })
		} else {
		    let xError = resp.headers.get("X-Error")
		    if (xError) {
			console.log(xError)
		    }
		}
	    })
    }
}
