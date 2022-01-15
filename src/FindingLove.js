import { useState, useEffect } from 'react';

// Faire un composant view profile, pour moi ou autre personne
const FindingLove = ({ user, setUser }) => {
	// console.log(user)
	const [image, setImage] = useState("")
  // const [profiles, setProfiles] = useState({
	// 	seen: false,
		
  // })
	const [profiles, setProfiles] = useState([])

	useEffect(() => {
		console.log('getting new imagee')
		async function getNewProfiles() {
			const result = await fetch(`https://picsum.photos/200/300`, { // todo : replace pseudo by ID = sub
				method: 'GET', // *GET, POST, PUT, DELETE, etc.
				// headers: { 'Content-Type': 'application/json' }
			})
			console.log('getting new imagee')
			console.log(result)
			// const readableResult = await result.json()
			// console.log(readableResult)
			// setImage(readableResult)
		}

		getNewProfiles();
	}, []);



	return (
		<div id="loveFinder">
			{/* <div id="logout" className="dashboardElement">
				<button onClick={logout}> Logout </button>
			</div> */}
			<img src="https://picsum.photos/200/300" width="100"/>
			<div>I'm finding love</div>

		</div>
	)
}

export default FindingLove;