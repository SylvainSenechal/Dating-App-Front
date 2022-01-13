import { useState, useEffect } from 'react';
import { envData } from './App';

const UserSettings = ({ user, setUser }) => {
	// TODO : decoupler donnnee a update de mes donnees ?
	const [userInfos, setUserInfos] = useState({
		id: -1,
		age: 0,
		password: "",
		pseudo: "",
		email: "",
		latitude: 0,
		longitude: 0
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
		console.log("use infos", userInfos)
		console.log(JSON.stringify(userInfos))
		const result = await fetch(`${envData.apiURL}/users/${sub}`, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userInfos)
		})
		if (result.status !== 200) {
			console.log("error updating profile : ", await result.json()) // todo handle this
		}
	}

	// s'assurer qu'on ne peut que show son propre profile
	return (
		<div id="userProfile">
			<button onClick={updateUser}> update user </button>

			<div id="privateInfos">
				Private infos
				<label> Email:
					<input type="text" id="userMail" value={userInfos.email} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							email: e.target.value
						}))} />
				</label>
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

				<label> Position latitude:
					<input type="number" id="userLatitude" value={userInfos.latitude} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							latitude: Number(e.target.value)
						}))} />
				</label>

				<label> Position longitude:
					<input type="number" id="userLongitude" value={userInfos.longitude} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							longitude: Number(e.target.value)
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