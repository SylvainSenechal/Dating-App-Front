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
		description: "",
		last_seen: "",
	})
	const [ImageIdShown, setImageIdShown] = useState(0)
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

			if (result.status === 404) {
				console.log("No potential lover found")
				setLoveTarget({
					id: -1,
					name: "",
					age: 0,
					description: "",
					last_seen: ""
				})
			}
			if (result.status === 200) {
				console.log("Found a potential lover")
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
	}

	const clickImage = e => {
		const xPosition = e.clientX / e.target.clientWidth
		if (xPosition < 0.4) {
			setImageIdShown(prev => Math.max(prev - 1, 0))
		}
		if (xPosition > 0.6) {
			setImageIdShown(prev => Math.min(prev + 1, nbImages - 1))
		}
		console.log(ImageIdShown)
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

	// Thanks to : https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
	const distanceKilometers = (lat1, lon1, lat2, lon2) => {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1);  // deg2rad below
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2)
			;
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return d;
	}

	const deg2rad = deg => {
		return deg * (Math.PI / 180)
	}

	const distanceTarget = Math.ceil(distanceKilometers(loveTarget.latitude, loveTarget.longitude, userInfos.latitude, userInfos.longitude))
	const minuteLastSeen = Math.ceil((new Date() - new Date(loveTarget.last_seen)) / 1000 / 60)
	let displayLastSeen = ""
	if (minuteLastSeen < 60) {
		displayLastSeen = `${minuteLastSeen} minutes ago`
	} else if (minuteLastSeen < 1440) {
		// const minuteRemainder = minuteLastSeen % 60
		// displayLastSeen = `${Math.floor(minuteLastSeen / 60)}:${minuteRemainder} hours ago` // TODO : Do I wanna add this ?
		displayLastSeen = `${Math.floor(minuteLastSeen / 60)} hours ago`
	} else {
		displayLastSeen = `${Math.floor(minuteLastSeen / 1440)} days ago`
	}
	if (loveTarget.id === -1) {
		return (
			<div id="display">
				<div id='noLoveFound'> We could not find any profile fitting your matching settings 😔 </div>
			</div>
		)
	} else {
		return (
			<div className="display">
				<div id="dotImage">
					{imagesTarget.map((_, id) => (
						id === ImageIdShown ? <div id="currentImage" key={id}> o </div> : <div key={id}> o </div>
					))}
				</div>
				<div id="imageAndInfos">
					<img id="targetImage" onClick={clickImage} src={imagesTarget[ImageIdShown]} />
					<div id="targetOverview">
						<div className='targetInfos'> {loveTarget.name} : {loveTarget.age} </div>
						<div className='targetInfos'> Target Description: {loveTarget.description} </div> {/* TODO : truncate the string to 100 ~chars */}
						<div className='targetInfos'> {displayLastSeen} 👀 </div>
						<div className='targetInfos'> Distance : {distanceTarget} km </div>
						<div id="actionButtons">
							<button onClick={swipeLeft}> Hate </button>
							<button onClick={showTargetDetails}> Details </button>
							<button onClick={swipeRight}> Love </button>
						</div>
					</div>
				</div>

				{MatchedComponent()}

			</div>
		)
	}
}

export default FindingLove;