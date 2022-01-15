import { useState, useEffect } from 'react';
import { envData } from './App';

const UserSettings = ({ user, setUser, userInfos, setUserInfos }) => {
	console.log("hehe")
	console.log(userInfos)

	const tokenData64URL = user.token.split('.')[1]
	const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
	const tokenPayload = JSON.parse(atob(tokenB64))
	const { name, sub, iat, exp } = tokenPayload

	console.log(userInfos)

	useEffect(() => {
		async function getUserInfos() {
			const result = await fetch(`${envData.apiURL}/users/${sub}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${user.token}`,
					'Content-Type': 'application/json'
				}
			})
			const readableResult = await result.json()
			setUserInfos(readableResult)
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
					<input type="text" id="userName" value={userInfos.name} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							name: e.target.value
						}))} />
				</label>

				<label> Age:
					<input type="number" id="userAge" value={userInfos.age} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							age: Number(e.target.value)
						}))} />
				</label>

				<label> Gender:
					<input type="text" id="userGender" value={userInfos.gender} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							gender: e.target.value
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

				<label> Describe yourself:
					<input type="text" id="userDescription" value={userInfos.description} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							description: e.target.value
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
				<label> Looking for:
					<input type="text" id="userLookingFor" value={userInfos.looking_for} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							looking_for: e.target.value
						}))} />
				</label>

				<label> Search Radius, KM:
					<input type="number" id="userSearchRadius" value={userInfos.search_radius} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							search_radius: Number(e.target.value)
						}))} />
				</label>

				<label> Looking for age min:
					<input type="number" id="userLookingForMin" value={userInfos.looking_for_age_min} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							looking_for_age_min: Number(e.target.value)
						}))} />
				</label>

				<label> Looking for age max:
					<input type="number" id="userLookingForMax" value={userInfos.looking_for_age_max} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							looking_for_age_max: Number(e.target.value)
						}))} />
				</label>
			</div>
			user profile :
			<div>{userInfos.id} </div>
			<div>{userInfos.age} </div>
			<div>{userInfos.password} </div>
			<div>{userInfos.name} </div>
		</div>
	)
}

export default UserSettings;