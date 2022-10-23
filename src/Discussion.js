import { useState, useEffect, useCallback } from 'react';
import { get, post, put } from './utils/Requests';

const Discussion = ({ user, loveID, setLoveID, newChatMessage }) => {
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const getMessagesList = async () => {
      try {
        setMessages(await get(`/messages/${loveID}`, user.token))
        const messageDiv = document.getElementById("messagesList")
        const messagesDivViewHeight = messageDiv.clientHeight // The height that we can view 
        const messagesDivHeight = messageDiv.scrollHeight // The height if we could view the whole div with a big monitor
        messageDiv.scroll(0, messagesDivHeight - messagesDivViewHeight)
      } catch (error) {
        console.log('get discussion message list error : ' + error)
      }
    }

    getMessagesList()
  }, [newChatMessage])

  document.onclick = e => console.log(messages)

  const postMessage = async e => {
    e.preventDefault() //: TODO : see if useful ?
    try {
      await post(`/messages`, user.token, { message: newMessage, poster_id: sub, love_id: loveID }) // TODO add authorization.. : Dont post message to someone never matched
      setNewMessage("")
    } catch (error) {
      console.log('post message error : ' + error)
    }
  }

  useEffect(() => {
    const greenTickCurrentMessages = async () => {
      let messagesToTick = []
      for (let message of messages) {
        console.log(message)
        if (message.poster_id !== sub) { // Only green tick messages of the other person
          if (!message.seen) { // Only green tick messages that are not already ticked
            messagesToTick.push({"message_id": message.id, "love_id": message.love_id})
          }
        }
      }

      try {
        await put(`/messages/tick_messages`, user.token, { messages: messagesToTick })
      } catch (error) {
        console.log('green tick messages error : ' + error)
      }
    }

    greenTickCurrentMessages()
  }, [messages])

  const greenTickSeen = seen => {
    if (seen) {
      return (
        // <span className='tickUnseen'>  </span>
        <svg className='tickSeen'>
          <circle cx="0" cy="0" r="5" fill="green" />
        </svg>
      )
    } else {
      return (
        // <span className='tickUnseen'>  </span>
        <svg className='tickUnseen'>
          <circle cx="0" cy="0" r="5" fill="red" />
        </svg>
      )
    }

  }

  // Text tres long en train decrire: augmenter la taille de la box pour ecrire
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
                {greenTickSeen(message.seen)}
                <div className="message ownMessage">
                  <div> {message.message} </div>
                </div>
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