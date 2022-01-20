import { useState, useEffect } from 'react';

const ActivitySwitcher = ({ user, setUser }) => {
	const showProfile = () => {
		setUser(prev => ({ ...prev, activity: "user profile" }))
	}

	const showLoveFinder = () => {
		setUser(prev => ({ ...prev, activity: "finding love" }))
	}

	const showMatches = () => {
		setUser(prev => ({ ...prev, activity: "matches" }))
	}

	const showInsights = () => {
		setUser(prev => ({ ...prev, activity: "insights" }))
	}

	return (
		<div id="activitySwitcher">
			<div id="profile">
				<button onClick={showProfile}> profile </button>
			</div>
			<div id="matching">
				<button onClick={showLoveFinder}> find love </button>
			</div>
			<div id="matches">
				<button onClick={showMatches}> matches </button>
			</div>
			<div id="insights">
				<button onClick={showInsights}> insights </button>
			</div>
		</div>
	)
}

export default ActivitySwitcher;