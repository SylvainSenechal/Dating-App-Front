import { useState, useEffect } from 'react';

const ActivitySwitcher = ({ user, setUser }) => {
	// console.log(user)

	const showProfile = () => {
		console.log("switch profiler")
		console.log(user)
		setUser(prev => ({ ...prev, activity: "user profile" }))
		console.log(user)
	}

	const showLoveFinder = () => {
		console.log("switch love finder")
		console.log(user)
		setUser(prev => ({ ...prev, activity: "finding love" }))
		console.log(user)

	}



	return (
		<div id="activitySwitcher">
			<div id="matching">
				<button onClick={showLoveFinder}> find love </button>
			</div>
			<div id="profile">
				<button onClick={showProfile}> profile </button>
			</div>
		</div>
	)
}

export default ActivitySwitcher;