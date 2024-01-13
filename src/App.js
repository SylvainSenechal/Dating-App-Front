import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { post } from "./utils/Requests";

const envData = {
  apiURL:
    process.env.NODE_ENV === "production" ? "https://api.captain.lemgo.io" : "http://localhost:8080",
};
export { envData };

const App = (props) => {
  const [user, setUser] = useState({
    loggedIn: false,
    keepConnected: false,
    token: "",
    refreshToken: "",
    activity: "finding love",
  });

  useEffect(() => {
    // This is only to restore the "keep me connected" session
    const restoreSession = async () => {
      const refreshToken = window.localStorage.getItem("refreshToken");
      console.log(refreshToken);
      if (refreshToken !== "" && refreshToken !== null) {
        const tokenData64URL = refreshToken.split(".")[1];
        const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
        const tokenPayload = JSON.parse(atob(tokenB64));
        const { exp } = tokenPayload;
        console.log(exp);
        console.log(Date.now() / 1000 + 5);
        if (Date.now() / 1000 + 5 < exp) {
          // 5 secs of margin
          console.log("relogging");
          try {
            const result = await post(`/auth/refresh`, undefined, {
              refresh_token: refreshToken,
            });
            setUser((prev) => ({
              ...prev,
              loggedIn: true,
              keepConnected: true, // attention à ce keepconnected
              token: result.token,
              refreshToken: refreshToken,
            }));
          } catch (error) {
            console.log("refresh token error : " + error);
          }
        } else {
          console.log("refreshToken found but expired");
        }
      } else {
        console.log("empty local storage for token");
      }
    };
    restoreSession();
  }, []);

  //todo : refresh le refresh token ?

  useEffect(() => {
    // This will check for refreshing the current token if outdated,
    const fetchData = async () => {
      try {
        const result = await post(`/auth/refresh`, undefined, {
          refresh_token: user.refreshToken,
        });
        setUser((prev) => ({
          ...prev,
          loggedIn: true,
          keepConnected: true, // attention à ce keepconnected
          token: result.token,
          refreshToken: user.refreshToken,
        }));
      } catch (error) {
        console.log("refresh token error : " + error);
      }
    };

    const timer = setInterval(() => {
      if (user.token !== "") {
        // If not logged in, we got nothing to refresh
        // console.log(user.token)
        const tokenData64URL = user.token.split(".")[1];
        const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
        const tokenPayload = JSON.parse(atob(tokenB64));
        const { exp } = tokenPayload;
        const margin = 5; // We refresh the token x seconds before it actually expires
        // console.log(Date.now() / 1000 + margin - exp)
        if (Date.now() / 1000 + margin - exp > 0) {
          // If token is soon to be expired; we ask a new one
          fetchData();
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  return user.loggedIn ? (
    <Dashboard user={user} setUser={setUser} />
  ) : (
    <Login setUser={setUser} />
  );
};

export default App;
