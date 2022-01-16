import { useState, useEffect } from 'react';
import { envData } from './App';

// Faire un composant view profile, pour moi ou autre personne
const FindingLove = ({ user, userInfos }) => {
	const tokenData64URL = user.token.split('.')[1]
	const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
	const tokenPayload = JSON.parse(atob(tokenB64))
	const { name, sub, iat, exp } = tokenPayload

	// const [profiles, setProfiles] = useState([])
	console.log(userInfos)
	// useEffect(() => {
	// 	console.log('getting new imagee')
	// 	async function getNewProfiles() {
	// 		const result = await fetch(`https://picsum.photos/200/300`, { // todo : replace pseudo by ID = sub
	// 			method: 'GET', // *GET, POST, PUT, DELETE, etc.
	// 			// headers: { 'Content-Type': 'application/json' }
	// 		})
	// 		console.log('getting new imagee')
	// 		console.log(result)
	// 		// const readableResult = await result.json()
	// 		// console.log(readableResult)
	// 		// setImage(readableResult)
	// 	}

	// 	getNewProfiles();
	// }, []);

	const [loveTarget, setLoveTarget] = useState({
		id: -1,
		name: "",
		age: 0,
		description: ""
	})

	const [matched, setMatched] = useState(false)

	useEffect(() => {
		async function getNewProfile() {
			console.log("user token", user.token)
			const result = await fetch(`${envData.apiURL}/users/${sub}/findlover`, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${user.token}` },
			})
			console.log('getting new imagee')
			console.log(result)
			const readableResult = await result.json()
			console.log(readableResult)

			if (readableResult.detailed_error === "SqliteError(NotFound)") {
				console.log("No potential lover found") // TODO : handle this better ?
			}
			if (result.status === 200) {
				setLoveTarget(readableResult)
			}
		}

		getNewProfile()
	}, [])

	const swipe = async love => {
		const result = await fetch(`${envData.apiURL}/users/${sub}/loves/${loveTarget.id}`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${user.token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ swiper: sub, swiped: loveTarget.id, love: love })
		})
		console.log(result)
		const readableResult = await result.json()
		console.log(readableResult)
		if (readableResult.message === "You matched !") {
			console.log("You both matched !")
			setMatched(true)
		}
	}

	const swipeRight = () => {
		swipe(1)
	}

	const swipeLeft = () => {
		swipe(0)
	}

	const MatchedComponent = () => {
		if (matched) {
			return (
				<div >
					Congralutation, you just matched somebody, click here(TODO) to see your matches
				</div>
			)
		}
	}

	return (
		<div id="loveFinder">
			{/* <img src="https://picsum.photos/200/300" width="100"/> */}
			<div>I'm finding love</div>

			<div> Target Name: {loveTarget.name} </div>
			<div> Target Age: {loveTarget.age} </div>
			<div> Target Description: {loveTarget.description} </div>

			<div id="swipeRight">
				<button onClick={swipeRight}> Love </button>
			</div>
			<div id="swipeLeft">
				<button onClick={swipeLeft}> Hate </button>
			</div>

			{MatchedComponent()}

		</div>
	)
}

export default FindingLove;