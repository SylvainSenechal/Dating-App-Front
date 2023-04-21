import { useState, useEffect } from "react";
import { get, getQuery, post, put, deleteReq } from "./utils/Requests";

const UserSettings = ({ user, setUser, userInfos, setUserInfos }) => {
  console.log(userInfos);
  // TODO : watch out you should be modifying some user copy and only the real user info once the update is done,
  // here even if not clicking update button, if you do some change userInfos will be changed for the rest of the fronted..

  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid, exp } = tokenPayload;

  const [userModified, setUserModified] = useState(false);
  const [userInfosModel, setUserInfosModel] = useState({
    // Note : also update the model in user settings
    uuid: "",
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
    description: "",
  });
  const [nbPotentialMatched, setNbPotentialMatched] = useState(0);

  useEffect(() => {
    async function getUserInfos() {
      console.log("GETIING USER INFOS");
      try {
        const result = await get(`/users/${user_uuid}`, user.token);
        setUserInfos(result);
        setUserInfosModel(result);
        setUserModified(false);
      } catch (error) {
        console.log("get user infos error : " + error);
      }
    }

    getUserInfos();
  }, []);

	useEffect(() => {
    async function getMatchingPotential() {
			try {
				console.log("aaa ", userInfos)
				console.log("aaa ", userInfos.looking_for)
        setNbPotentialMatched(await getQuery(`/users/${user_uuid}/statistics/matching_potential`, user.token, {
					looking_for: userInfos.looking_for,
					search_radius: userInfos.search_radius,
					latitude: userInfos.latitude,
					longitude: userInfos.longitude,
					looking_for_age_min: userInfos.looking_for_age_min,
					looking_for_age_max: userInfos.looking_for_age_max,
				}));
      } catch (error) {
        console.log("get user potential matches error : " + error);
      }
    }

    getMatchingPotential();
  }, [userInfos]);

  const updateUser = async () => {
    try {
      const result = await put(`/users/${user_uuid}`, user.token, userInfos);
      setUserInfosModel(userInfos);
      setUserModified(false);
    } catch (error) {
      console.log("update user infos error : " + error);
    }
  };

  const deleteUser = async () => {
    try {
      await deleteReq(`/users/${user_uuid}`, user.token);
    } catch (error) {
      console.log("delete user infos error : " + error);
    }
  };

  useEffect(() => {
    let modified = false;
    for (const [key, val] of Object.entries(userInfos)) {
      if (val != userInfosModel[key]) {
        console.log(key, val, userInfosModel[key]);
        modified = true;
        break;
      }
    }
    setUserModified(modified);
  }, [userInfos]);

	const setLatitudeToCurrent = e => {
		const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      console.log(position);
      const { latitude, _ } = position.coords;
			setUserInfos((prev) => ({
				...prev,
				latitude: latitude,
			}))
    });
	}

	const setLongitudeToCurrent = e => {
		const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      console.log(position);
      const { _, longitude } = position.coords;
			setUserInfos((prev) => ({
				...prev,
				longitude: longitude,
			}))
    });
	}

  return (
    <div className="display" id="userProfile">
      <div id="privateInfos">
				<div> nbPotentialMatched: {nbPotentialMatched} </div>
        <p className="updateCategories">Private infos</p>

        <div className="inputsAlign" id="email">
          <label> Email: </label>
          <input
            type="text"
            id="userMail"
            value={userInfos.email}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div id="publicInfos">
        <p className="updateCategories">Public infos</p>

        <div className="inputsAlign" id="name">
          <label> Name: </label>
          <input
            type="text"
            id="userName"
            value={userInfos.name}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="age">
          <label> Age: </label>
          <input
            type="number"
            id="userAge"
            value={userInfos.age}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                age: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="gender">
          <label> Gender: </label>
          <input
            type="text"
            id="userGender"
            value={userInfos.gender}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                gender: e.target.value,
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="latitude">
          <label> Position latitude: </label>
					<button onClick={setLatitudeToCurrent}>
        		Get current
      		</button>
          <input
            type="number"
            id="userLatitude"
            value={userInfos.latitude}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                latitude: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="longitude">
          <label> Position longitude: </label>
					<button onClick={setLongitudeToCurrent}>
        		Get current
      		</button>
          <input
            type="number"
            id="userLongitude"
            value={userInfos.longitude}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                longitude: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="description">
          <label> Describe yourself: </label>
          <input
            type="text"
            id="userDescription"
            value={userInfos.description}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div id="matchingSettings">
        <p className="updateCategories">Matching settings</p>

        <div className="inputsAlign" id="lookingFor">
          <label> Looking for: </label>
          <input
            type="text"
            id="userLookingFor"
            value={userInfos.looking_for}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                looking_for: e.target.value,
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="searchRadius">
          <label> Search Radius, KM: </label>
          <input
            type="number"
            id="userSearchRadius"
            value={userInfos.search_radius}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                search_radius: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="ageMin">
          <label> Looking for age min: </label>
          <input
            type="number"
            id="userLookingForMin"
            value={userInfos.looking_for_age_min}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                looking_for_age_min: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="ageMax">
          <label> Looking for age max: </label>
          <input
            type="number"
            id="userLookingForMax"
            value={userInfos.looking_for_age_max}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                looking_for_age_max: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>

      {userModified ? (
        <button
          className="btnUpdateUser"
          id="updatesUserToPerform"
          onClick={updateUser}
        >
          {" "}
          update user{" "}
        </button>
      ) : (
        <button className="btnUpdateUser" onClick={updateUser}>
          {" "}
          update user{" "}
        </button>
      )}
      <button className="btnUpdateUser" id="deleteUser" onClick={deleteUser}>
        {" "}
        delete account{" "}
      </button>
    </div>
  );
};

export default UserSettings;
