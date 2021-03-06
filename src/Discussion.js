import { useState, useEffect, useCallback } from 'react';
import { envData } from './App';

const Discussion = ({ user, loveID, setLoveID, messages }) => {
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  console.log(sub)
  console.log(loveID)
  console.log(messages)
  const [newMessage, setNewMessage] = useState("")

  const postMessage = async e => {
    e.preventDefault() //: TODO : see if useful ?

    const result = await fetch(`${envData.apiURL}/messages`, { // TODO add authorization..
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessage, poster_id: sub, love_id: loveID })
    })
    const readableResult = await result.json()
    console.log("result post message: ", readableResult)
    setNewMessage("")
  }

  // TODO : empty chat when message posted
  // todo : Message seen feature
  // TODO : pinned/keep a lover at the top feature
  // TODO : Message DATE : Onky print if delta between previous message is bigger than some defined time
  return (
    <div id="discussion">
      {
        messages.map(message => {
          const date = new Date(message.creation_datetime)
          // todo : be careful get the right week
          const displayedDate = days[date.getDay()] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
          return (message.poster_id === sub ?
            <div key={message.id} className="ownMessagePosition">
              <div className="message ownMessage"> {message.message}</div>
              <div className="datetimeMessage"> {displayedDate} </div>
            </div>
            :
            <div key={message.id} className="otherMessagePosition">
              <div className="message otherMessage"> {message.message}</div>
              <div className="datetimeMessage"> {displayedDate} </div>
            </div>
          )
        })
      }
      <form id="formPostMessage">
        <input id="chatText" type="text" placeholder=" Send a message" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <button id="postMessageBtn" onClick={postMessage}> Go </button>
      </form>
    </div>
  )
}

const days = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6: "Sat",
}

export default Discussion;