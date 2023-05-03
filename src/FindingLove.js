import { useState, useEffect } from "react";
import { get, post } from "./utils/Requests";

// Faire un composant view profile, pour moi ou autre personne
const FindingLove = ({
  user,
  userInfos,
  setNotificationDisplay,
  newMatch,
  setNewMatch,
}) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid, exp } = tokenPayload;

  const [loveTarget, setLoveTarget] = useState({
    uuid: -1,
    name: "",
    age: 0,
    description: "",
    last_seen: "",
    gender: "",
    distance: 0
  });
  const [ImageIdShown, setImageIdShown] = useState(0);
  const [imagesTarget, setImagesTarget] = useState([]);
  const [findNewLover, setFindNewLover] = useState(0);

  useEffect(() => {
    async function getNewProfile() {
      try {
        const potentialLover = await get(`/users/findlover`, user.token)
        setLoveTarget(potentialLover)
        if (potentialLover.photo_urls !== null && potentialLover.photo_display_orders !== null) {
          let orderedPhotosUrls = []
          let photosUrls = potentialLover.photo_urls.split(',')
          for (let order of potentialLover.photo_display_orders.split(',')) {
            orderedPhotosUrls.push(photosUrls[order - 1])
          }
          setImagesTarget(orderedPhotosUrls)
        }
      } catch (error) {
        console.log("find lover error : " + error);
        setLoveTarget({
          uuid: -1,
          name: "",
          age: 0,
          description: "",
          last_seen: "",
          gender: "",
          distance: 0
        });
      }
    }
    getNewProfile();
  }, [findNewLover]);

  document.onclick = e => {
    console.log(loveTarget)
  }

  const swipe = async (love) => {
    try {
      const result = await post(`/users/swipe`, user.token, {
        swiped_uuid: loveTarget.uuid,
        love: love,
      });
      console.log("getting new imagee"); // todo
      if (result === "matched") {
        setNotificationDisplay("It's a Match !");
        setNewMatch(newMatch + 1);
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
    } catch (error) {
      console.log("no match error : " + error);
    }
  };

  const swipeRight = async () => {
    await swipe(true);
    setFindNewLover((value) => value + 1);
  };
  // todo : add arrow keys
  const swipeLeft = async () => {
    await swipe(false);
    setFindNewLover((value) => value + 1);
  };

  const showTargetDetails = async () => {
    // todo
    const im = document.getElementById("targetImage");
  };

  const clickImage = (e) => {
    const xPosition = e.clientX / e.target.clientWidth;
    if (xPosition < 0.4) {
      setImageIdShown((prev) => Math.max(prev - 1, 0));
    }
    if (xPosition > 0.6) {
      setImageIdShown((prev) => Math.min(prev + 1, imagesTarget.length - 1));
    }
    console.log(ImageIdShown);
  };

  // Thanks to : https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
  const distanceKilometers = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const distanceTarget = Math.ceil(
    distanceKilometers(
      loveTarget.latitude,
      loveTarget.longitude,
      userInfos.latitude,
      userInfos.longitude
    )
  );
  const minuteLastSeen = Math.ceil(
    (new Date() - new Date(loveTarget.last_seen)) / 1000 / 60
  );
  let displayLastSeen = "";
  if (minuteLastSeen < 60) {
    displayLastSeen = `${minuteLastSeen} minutes ago`;
  } else if (minuteLastSeen < 1440) {
    // const minuteRemainder = minuteLastSeen % 60
    // displayLastSeen = `${Math.floor(minuteLastSeen / 60)}:${minuteRemainder} hours ago` // TODO : Do I wanna add this ?
    displayLastSeen = `${Math.floor(minuteLastSeen / 60)} hours ago`;
  } else {
    displayLastSeen = `${Math.floor(minuteLastSeen / 1440)} days ago`;
  }
  if (loveTarget.uuid === -1) {
    return (
      <div id="display">
        <div id="noLoveFound">
          {" "}
          We could not find any profile fitting your matching settings 😔{" "}
        </div>
      </div>
    );
  } else {
    return (
      <div className="display">
        <div id="dotImage">
          {imagesTarget.map((_, id) =>
            id === ImageIdShown ? (
              <div id="currentImage" key={id}>
                {" "}
                o{" "}
              </div>
            ) : (
              <div key={id}> o </div>
            )
          )}
        </div>
        <div id="imageAndInfos">
          {
            imagesTarget.length === 0 ?
            <div> user has no photos </div> 
            :
            <img
              id="targetImage"
              onClick={clickImage}
              src={imagesTarget[ImageIdShown]}
            />
          }
        
          <div id="targetOverview">
            <div className="targetInfos">
              {" "}
              {loveTarget.name} : {loveTarget.age}{" "}
            </div>
            <div className="targetInfos">
              {" "}
              Target Description: {loveTarget.description}{" "}
            </div>{" "}
            {/* TODO : truncate the string to 100 ~chars */}
            <div className="targetInfos"> {displayLastSeen} 👀 </div>
            <div className="targetInfos"> Distance : {loveTarget.distance} km </div>
            <div id="actionButtons">
              <button onClick={swipeLeft}> Hate </button>
              <button onClick={showTargetDetails}> Details </button>
              <button onClick={swipeRight}> Love </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FindingLove;
