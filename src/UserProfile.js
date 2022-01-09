import { useState, useEffect } from 'react';
import { envData } from './App';

const UserProfile = ({ user, setUser }) => {
	// console.log(user)
	const [userInfos, setUserInfos] = useState({
		id: null,
		age: null,
		password: null,
		pseudo: null,
	})

	const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { pseudo, sub, iat, exp } = tokenPayload

	console.log(userInfos)

	useEffect(() => {

		console.log("NEW PROFILE REQUEST")
		async function getUserInfos() {
			const result = await fetch(`${envData.apiURL}/users/${sub}`, { // todo : replace pseudo by ID = sub
				method: 'GET', // *GET, POST, PUT, DELETE, etc.
				headers: { 'Content-Type': 'application/json' }
			})
			const readableResult = await result.json()
			console.log(readableResult)
			setUserInfos(readableResult)

		}

		getUserInfos();
	}, []);


	// s'assurer qu'on ne peut que show son propre profile
	return (
		<div id="userProfile">
			user profile :
			<div>{userInfos.id} </div>
			<div>{userInfos.age} </div>
			<div>{userInfos.password} </div>
			<div>{userInfos.pseudo} </div>
		</div>
	)
}

export default UserProfile;