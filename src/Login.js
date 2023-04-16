import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
// import Footer from './Footer'
import { get, post } from "./utils/Requests";

const Login = ({ setUser }) => {
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [stepRegister, setStepRegister] = useState("email"); // 1. email 2. password 3. other infos (name, age)
  const [registerData, setRegisterData] = useState({
    email: "",
    name: "",
    password: "",
    age: "",
    latitude: 0,
    longitude: 0,
    gender: "",
    looking_for: "",
  });
  const [messageRegister, setMessageRegister] = useState("");
  const [keepConnected, setKeepConnected] = useState(false);

  console.log(registerData);

  useEffect(() => {
    const geo = navigator.geolocation;
    geo.getCurrentPosition((position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      setRegisterData((prev) => ({
        ...prev,
        latitude: latitude,
        longitude: longitude,
      }));
    });
  }, []);

  const handleSubmitRegistration = async (event) => {
    event.preventDefault();

    try {
      let result = await post(`/users`, undefined, registerData);
      setMessageRegister("User created successfully");
    } catch (error) {
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
      console.log("login error : " + error);
    }
  };

  const nextStep = () => {
    if (stepRegister === "email") {
      setStepRegister((prev) => "password");
    } else if (stepRegister === "password") {
      setStepRegister((prev) => "infos");
    }
  };

  const previousStep = () => {
    if (stepRegister === "infos") {
      setStepRegister((prev) => "password");
    } else if (stepRegister === "password") {
      setStepRegister((prev) => "email");
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
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  };

  const setGender = (e, genderData) => {
    e.preventDefault();
    setRegisterData((prev) => ({ ...prev, gender: genderData }));
  };
  const setLookingFor = (e, genderData) => {
    e.preventDefault();
    setRegisterData((prev) => ({ ...prev, looking_for: genderData }));
  };

  if (stepRegister === "email") {
    return (
      <div className="LoginPage">
        <div className="formsLoginRegister">
          <div className="logInfo" style={{ "--order": 0 }}>
            <p className="borderLine"> Register </p>
            <form onSubmit={handleSubmitRegistration}>
              <label htmlFor="email"> Enter your email: </label>
              <input
                type="text"
                name="email"
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
              <input type="submit" value="Register" />
            </form>
            <button onClick={nextStep}> nextStep </button>
            <button onClick={previousStep}> previousStep </button>
            <div> {messageRegister} </div>
          </div>

          {LoginComponent()}
        </div>
        {/* < Footer /> */}
      </div>
    );
  } else if (stepRegister === "password") {
    return (
      <div className="LoginPage">
        <div className="formsLoginRegister">
          <div className="logInfo" style={{ "--order": 0 }}>
            <p className="borderLine"> Register </p>
            <form onSubmit={handleSubmitRegistration}>
              <label htmlFor="password"> Enter your password: </label>
              <input
                type="password"
                name="password"
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
              <input type="submit" value="Register" />
            </form>
            <button onClick={nextStep}> nextStep </button>
            <button onClick={previousStep}> previousStep </button>
            <div> {messageRegister} </div>
          </div>

          {LoginComponent()}
        </div>
        {/* < Footer /> */}
      </div>
    );
  } else if (stepRegister === "infos") {
    return (
      <div className="LoginPage">
        <div className="formsLoginRegister">
          <div className="logInfo" style={{ "--order": 0 }}>
            <p className="borderLine"> Register </p>
            <form onSubmit={handleSubmitRegistration}>
              <label htmlFor="name"> Enter your name: </label>
              <input
                type="text"
                name="name"
                id="nameRegister"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <label htmlFor="age"> Enter your age: </label>
              <input
                type="number"
                name="age"
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
              <div id="gender pick">
                {/* <button onClick={() => setRegisterData(prev => ({ ...prev, gender: "male" }))}> male </button> */}
                <button onClick={(e) => setGender(e, "male")}> male </button>
                <button onClick={(e) => setGender(e, "female")}>
                  {" "}
                  female{" "}
                </button>
              </div>
              {/* <input type="text" name="gender" id="genderRegister" value={registerData.gender} onChange={e => setRegisterData(prev => ({ ...prev, gender: e.target.value }))} required /> */}
              <label htmlFor="lookingFor">
                {" "}
                Enter who you are looking for:{" "}
              </label>
              <div id="looking_for pick">
                <button onClick={(e) => setLookingFor(e, "male")}>
                  {" "}
                  male{" "}
                </button>
                <button onClick={(e) => setLookingFor(e, "female")}>
                  {" "}
                  female{" "}
                </button>
              </div>
              {/* <input type="text" name="lookingFor" id="lookingForRegister" value={registerData.lookingFor} onChange={e => setRegisterData(prev => ({ ...prev, looking_for: e.target.value }))} required /> */}
              <input type="submit" value="Register" />
            </form>
            <button onClick={nextStep}> nextStep </button>
            <button onClick={previousStep}> previousStep </button>
            <div> {messageRegister} </div>
          </div>

          {LoginComponent()}
        </div>
        {/* < Footer /> */}
      </div>
    );
  } else {
    return <div> unknown register step </div>;
  }
};

export default Login;
