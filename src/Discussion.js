import { useState, useEffect, useCallback } from 'react';
import { envData } from './App';

const Discussion = ({ user, loveID }) => {
  // const [lovers, setLovers] = useState([])
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  // useEffect(() => {
  //   const getMatchesList = async () => {
  //     const result = await fetch(`${envData.apiURL}/lovers/${sub}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${user.token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //     console.log(result)
  //     const readableResult = await result.json()
  //     console.log(readableResult)
  //     setLovers(readableResult)
  //   }
  //   getMatchesList()
  // }, [])

  // const chatWith = e => {
  //   console.log(e.currentTarget.dataset.index);
  // }
  console.log(sub)
  console.log(loveID)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])

  const postMessage = async e => {
    // e.preventDefault() : TODO : see if useful ?

    const result = await fetch(`${envData.apiURL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage, poster_id: sub, love_id: loveID })
    })
    const readableResult = await result.json()
    console.log("result post message: ", readableResult)
  }

  useEffect(() => {
    const getMessagesList = async () => {
      const result = await fetch(`${envData.apiURL}/messages/${loveID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(result)
      const readableResult = await result.json()
      console.log(readableResult)
      setMessages(readableResult)
    }

    getMessagesList()
  }, [loveID])

  // TODO : pinned lover feature
  return (
    <div id="discussion">
      <div id="newMessage">
        <label> New message :	</label>
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
      </div>
      <button id="postMessage" onClick={postMessage}> post message </button>
      {
        messages.map(message => (
          <div className="message" key={message.id} >
            <div > {message.message} </div>
          </div>
        ))
      }
    </div>
  )
}

export default Discussion;