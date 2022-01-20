import { useState, useEffect } from 'react';
import { envData } from './App';
import Discussion from './Discussion';

const Matches = ({ user, setUser, userInfos, setUserInfos }) => {
  const [lovers, setLovers] = useState([])
  const [loveID, setLoveID] = useState(0)

  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload

  useEffect(() => {
    const getMatchesList = async () => {
      const result = await fetch(`${envData.apiURL}/lovers/${sub}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(result)
      const readableResult = await result.json()
      console.log(readableResult)
      setLovers(readableResult)
    }
    getMatchesList()
  }, [])

  const chatWith = e => {
    setLoveID(Number(e.currentTarget.dataset.index))
  }

  // TODO : pinned lover feature
  return (
    <div id="matches">
      You matched with these amazing people !
      <div id='matchesPreview'>
        {
          lovers.map(lover => (
            <div className="lover" data-index={lover.love_id} onClick={chatWith} key={lover.love_id} >
              <img id="previewImage" src="https://picsum.photos/50/100" />
              <div > {lover.name} </div>
            </div>
          ))
        }
      </div>

      <Discussion user={user} loveID={loveID} />
    </div>
  )
}

export default Matches;