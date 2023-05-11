import { useState, useEffect, useRef } from "react";
import ImageUploader from "./ImageUploader";
import FindingLove from "./FindingLove";
import ActivitySwitcher from "./ActivitySwitcher";
import UserSettings from "./UserSettings";
import Insights from "./Insights";
import Matches from "./Matches";
import EventsDisplay from "./EventsDisplay";
import { get } from "./utils/Requests";
import { envData } from "./App";

const Dashboard = ({ user, setUser }) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid } = tokenPayload;

  const [notificationDisplay, setNotificationDisplay] = useState("");
  const [nbUnseenMatches, setNbUnseenMatches] = useState(0);
  const [tickUnseenMatch, setTickUnseenMatch] = useState(0);
  const [newChatMessage, _setNewChatMessage] = useState(0);
  const newChatMessageRef = useRef(newChatMessage);
  const [newMatch, setNewMatch] = useState(0);
  const [lovers, setLovers] = useState([]);
  const [newGreenTickLoveUUID, setNewGreenTickLoveUUID] = useState(0);

  const [userInfos, setUserInfos] = useState({
    // Note : also update the model in user settings
    uuid: "",
    private_uuid: "",
    age: 0,
    name: "",
    email: "",
    gender: "",
    looking_for: "",
    latitude: 0,
    longitude: 0,
    search_radius: 0,
    looking_for_age_min: 0,
    looking_for_age_max: 0,
    description: "",
  });

  const setNewChatMessage = (val) => {
    newChatMessageRef.current = val;
    _setNewChatMessage(val);
  };
  useEffect(() => {
    const getMatchesList = async () => {
      try {
        setLovers(await get(`/lovers/${user_uuid}`, user.token));
      } catch (error) {
        console.log("get matches error : " + error);
      }
    };
    getMatchesList();
  }, [newMatch, tickUnseenMatch]);

  useEffect(() => {
    let nbUnseenMatches = 0;
    for (const lover of lovers) {
      if (lover.lover1 === user_uuid) {
        if (lover.seen_by_lover1 === 0) {
          nbUnseenMatches++;
        }
      } else if (lover.lover2 === user_uuid) {
        if (lover.seen_by_lover2 === 0) {
          nbUnseenMatches++;
        }
      }
    }
    setNbUnseenMatches(nbUnseenMatches);
  }, [lovers]);

  useEffect(() => {
    async function getUserInfos() {
      try {
        setUserInfos(await get(`/users/${user_uuid}`, user.token));
      } catch (error) {
        console.log("get user infos error : " + error);
      }
    }

    getUserInfos();
  }, []);

  useEffect(() => {
    var eventSource = new EventSource(
      `${envData.apiURL}/server_side_event/${userInfos.private_uuid}`
    );
    eventSource.addEventListener("update", (e) => {
      console.log("received sse update:", JSON.parse(e.data));
      const sse_message = JSON.parse(e.data);
      switch (sse_message.message_type) {
        case "ChatMessage":
          if (sse_message.data.ChatMessage.poster_uuid !== user_uuid) {
            setNotificationDisplay(
              `New message : ${sse_message.data.ChatMessage.message}`
            );
            const displayer = document.getElementById("eventsDisplay");
            displayer.classList.add("displayer");
            setTimeout(() => {
              displayer.classList.add("removedDisplayer");
              setTimeout(() => {
                // reset classes to none after animation is over, TODO clean this
                displayer.classList.remove("displayer");
                displayer.classList.remove("removedDisplayer");
              }, 1000);
            }, 3000);
          }

          setNewChatMessage(newChatMessageRef.current + 1);
          break;
        case "GreenTickMessage":
          console.log(sse_message.data);
          setNewGreenTickLoveUUID(
            sse_message.data.GreenTickMessage.uuid_love_room +
              "," +
              Math.random() * 100000
          );
          break;
      }
    });
  }, [userInfos]);

  // TODO
  const logout = () => {
    window.localStorage.setItem("refreshToken", "");
    window.sessionStorage.setItem("refreshToken", "");
    setUser((prev) => ({
      ...prev,
      loggedIn: false,
      keepConnected: false,
      token: "",
      refreshToken: "",
    }));
  };

  const render = () => {
    if (user.activity === "finding love") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay
            user={user}
            notificationDisplay={notificationDisplay}
          />
          <FindingLove
            user={user}
            userInfos={userInfos}
            setNotificationDisplay={setNotificationDisplay}
            newMatch={newMatch}
            setNewMatch={setNewMatch}
          />
          {/* </div> */}
          <ActivitySwitcher
            user={user}
            setUser={setUser}
            nbUnseenMatches={nbUnseenMatches}
          />
        </div>
      );
    } else if (user.activity === "user profile") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay
            user={user}
            notificationDisplay={notificationDisplay}
          />
          <UserSettings
            user={user}
            setUser={setUser}
            userInfos={userInfos}
            setUserInfos={setUserInfos}
          />
          {/* </div> */}
          <ActivitySwitcher
            user={user}
            setUser={setUser}
            nbUnseenMatches={nbUnseenMatches}
          />
        </div>
      );
    } else if (user.activity === "insights") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay
            user={user}
            notificationDisplay={notificationDisplay}
          />
          <Insights
            user={user}
            setUser={setUser}
            userInfos={userInfos}
            setUserInfos={setUserInfos}
          />
          {/* </div> */}
          <ActivitySwitcher
            user={user}
            setUser={setUser}
            nbUnseenMatches={nbUnseenMatches}
          />
        </div>
      );
    } else if (user.activity === "matches") {
      return (
        <div id="dashboard">
          {/* <div id="display"> */}
          <EventsDisplay
            user={user}
            notificationDisplay={notificationDisplay}
          />
          <Matches
            user={user}
            lovers={lovers}
            newChatMessage={newChatMessage}
            tickUnseenMatch={tickUnseenMatch}
            setTickUnseenMatch={setTickUnseenMatch}
            newGreenTickLoveUUID={newGreenTickLoveUUID}
          />
          {/* </div> */}
          <ActivitySwitcher
            user={user}
            setUser={setUser}
            nbUnseenMatches={nbUnseenMatches}
          />
        </div>
      );
    } else {
      return (
        // TODO : remove this part ?
        <div id="dashboardOut">
          <div id="dashboardIn">
            <div id="infos" className="dashboardElement"></div>
            <div id="logout" className="dashboardElement">
              <button onClick={logout}> Logout </button>
            </div>
            <ImageUploader token={user.token} />
          </div>
        </div>
      );
    }
  };

  return render();
};

export default Dashboard;
