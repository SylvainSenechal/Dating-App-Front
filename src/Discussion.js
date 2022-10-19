import { useState, useEffect, useCallback } from 'react';
import { get, post } from './utils/Requests';

const Discussion = ({ user, loveID, setLoveID, newChatMessage }) => {
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  // console.log(sub)
  // console.log(loveID)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const getMessagesList = async () => {
      try {
        setMessages(await get(`/messages/${loveID}`, user.token))
      } catch (error) {
        console.log('get discussion message list error : ' + error)
      }
    }

    getMessagesList()
  }, [newChatMessage])
  
  const postMessage = async e => {
    e.preventDefault() //: TODO : see if useful ?
    try {
      await post(`/messages`, user.token, { message: newMessage, poster_id: sub, love_id: loveID }) // TODO add authorization.. : Dont post message to someone never matched
      setNewMessage("")
    } catch (error) {
      console.log('post message error : ' + error)
    }
  }

  // TODO : empty chat when message posted
  // todo : Message seen feature
  // TODO : pinned/keep a lover at the top feature
  // TODO : Message DATE : Onky print if delta between previous message is bigger than some defined time
  return (
    <div id="discussion">
      <div id="messagesList">
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
      </div>
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