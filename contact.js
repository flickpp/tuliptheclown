const API_URL = "http://localhost:8080"
// const API_URL = "https://api.tuliptheclown.co.uk"

const contact = document.getElementById('contact')

let contactQueryProm = fetch(
    new Request(API_URL + '/tuliptheclown/contact', {credentials : "include"}))

let form = document.createElement('div')
form.setAttribute('id', 'contact__form')

// Name
let name = document.createElement('input')
name.setAttribute('type', 'text')
name.setAttribute('placeholder', 'name')
if (window.localStorage.getItem('contact.name')) {
  name.setAttribute('value', window.localStorage.getItem('contact.name'))
}

let phoneOrEmail = document.createElement('input')
phoneOrEmail.setAttribute('type', 'text')
phoneOrEmail.setAttribute('placeholder', 'phone or email')
if (window.localStorage.getItem('contact.phoneOrEmail')) {
  phoneOrEmail.setAttribute('value',
                            window.localStorage.getItem('contact.phoneOrEmail'))
}

let message = document.createElement('textarea')
message.setAttribute('placeholder', 'message')
if (window.localStorage.getItem('contact.message')) {
  message.value = window.localStorage.getItem('contact.message')
}

form.appendChild(name)
form.appendChild(phoneOrEmail)
form.appendChild(message)

let button = document.createElement('button')
button.className = 'contact__button'
button.textContent = 'Send'

let errorMsg = null;

function checkSendable(timeRemaining) {
  return function() {
    if (timeRemaining > 0) {
      button.className = 'contact__button contact__button-non-send'
      button.onclick = null;
      return;
    }

    if (!name.value || !phoneOrEmail.value || !message.value) {
      button.className = 'contact__button contact__button-non-send'
      button.onclick = null;
      return;
    }

    button.className = 'contact__button contact__button-send'
    button.onclick = function() {
      const payload = {
        name : name.value,
        phoneOrEmail : phoneOrEmail.value,
        message : message.value
      }

      let newMessageProm =
          fetch(new Request(API_URL + '/tuliptheclown/message', {
            method : "POST",
            credentials : "include",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(payload)
          }))

      window.localStorage.setItem('contact.name', name.value)
      window.localStorage.setItem('contact.phoneOrEmail', phoneOrEmail.value)
      window.localStorage.setItem('contact.message', message.value)

      newMessageProm.then(resp => {
        if (errorMsg) {
          contact.removeChild(errorMsg)
        }

        if (resp.ok) {
          contact.removeChild(button)
          let msg = document.createElement('p')
          msg.textContent = 'Message Sent'
          contact.appendChild(msg)

        } else {
          const xError = resp.headers.get("X-Error")
          let msg = "ERROR"
          if (xError) {
            console.log(xError)
            msg = "ERROR: " + xError
          }

          errorMsg = document.createElement('p')
          errorMsg.textContent = msg
          contact.appendChild(errorMsg)
        }
      })
    }
  }
}

function timeLeft(timeRemaining) {
  let hours = 0
  let minutes = 0

  while (timeRemaining >= 3600) {
    hours += 1
    timeRemaining -= 3600
  }

  while (timeRemaining >= 60) {
    minutes += 1
    timeRemaining -= 60
  }

  return `${hours} hour(s) ${minutes} minute(s)`
}

function timeRemainingMsg(timeRemaining) {
  let msg = document.createElement('p')
  msg.textContent = 'Message Sent - you may send another message in ' +
                    timeLeft(timeRemaining)

  return msg
}

contactQueryProm.then(resp => {
  if (resp.ok) {
    resp.json().then(body => {
      if (body['timeRemaining'] > 0) {
        contact.appendChild(timeRemainingMsg(body['timeRemaining']))
      }

      let check = checkSendable(body['timeRemaining'])
      name.onchange = check
      phoneOrEmail.onchange = check
      message.onchange = check

      contact.appendChild(form)

      if (body['timeRemaining'] == 0) {
        contact.appendChild(button)
      }
    })
  } else {
    const xError = resp.headers.get('X-Error')
    if (xError) {
      console.log(xError)
    }
  }
})
