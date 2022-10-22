import { useState, useEffect } from 'react';
import Discussion from './Discussion';
import UserSettings from './UserSettings';
import DiscussionsPreview from './DiscussionsPreview';
import { get, post } from './utils/Requests';

const Matches = ({ user, setUser, userInfos, setUserInfos, newChatMessage }) => {
  const [lovers, setLovers] = useState([])
  const [loveID, setLoveID] = useState(-1)
  const [messages, setMessages] = useState(new Map())

  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  useEffect(() => {
    const getMatchesList = async () => {
      try {
        setLovers(await get(`/lovers/${sub}`, user.token))
      } catch (error) {
        console.log('get matches error : ' + error)
      }
    }
    getMatchesList()
  }, [])

  useEffect(() => {
    const getMessagesList = async () => {
      try {
        const result = await get(`/messages/users/${sub}`, user.token)
        const newMessages = new Map()
        for (let newMessage of result) {
          if (!newMessages.has(newMessage.love_id)) {
            newMessages.set(newMessage.love_id, [newMessage])
          } else {
            const messagesInLoveRoomID = newMessages.get(newMessage.love_id)
            messagesInLoveRoomID.push(newMessage)
            newMessages.set(newMessage.love_id, messagesInLoveRoomID)
          }
        }
        setMessages(newMessages)
      } catch (error) {
        console.log('get message list error : ' + error)
      }
    }
    
    getMessagesList()
  }, [newChatMessage])

  const chatWith = e => {
    const loveID = Number(e.currentTarget.dataset.index)
    setLoveID(loveID)
  }


  document.onclick = e => console.log(messages)

  // TODO : pinned lover feature
  return (
    <div className="display" id="matches">
      {loveID === -1 ?
        <>
          <div id="matchesWelcome"> You matched with these amazing people !</div>
          <div id='matchesPreview'>
            {
              lovers.map(lover => (
                <div className="lover" data-index={lover.love_id} onClick={chatWith} key={lover.love_id} >
                  <img id="previewImage" src="https://picsum.photos/50/100" />
                  <div > {lover.name} </div>
                </div>
              ))
            }
          </div></> :
        <div id="generalInfosTargetDiscussion">
          <button onClick={() => setLoveID(-1)}> go back </button>
          <img id="previewImage" src="https://picsum.photos/50/100" />
          <div > {lovers.find(elem => elem.love_id == loveID).name} </div>

        </div>
      }

      {loveID === -1 ?
        <DiscussionsPreview user={user} messages={messages} setLoveID={setLoveID} /> :
        <Discussion user={user} loveID={loveID} setLoveID={setLoveID} newChatMessage={newChatMessage}/>
      }

    </div>
  )
}

export default Matches;