import { useState, useEffect } from 'react';
import { envData } from './App';

const UserSettings = ({ user, setUser }) => {
	// TODO : decoupler donnnee a update de mes donnees ?
	const [userInfos, setUserInfos] = useState({
		id: -1,
		age: 0,
		password: "",
		pseudo: "",
	})

	const tokenData64URL = user.token.split('.')[1]
	const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
	const tokenPayload = JSON.parse(atob(tokenB64))
	const { pseudo, sub, iat, exp } = tokenPayload
	
	console.log(userInfos)

	useEffect(() => {
		async function getUserInfos() {
			const result = await fetch(`${envData.apiURL}/users/${sub}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})
			const readableResult = await result.json()
			console.log(readableResult)
			setUserInfos(readableResult)
			console.log("user infos : ", userInfos)
		}

		getUserInfos();
	}, []);

	const updateUser = async () => {
		const result = await fetch(`${envData.apiURL}/users/${sub}`, {
			method: 'PUT',
			headers: { 
				'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			},
      body: JSON.stringify( userInfos )
		})
		if (result.status !== 200) {
			console.log("error updating profile") // todo handle this
		}
	}

	// s'assurer qu'on ne peut que show son propre profile
	return (
		<div id="userProfile">
			<button onClick={updateUser}> update user </button>

			<div id="privateInfos">
				Private infos
				{/* <label> Enter your id:
					<input type="number" name="id" id="userID" value={userInfos.id} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							id: e.target.value
						}))} />
				</label> */}
			</div>

			<div id="publicInfos">
				Public infos

				<label> Name:
					<input type="text" id="userName" value={userInfos.pseudo} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							pseudo: e.target.value
						}))} />
				</label>

				<label> Age:
					<input type="number" id="userAge" value={userInfos.age} onChange={e =>
						setUserInfos(prev => ({
							...prev,
						age: Number(e.target.value)
						}))} />
				</label>

				{/* <label> Enter your genra:
					<select type="genra" id="userGenra" value={userInfos.genra} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							genra: e.target.value
						}))}>
						<option value="male"> male </option>
						<option value="female"> female </option>
						<option value="other"> other </option>
					</select>
				</label> */}
			</div>

			<div id="matchingSettings">
				Matching settings
			</div>
			user profile :
			<div>{userInfos.id} </div>
			<div>{userInfos.age} </div>
			<div>{userInfos.password} </div>
			<div>{userInfos.pseudo} </div>
		</div>
	)
}

export default UserSettings;