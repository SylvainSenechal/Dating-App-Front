import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import FindingLove from './FindingLove';
import ActivitySwitcher from './ActivitySwitcher';
import UserSettings from './UserSettings';
import Insights from './Insights';
import Matches from './Matches';
import { get, post } from './utils/Requests';

const Dashboard = ({ user, setUser }) => {
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload
  const [loveID, setLoveID] = useState(-1)
  const [messages, setMessages] = useState(new Map())
  const [socket, setSocket] = useState()
  useEffect(() => {
    setSocket(new WebSocket('ws://localhost:8080/ws/'))
  }, [])

  useEffect(() => {
    if (socket !== undefined) {
      socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        try {
          console.log("RECEIVED WS MESSAGE")
          const message = JSON.parse(event.data)
          console.log("message received : ", message)
          console.log(message.love_id)
          console.log(message.message_type)
          console.log(typeof message.love_id)
          console.log(messages)
          console.log(messages.has(3))
          console.log(messages.has(2))
          console.log(messages.has(1))
          if (message.message_type === "chat") {
            console.log("CHAT TYPE MESSAGE")
            if (!messages.has(message.love_id)) {
              console.log("NON EXISTENT")
              // messages.set(message.love_id, [{ id: message.message_id, message: message.message, poster_id: message.poster_id, love_id: message.love_id }])
              setMessages(new Map(messages.set(message.love_id, [{ id: message.message_id, message: message.message, poster_id: message.poster_id, love_id: message.love_id }])))
              console.log(messages)


            } else {
              console.log("EXISTENT")

              const currentMessages = messages
              const messagesInLoveRoomID = currentMessages.get(message.love_id)
              messagesInLoveRoomID.push({ id: message.message_id, message: message.message, poster_id: message.poster_id, love_id: message.love_id, creation_datetime: message.creation_datetime })
              // currentMessages.set(message.love_id, messagesInLoveRoomID)
              console.log(messages)
              // setMessages(currentMessages)
              setMessages(new Map(messages.set(message.love_id, messagesInLoveRoomID)))
              console.log("GEEEEEEE")
              console.log(messages)
            }
          }
          // if (message.startsWith("/chat ")) {
          //   console.log("start with " + message)
          //   const chatMessage = message.slice(6) // removes "/chat "
          //   console.log(chatMessage)
          //   let [messageId, ...rest] = chatMessage.split(" ") // split on the first space, ie : the id_message and the rest of the message
          //   const messageContent = rest.join(" ") // rebuild message content
          //   console.log(messageId)
          //   console.log(messageContent)
          //   // if (messages.has())
          // }
        } catch (error) {
          console.log(error)
        }

      });
      socket.onopen = () => {
        socket.send(`/authenticate ${user.token}`)
      }
    }
  }, [socket])


  useEffect(() => {
    const getMessagesList = async () => {
      console.log(user.token)
      console.log(sub)
      try {
        const result = await get(`/messages/users/${sub}`, user.token)
        for (let message of result) {
          if (!messages.has(message.love_id)) {
            setMessages(new Map(messages.set(message.love_id, [message])))
          } else {
            const messagesInLoveRoomID = messages.get(message.love_id)
            messagesInLoveRoomID.push(message)
            setMessages(new Map(messages.set(message.love_id, messagesInLoveRoomID)))
          }
        }
      } catch (error) {
        console.log('get message list error : ' + error)
      }
    }

    getMessagesList()
  }, [])


  const [date, setDate] = useState(Math.floor(Date.now() / 1000))
  const [refresh, setRefresh] = useState(0)

  const [userInfos, setUserInfos] = useState({ // Note : also update the model in user settings
    id: -1,
    age: 0,
    password: "",
    name: "", // TODO : DO NOT SEND BACK THE PASSWORD
    email: "",
    gender: "",
    looking_for: "",
    latitude: 0,
    longitude: 0,
    search_radius: 0,
    looking_for_age_min: 0,
    looking_for_age_max: 0,
    description: ""
  })

  useEffect(() => {
    async function getUserInfos() {
      console.log("GETIING USER INFOS")
      try {
        setUserInfos(await get(`/users/${sub}`, user.token))
      } catch (error) {
        console.log('get user infos error : ' + error)
      }
    }

    getUserInfos();
  }, []);


  // console.log(tokenPayload)
  // console.log("token payload :", name, sub, iat, exp)

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     console.log("user token : ", user.token)
  //     // setDate(Math.floor(Date.now() / 1000))
  //   }, 3000)
  //   return () => clearTimeout(timer);
  // }, [])

  const logout = () => {
    window.localStorage.setItem('refreshToken', "")
    window.sessionStorage.setItem('refreshToken', "")
    setUser(prev => ({ ...prev, loggedIn: false, keepConnected: false, token: "", refreshToken: "" }))
  }

  const render = () => {
    if (user.activity === "finding love") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <FindingLove user={user} userInfos={userInfos} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} />
        </div>
      )
    } else if (user.activity === "user profile") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <UserSettings user={user} setUser={setUser} userInfos={userInfos} setUserInfos={setUserInfos} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} />
        </div>
      )
    } else if (user.activity === "insights") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <Insights user={user} setUser={setUser} userInfos={userInfos} setUserInfos={setUserInfos} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} />
        </div>
      )

    } else if (user.activity === "matches") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <Matches user={user} setUser={setUser} userInfos={userInfos} setUserInfos={setUserInfos} socket={socket} messages={messages} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} />
        </div>
      )
    } else {
      return ( // TODO : remove this part ?
        <div id="dashboardOut">
          <div id="dashboardIn">
            <div id="infos" className="dashboardElement">
              <div> Hello {name}, your id is {sub} </div>
              <div> Your token is valid for {exp - date} second{(exp - date) > 1 ? 's' : ''} </div>
            </div>
            <div id="logout" className="dashboardElement">
              <button onClick={logout}> Logout </button>
            </div>
            <ImageUploader token={user.token} />
          </div>
        </div>
      )
    }
  }

  return render()
}

export default Dashboard;