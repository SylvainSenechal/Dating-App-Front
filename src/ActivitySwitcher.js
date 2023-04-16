import { useState, useEffect } from "react";

const ActivitySwitcher = ({ user, setUser, nbUnseenMatches }) => {
  const showProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, activity: "user profile" }));
  };

  const showLoveFinder = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, activity: "finding love" }));
  };

  const showMatches = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, activity: "matches" }));
  };

  const showInsights = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, activity: "insights" }));
  };

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
        <div id="NbUnseenMatches"> {nbUnseenMatches} </div>
      </div>
      <div id="insights">
        <button onClick={showInsights}> insights </button>
      </div>
    </div>
  );
};

export default ActivitySwitcher;
