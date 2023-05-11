import { useState, useEffect } from "react";
// import Footer from './Footer'
import { get, post } from "./utils/Requests";

const Login = ({ setUser }) => {
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [registerData, setRegisterData] = useState({
    email: "",
    name: "",
    password: "",
    age: 25,
    latitude: 0,
    longitude: 0,
    gender: Math.random() > 0.5 ? "female" : "male",
    looking_for: Math.random() > 0.5 ? "female" : "male",
  });
  const [messageRegister, setMessageRegister] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  const [keepConnected, setKeepConnected] = useState(false);
  const [canRegister, setCanRegister] = useState(false);
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setRegisterData((prev) => ({
        ...prev,
        latitude: latitude,
        longitude: longitude,
      }));
    });
  }, []);

  useEffect(() => {
    console.log(registerData);
    if (
      registerData.email !== "" &&
      registerData.name !== "" &&
      registerData.password !== "" &&
      registerData.age !== 0 &&
      registerData.gender !== "" &&
      registerData.looking_for !== ""
    ) {
      setCanRegister(true);
    } else {
      setCanRegister(false);
    }
  }, [registerData]);

  useEffect(() => {
    console.log(registerData);
    if (emailLogin !== "" && passwordLogin !== "") {
      setCanLogin(true);
    } else {
      setCanLogin(false);
    }
  }, [emailLogin, passwordLogin]);

  const handleSubmitRegistration = async (event) => {
    event.preventDefault();

    try {
      await post(`/users`, undefined, registerData);
      setMessageRegister("User created successfully");
    } catch (error) {
      setMessageRegister("registration failed");
      console.log("registering error : " + error);
    }
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      let result = await post(`/auth`, undefined, {
        email: emailLogin,
        password: passwordLogin,
      });
      setUser((prev) => ({
        ...prev,
        token: result.token,
        refreshToken: result.refresh_token,
        loggedIn: true,
        keepConnected: keepConnected,
      }));
      if (keepConnected) {
        window.localStorage.setItem("refreshToken", result.refresh_token);
      } else {
        window.sessionStorage.setItem("refreshToken", result.refresh_token);
      }
    } catch (error) {
      setMessageLogin("login failed");
      console.log("login error : " + error);
    }
  };

  const LoginComponent = () => {
    return (
      <div className="logInfo" style={{ "--order": 1 }}>
        <p className="borderLine"> Login </p>
        <form onSubmit={handleSubmitLogin}>
          <label htmlFor="email"> Enter your email: </label>
          <input
            type="text"
            name="email"
            id="emailLogin"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            required
          />
          <label htmlFor="password"> Enter your password: </label>
          <input
            type="password"
            name="password"
            id="passwordLogin"
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            required
          />
          <label htmlFor="keepConnected"> Keep me connected :</label>
          <input
            name="keepConnected"
            type="checkbox"
            checked={keepConnected}
            onChange={(e) => setKeepConnected(e.target.checked)}
          />
          {canLogin ? (
            <input
              className="buttonSubmitLogin"
              id="buttonSubmitAllowed"
              type="submit"
              value="Login"
            />
          ) : (
            <input className="buttonSubmitLogin" type="submit" value="Login" />
          )}
        </form>
        <div> {messageLogin} </div>
      </div>
    );
  };

  const setGender = (e) => {
    setRegisterData((prev) => ({ ...prev, gender: e.target.value }));
  };
  const setLookingFor = (e) => {
    setRegisterData((prev) => ({ ...prev, looking_for: e.target.value }));
  };

  document.onclick = (e) => {
    console.log(registerData);
  };

  return (
    <div className="LoginPage">
      <h1 className="appTitle">Lemgo</h1>
      <div className="appPresentation">
        <h3> One dating web-app, no shady algorithm : </h3>
        <div className="presentationPoint">
          We show you profiles sorted by connection date : you won't see users
          last connected 2 years ago !{" "}
        </div>
        <div className="presentationPoint">
          No hidden score, the users that you see are the user matching your
          filters
        </div>
        <div className="presentationPoint">
          Obtain live insights about the app : how many people saw your profile, swiped right or left on you, gender repartition, total users and more
        </div>
      </div>
      <div className="formsLoginRegister">
        <div className="logInfo" style={{ "--order": 0 }}>
          <p className="borderLine"> Register </p>
          <form onSubmit={handleSubmitRegistration}>
            <label htmlFor="emailRegister"> Enter your email: </label>
            <input
              type="text"
              id="emailRegister"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />
            <label htmlFor="passwordRegister"> Enter your password: </label>
            <input
              type="password"
              id="passwordRegister"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
            />
            <label htmlFor="nameRegister"> Enter your name: </label>
            <input
              type="text"
              id="nameRegister"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <label htmlFor="ageRegister"> Enter your age: </label>
            <input
              type="number"
              min="18"
              max="127"
              id="ageRegister"
              value={registerData.age}
              onChange={(e) =>
                setRegisterData((prev) => ({
                  ...prev,
                  age: Number(e.target.value),
                }))
              }
              required
            />

            <label htmlFor="gender"> Enter your gender: </label>
            <div className="genderPick">
              <label>
                male
                <input
                  className="genderPickRadio"
                  type="radio"
                  value="male"
                  checked={registerData.gender === "male"}
                  onChange={setGender}
                />
              </label>
              <label>
                female
                <input
                  className="genderPickRadio"
                  type="radio"
                  value="female"
                  checked={registerData.gender === "female"}
                  onChange={setGender}
                />
              </label>
            </div>

            <label htmlFor="lookingFor"> Enter who you are looking for: </label>
            <div className="genderPick">
              <label>
                male
                <input
                  className="genderPickRadio"
                  type="radio"
                  value="male"
                  checked={registerData.looking_for === "male"}
                  onChange={setLookingFor}
                />
              </label>
              <label>
                female
                <input
                  className="genderPickRadio"
                  type="radio"
                  value="female"
                  checked={registerData.looking_for === "female"}
                  onChange={setLookingFor}
                />
              </label>
            </div>
            {canRegister ? (
              <input
                className="buttonSubmitLogin"
                id="buttonSubmitAllowed"
                type="submit"
                value="Register"
              />
            ) : (
              <input
                className="buttonSubmitLogin"
                type="submit"
                value="Register"
              />
            )}
          </form>
          <div> {messageRegister} </div>
        </div>

        {LoginComponent()}
      </div>
      {/* < Footer /> */}
    </div>
  );
};

export default Login;
