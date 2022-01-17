import { useState, useEffect } from 'react';
import { envData } from './App';

const Matches = ({ user, setUser, userInfos, setUserInfos }) => {
  const [lovers, setLovers] = useState([])
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


  // TODO : pinned lover feature
  return (
    <div id="matches">
      my matches :
      {
        lovers.map(lover => (
          <div className="lover" key={lover.id}>
            <div > {lover.name} </div>
            <div > {lover.age} </div>
            <div > {lover.description} </div>
          </div>
        ))
      }
    </div>
  )
}

export default Matches;