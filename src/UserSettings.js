import { useState, useEffect } from 'react';
import { envData } from './App';

const UserSettings = ({ user, setUser, userInfos, setUserInfos }) => {
	console.log(userInfos)
	// TODO : watch out you should be modifying some user copy and only the real user info once the update is done,
	// here even if not clicking update button, if you do some change userInfos will be changed for the rest of the fronted..

	const tokenData64URL = user.token.split('.')[1]
	const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
	const tokenPayload = JSON.parse(atob(tokenB64))
	const { name, sub, iat, exp } = tokenPayload

	const [userModified, setUserModified] = useState(false)
	const [userInfosModel, setUserInfosModel] = useState({ // Note : also update the model in user settings
		id: -1,
		age: 0,
		password: "",
		name: "",
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
			const result = await fetch(`${envData.apiURL}/users/${sub}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${user.token}`,
					'Content-Type': 'application/json'
				}
			})
			const readableResult = await result.json()
			setUserInfos(readableResult)
			setUserInfosModel(readableResult)
			setUserModified(false)
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
		} else {
			setUserModified(userInfos)
			setUserModified(false)
		}
	}

	const deleteUser = async () => {
		const result = await fetch(`${envData.apiURL}/users/${sub}`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			}
		})
		if (result.status !== 200) {
			console.log("error deleting profile : ", await result.json()) // todo handle this
		} else {
			console.log(result.json())
		}
	}

	useEffect(() => {
		let modified = false
		for (const [key, val] of Object.entries(userInfos)) {
			if (val != userInfosModel[key]) {
				console.log(key, val, userInfosModel[key])
				console.log("heeeee")
				modified = true
				break
			}
		}
		setUserModified(modified)
	}, [userInfos])


	// TODO : bouton update change color when a change happened 
	// s'assurer qu'on ne peut que show son propre profile
	return (
		<div className="display" id="userProfile">
			<div id="privateInfos">
				<p className='updateCategories'>Private infos</p>
 
				<div className="inputsAlign" id="email">
					<label> Email: </label>
					<input type="text" id="userMail" value={userInfos.email} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							email: e.target.value
						}))} />
				</div>
			</div>

			<div id="publicInfos">
				<p className='updateCategories'>Public infos</p>

				<div className="inputsAlign" id="name">
					<label> Name:	</label>
					<input type="text" id="userName" value={userInfos.name} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							name: e.target.value
						}))} />
				</div>

				<div className="inputsAlign" id="age">
					<label> Age:	</label>
					<input type="number" id="userAge" value={userInfos.age} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							age: Number(e.target.value)
						}))} />
				</div>

				<div className="inputsAlign" id="gender">
					<label> Gender:	</label>
					<input type="text" id="userGender" value={userInfos.gender} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							gender: e.target.value
						}))} />
				</div>

				<div className="inputsAlign" id="latitude">
					<label> Position latitude:	</label>
					<input type="number" id="userLatitude" value={userInfos.latitude} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							latitude: Number(e.target.value)
						}))} />
				</div>

				<div className="inputsAlign" id="longitude">
					<label> Position longitude:	</label>
					<input type="number" id="userLongitude" value={userInfos.longitude} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							longitude: Number(e.target.value)
						}))} />
				</div>

				<div className="inputsAlign" id="description">
					<label> Describe yourself:	</label>
					<input type="text" id="userDescription" value={userInfos.description} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							description: e.target.value
						}))} />
				</div>
			</div>

			<div id="matchingSettings">
				<p className='updateCategories'>Matching settings</p>

				<div className="inputsAlign" id="lookingFor">
					<label> Looking for:	</label>
					<input type="text" id="userLookingFor" value={userInfos.looking_for} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							looking_for: e.target.value
						}))} />
				</div>

				<div className="inputsAlign" id="searchRadius">
					<label> Search Radius, KM:	</label>
					<input type="number" id="userSearchRadius" value={userInfos.search_radius} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							search_radius: Number(e.target.value)
						}))} />
				</div>

				<div className="inputsAlign" id="ageMin">
					<label> Looking for age min:	</label>
					<input type="number" id="userLookingForMin" value={userInfos.looking_for_age_min} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							looking_for_age_min: Number(e.target.value)
						}))} />
				</div>

				<div className="inputsAlign" id="ageMax">
					<label> Looking for age max:	</label>
					<input type="number" id="userLookingForMax" value={userInfos.looking_for_age_max} onChange={e =>
						setUserInfos(prev => ({
							...prev,
							looking_for_age_max: Number(e.target.value)
						}))} />
				</div>
			</div>

			{userModified ? <button className='btnUpdateUser' id="updatesUserToPerform" onClick={updateUser}> update user </button> : <button className='btnUpdateUser' onClick={updateUser}> update user </button>}
			<button className='btnUpdateUser' id="deleteUser" onClick={deleteUser}> delete account </button>
		</div>
	)
}

export default UserSettings;