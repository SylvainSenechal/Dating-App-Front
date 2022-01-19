import { useState, useEffect } from 'react';
import { envData } from './App';

// Faire un composant view profile, pour moi ou autre personne
const FindingLove = ({ user, userInfos }) => {
	// TODO : add last activity date (seen x min ago ?)

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
	const [ImageIdShawn, setImageIdShawn] = useState(0)
	const [imagesTarget, setImagesTarget] = useState([
		"https://picsum.photos/100/1200",
		"https://picsum.photos/200/1200",
		"https://picsum.photos/300/1200",
		"https://picsum.photos/400/1200",
		"https://picsum.photos/500/1200"
	])
	const [nbImages, setNbImages] = useState(imagesTarget.length)


	const [matched, setMatched] = useState(false)
	const [findNewLover, setFindNewLover] = useState(0)

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
				setLoveTarget({
					id: -1,
					name: "",
					age: 0,
					description: ""
				})
			}
			if (result.status === 200) {
				setLoveTarget(readableResult)
			}
		}

		getNewProfile()
	}, [findNewLover])

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

	const swipeRight = async () => {
		await swipe(1)
		setFindNewLover(value => value + 1)
	}
	// todo : add arrow keys
	const swipeLeft = async () => {
		await swipe(0)
		setFindNewLover(value => value + 1)
	}

	const showTargetDetails = async () => {
		// todo
		const im = document.getElementById("targetImage")
		console.log(im)

		im.src = "https://picsum.photos/100/1200"
	}
	
	const clickImage = e => {
		const xPosition = e.clientX / e.target.clientWidth
		if (xPosition < 0.4) {
			setImageIdShawn(prev => Math.max(prev - 1, 0))
		}
		if (xPosition > 0.6) {
			setImageIdShawn(prev => Math.min(prev + 1, nbImages - 1))
		}
		console.log(ImageIdShawn)
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
				<img id="targetImage" onClick={clickImage} src={imagesTarget[ImageIdShawn]} width="100" />
			<div id="targetOverview">
				<div> {loveTarget.name} : {loveTarget.age} </div>
				<div> Target Description: {loveTarget.description} </div> {/* TODO : truncate the string to 100 ~chars */}
				<div id="actionButtons">
					<button onClick={swipeLeft}> Hate </button>
					<button onClick={showTargetDetails}> Details </button>
					<button onClick={swipeRight}> Love </button>
				</div>
			</div>


			{MatchedComponent()}

		</div>
	)
}

export default FindingLove;