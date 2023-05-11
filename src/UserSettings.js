import { useState, useEffect } from "react";
import { get, getQuery, post, put, deleteReq } from "./utils/Requests";
import ImageUploader from "./ImageUploader";

const UserSettings = ({ user, setUser, userInfos, setUserInfos }) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid } = tokenPayload;

  const [userModified, setUserModified] = useState(false);
  const [userInfosUpdate, setUserInfosUpdate] = useState(userInfos);
  const [nbPotentialMatched, setNbPotentialMatched] = useState(0);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showWrongPassword, setShowWrongPassword] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [needReloadUser, setNeedReloadUser] = useState(false);

  useEffect(() => {
    async function getUserInfos() {
      try {
        setUserInfos(await get(`/users/${user_uuid}`, user.token));
        setNeedReloadUser(false);
      } catch (error) {
        console.log("get user infos error : " + error);
      }
    }

    if (needReloadUser) {
      getUserInfos();
    }
  }, [needReloadUser]);

  useEffect(() => {
    async function getMatchingPotential() {
      try {
        setNbPotentialMatched(
          await getQuery(
            `/users/${user_uuid}/statistics/matching_potential`,
            user.token,
            {
              looking_for: userInfosUpdate.looking_for,
              search_radius: userInfosUpdate.search_radius,
              latitude: userInfosUpdate.latitude,
              longitude: userInfosUpdate.longitude,
              looking_for_age_min: userInfosUpdate.looking_for_age_min,
              looking_for_age_max: userInfosUpdate.looking_for_age_max,
            }
          )
        );
      } catch (error) {
        console.log("get user potential matches error : " + error);
      }
    }

    getMatchingPotential();
  }, [userInfosUpdate]);

  useEffect(() => {
    document.getElementById("nbPotentialMatch").style.animation = "shake 1s";
    setTimeout(
      () => (document.getElementById("nbPotentialMatch").style.animation = ""),
      1000
    );
  }, [nbPotentialMatched]);

  const updateUser = async () => {
    try {
      const result = await put(
        `/users/${user_uuid}`,
        user.token,
        userInfosUpdate
      );
      // setUserInfos(userInfosUpdate);
      setNeedReloadUser(true);
      setUserModified(false);
    } catch (error) {
      console.log("update user infos error : " + error);
    }
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      const result = await deleteReq(`/users/${user_uuid}`, user.token, {
        password: deletePassword,
      });
      console.log(result);
      if (result.message === "user deleted successfully") {
        window.localStorage.setItem("refreshToken", "");
        window.sessionStorage.setItem("refreshToken", "");
        setUser((prev) => ({
          ...prev,
          loggedIn: false,
          keepConnected: false,
          token: "",
          refreshToken: "",
        }));
      } else if (result.message == "wrong password") {
        console.log("oui");
        setShowWrongPassword(true);
      }
    } catch (error) {
      console.log("delete user infos error : " + error);
    }
  };

  useEffect(() => {
    let modified = false;
    for (const [key, val] of Object.entries(userInfosUpdate)) {
      if (val != userInfos[key]) {
        modified = true;
        break;
      }
    }
    setUserModified(modified);
  }, [userInfosUpdate]);

  const setLatitudeToCurrent = (e) => {
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      const { latitude, _ } = position.coords;
      setUserInfosUpdate((prev) => ({
        ...prev,
        latitude: latitude,
      }));
    });
  };

  const setLongitudeToCurrent = (e) => {
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      const { _, longitude } = position.coords;
      setUserInfosUpdate((prev) => ({
        ...prev,
        longitude: longitude,
      }));
    });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    console.log("submit ", feedback);
    try {
      await post(`/feedbacks`, user.token, {
        feedback_message: feedback,
      });
      setFeedback("");
      setShowFeedback(false);
    } catch (error) {
      console.log("post message error : " + error);
    }
  };

  const setGenderUpdate = (e) => {
    setUserInfosUpdate((prev) => ({ ...prev, gender: e.target.value }));
  };
  const setLookingForUpdate = (e) => {
    setUserInfosUpdate((prev) => ({ ...prev, looking_for: e.target.value }));
  };
  document.onclick = (e) => {
    console.log(userInfosUpdate);
  };
  return (
    <div className="display" id="userProfile">
      <button
        id="feedbackButton"
        onClick={() => setShowFeedback(!showFeedback)}
      >
        feedback
      </button>
      {showFeedback && (
        <form id="feedback" onSubmit={submitFeedback}>
          <label> Enter your feedback: </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            cols={45}
            rows={8}
            required
          />
          <input type="submit" value="Send feedback" />
        </form>
      )}

      <div id="privateInfos">
        <p className="updateCategories">Private infos</p>

        <div className="inputsAlign" id="email">
          <label> Email: </label>
          <input
            type="text"
            id="userMail"
            value={userInfosUpdate.email}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div id="publicInfos">
        <p className="updateCategories">Public infos</p>

        <ImageUploader
          token={user.token}
          userInfos={userInfos}
          setNeedReloadUser={setNeedReloadUser}
        />

        <div className="inputsAlign" id="name">
          <label> Name: </label>
          <input
            type="text"
            id="userName"
            value={userInfosUpdate.name}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
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
            min="18"
            max="127"
            value={userInfosUpdate.age}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
                ...prev,
                age: Number(e.target.value),
              }))
            }
          />
        </div>

        <div className="inputsAlign" id="gender">
          <label> Gender: </label>
          <div className="genderPick">
            <label>
              male
              <input
                className="genderPickRadio"
                type="radio"
                value="male"
                checked={userInfosUpdate.gender === "male"}
                onChange={setGenderUpdate}
              />
            </label>
            <label>
              female
              <input
                className="genderPickRadio"
                type="radio"
                value="female"
                checked={userInfosUpdate.gender === "female"}
                onChange={setGenderUpdate}
              />
            </label>
          </div>
        </div>

        <div className="inputsAlign" id="latitude">
          <label> Position latitude: </label>
          <div>
            <button
              className="btnGetCurrentPosition"
              onClick={setLatitudeToCurrent}
            >
              Get current
            </button>
            <input
              type="number"
              id="userLatitude"
              value={userInfosUpdate.latitude}
              onChange={(e) =>
                setUserInfosUpdate((prev) => ({
                  ...prev,
                  latitude: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="inputsAlign" id="longitude">
          <label> Position longitude: </label>
          <div>
            <button
              className="btnGetCurrentPosition"
              onClick={setLongitudeToCurrent}
            >
              Get current
            </button>
            <input
              type="number"
              id="userLongitude"
              value={userInfosUpdate.longitude}
              onChange={(e) =>
                setUserInfosUpdate((prev) => ({
                  ...prev,
                  longitude: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="inputsAlign" id="description">
          <label> Describe yourself: </label>
          <input
            type="text"
            id="userDescription"
            value={userInfosUpdate.description}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div id="matchingSettings">
        <p className="updateCategories">Matching settings</p>
        <div>
          {" "}
          Users fitting your filters :{" "}
          <div id="nbPotentialMatch"> {nbPotentialMatched} </div>{" "}
        </div>

        <div className="inputsAlign" id="lookingFor">
          <label> Looking for: </label>
          <div className="genderPick">
            <label>
              male
              <input
                className="genderPickRadio"
                type="radio"
                value="male"
                checked={userInfosUpdate.looking_for === "male"}
                onChange={setLookingForUpdate}
              />
            </label>
            <label>
              female
              <input
                className="genderPickRadio"
                type="radio"
                value="female"
                checked={userInfosUpdate.looking_for === "female"}
                onChange={setLookingForUpdate}
              />
            </label>
          </div>
        </div>

        <div className="inputsAlign" id="searchRadius">
          <label> Search Radius, KM: </label>
          <input
            type="number"
            id="userSearchRadius"
            min="1"
            max="40000"
            value={userInfosUpdate.search_radius}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
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
            min="18"
            max="127"
            value={userInfosUpdate.looking_for_age_min}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
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
            min="18"
            max="127"
            value={userInfosUpdate.looking_for_age_max}
            onChange={(e) =>
              setUserInfosUpdate((prev) => ({
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
      <button
        className="btnUpdateUser"
        id="deleteUser"
        onClick={() => setDeleteWarning(true)}
      >
        {" "}
        delete account{" "}
      </button>
      {deleteWarning && (
        <>
          <div> Are you sure you want to delete your account ? </div>
          <div>
            <form onSubmit={deleteUser}>
              <label htmlFor="password"> Enter your password: </label>
              <input
                type="password"
                name="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />
              <input type="submit" value="Delete account" />
            </form>
            {showWrongPassword && <div> Wrong password </div>}
          </div>
        </>
      )}
    </div>
  );
};

export default UserSettings;
