import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import FindingLove from './FindingLove';
import ActivitySwitcher from './ActivitySwitcher';
import UserSettings from './UserSettings';

const Dashboard = ({ user, setUser }) => {
  // console.log(user)
  const [date, setDate] = useState(Math.floor(Date.now() / 1000))
  const [refresh, setRefresh] = useState(0)

  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload
  // console.log(tokenPayload)
  // console.log("token payload :", name, sub, iat, exp)

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setDate(Math.floor(Date.now() / 1000))
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
          <div id="display">
            <FindingLove user={user} setUser={setUser} FindingLove />
          </div>
          <ActivitySwitcher user={user} setUser={setUser} />
        </div>
      )
    } else if (user.activity === "user profile") {
      return (
        <div id="dashboard">
          <div id="display">
            <UserSettings user={user} setUser={setUser} UserSettings />
          </div>
          <ActivitySwitcher user={user} setUser={setUser} />
        </div>
      )
    } else {
      return (
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