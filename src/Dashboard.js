import { useState, useEffect, useRef } from 'react';
import ImageUploader from './ImageUploader';
import FindingLove from './FindingLove';
import ActivitySwitcher from './ActivitySwitcher';
import UserSettings from './UserSettings';
import Insights from './Insights';
import Matches from './Matches';
import EventsDisplay from './EventsDisplay';
import { get, post } from './utils/Requests';

const Dashboard = ({ user, setUser }) => {
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  const [notificationDisplay, setNotificationDisplay] = useState("")
  const [nbUnseenMatches, setNbUnseenMatches] = useState(0)
  const [tickUnseenMatch, setTickUnseenMatch] = useState(0)
  const [newChatMessage, _setNewChatMessage] = useState(0)
  const newChatMessageRef = useRef(newChatMessage)
  const [newMatch, setNewMatch] = useState(0)
  const [lovers, setLovers] = useState([])

  const setNewChatMessage = val => {
    newChatMessageRef.current = val
    _setNewChatMessage(val)
  }

  useEffect(() => {
    const getMatchesList = async () => {
      try {
        setLovers(await get(`/lovers/${sub}`, user.token))
      } catch (error) {
        console.log('get matches error : ' + error)
      }
    }
    getMatchesList()
  }, [newMatch, tickUnseenMatch])

  useEffect(() => {
    let nbUnseenMatches = 0
    for (const lover of lovers) {
      if (lover.lover1 === sub) {
        if (lover.seen_by_lover1 === 0) {
          nbUnseenMatches++
        }
      } else if (lover.lover2 === sub) {
        if (lover.seen_by_lover2 === 0) {
          nbUnseenMatches++
        }
      }
    }
    setNbUnseenMatches(nbUnseenMatches)
  }, [lovers])

  useEffect(() => {
    const s = new WebSocket('ws://localhost:8080/ws/')
    s.onopen = () => {
      s.send(`/authenticate ${user.token}`)
    }
    s.addEventListener('message', handleSocketMessage)
  }, [])

  const handleSocketMessage = event => {
    const socketMessage = JSON.parse(event.data)
    console.log("received a chat message ", socketMessage)
    if (socketMessage.message_type === "chat" && socketMessage.poster_id !== sub) {
      setNotificationDisplay(`New message : ${socketMessage.message}`)
      const displayer = document.getElementById("eventsDisplay")
      displayer.classList.add('displayer')
      setTimeout(() => {
        displayer.classList.add('removedDisplayer')
        setTimeout(() => { // reset classes to none after animation is over, TODO clean this 
          displayer.classList.remove('displayer')
          displayer.classList.remove('removedDisplayer')
        }, 1000);
      }, 3000);

      setNewChatMessage(newChatMessageRef.current + 1)
    }
    if (socketMessage.message_type === "green_tick") { // TODO : opti green tick, don't reload all the messages..
      setNewChatMessage(newChatMessageRef.current + 1)
    }
  }

  const [date, setDate] = useState(Math.floor(Date.now() / 1000))

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


  // TODO
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
          <EventsDisplay user={user} notificationDisplay={notificationDisplay} />
          <FindingLove user={user} userInfos={userInfos} setNotificationDisplay={setNotificationDisplay} newMatch={newMatch} setNewMatch={setNewMatch} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} nbUnseenMatches={nbUnseenMatches} />
        </div>
      )
    } else if (user.activity === "user profile") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay user={user} notificationDisplay={notificationDisplay} />
          <UserSettings user={user} setUser={setUser} userInfos={userInfos} setUserInfos={setUserInfos} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} nbUnseenMatches={nbUnseenMatches} />
        </div>
      )
    } else if (user.activity === "insights") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay user={user} notificationDisplay={notificationDisplay} />
          <Insights user={user} setUser={setUser} userInfos={userInfos} setUserInfos={setUserInfos} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} nbUnseenMatches={nbUnseenMatches} />
        </div>
      )

    } else if (user.activity === "matches") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay user={user} notificationDisplay={notificationDisplay} />
          <Matches user={user} lovers={lovers} newChatMessage={newChatMessage} tickUnseenMatch={tickUnseenMatch} setTickUnseenMatch={setTickUnseenMatch} />
          {/* </div> */}
          <ActivitySwitcher user={user} setUser={setUser} nbUnseenMatches={nbUnseenMatches} />
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