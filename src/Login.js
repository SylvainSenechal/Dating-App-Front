import { useState } from 'react';
// import Footer from './Footer'
import { envData } from './App';

const Login = ({ setUser }) => {
  const [stepRegister, setStepRegister] = useState("email") // 1. email 2. password 3. other infos (name, age)
  const [registerData, setRegisterData] = useState({
    email: "",
    name: "",
    password: "",
    age: "",
    latitude: 0,
    longitude: 0,
    gender: "",
    looking_for: ""
  })

  const [emailLogin, setEmailLogin] = useState("")
  const [passwordLogin, setPasswordLogin] = useState("")

  const [messageRegister, setMessageRegister] = useState("")
  const [keepConnected, setKeepConnected] = useState(false)
  console.log(envData)
  console.log(registerData)

  navigator.geolocation.getCurrentPosition(position => {
    setRegisterData(prev => ({ ...prev, latitude: position.coords.latitude, longitude: position.coords.longitude }))
  })

  const handleSubmitRegistration = async event => {
    event.preventDefault()

    const result = await fetch(`${envData.apiURL}/users`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    })
    const readableResult = await result.json()
    setMessageRegister(readableResult.message)
  }

  const handleSubmitLogin = async event => {
    event.preventDefault()

    const result = await fetch(`${envData.apiURL}/auth`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLogin, password: passwordLogin })
    })
    const readableResult = await result.json()

    if (result.status === 200) { // login successfull
      setUser(prev => ({ ...prev, token: readableResult.token, refreshToken: readableResult.refresh_token, loggedIn: true, keepConnected: keepConnected }))
      if (keepConnected) {
        window.localStorage.setItem('refreshToken', readableResult.refresh_token)
      } else {
        window.sessionStorage.setItem('refreshToken', readableResult.refresh_token)
      }
    }
  }

  const nextStep = () => {
    if (stepRegister === "email") {
      setStepRegister(prev => ("password"))
    } else if (stepRegister === "password") {
      setStepRegister(prev => ("infos"))
    }
  }

  const previousStep = () => {
    if (stepRegister === "infos") {
      setStepRegister(prev => ("password"))
    } else if (stepRegister === "password") {
      setStepRegister(prev => ("email"))
    }
  }

  const LoginComponent = () => {
    return (
      <div className="logInfo" style={{ "--order": 1 }}>
        <p className="borderLine"> Login </p>
        <form onSubmit={handleSubmitLogin}>
          <label htmlFor="email"> Enter your email: </label>
          <input type="text" name="email" id="emailLogin" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} required />
          <label htmlFor="password"> Enter your password: </label>
          <input type="password" name="password" id="passwordLogin" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} required />
          <label htmlFor="keepConnectede"> Keep me connected :</label>
          <input
            name="keepConnected"
            type="checkbox"
            checked={keepConnected}
            onChange={e => setKeepConnected(e.target.checked)}
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    )
  }

  if (stepRegister === "email") {
    return (
      <div className="LoginPage">
        <div className="formsLoginRegister" >
          <div className="logInfo" style={{ "--order": 0 }}>
            <p className="borderLine"> Register </p>
            <form onSubmit={handleSubmitRegistration}>
              <label htmlFor="email"> Enter your email: </label>
              <input type="text" name="email" id="emailRegister" value={registerData.email} onChange={e => setRegisterData(prev => ({ ...prev, email: e.target.value }))} required />
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
    )
  } else if (stepRegister === "password") {
    return (
      <div className="LoginPage">
        <div className="formsLoginRegister" >
          <div className="logInfo" style={{ "--order": 0 }}>
            <p className="borderLine"> Register </p>
            <form onSubmit={handleSubmitRegistration}>
              <label htmlFor="password"> Enter your password: </label>
              <input type="password" name="password" id="passwordRegister" value={registerData.password} onChange={e => setRegisterData(prev => ({ ...prev, password: e.target.value }))} required />
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
    )
  } else if (stepRegister === "infos") {
    return (
      <div className="LoginPage">
        <div className="formsLoginRegister" >
          <div className="logInfo" style={{ "--order": 0 }}>
            <p className="borderLine"> Register </p>
            <form onSubmit={handleSubmitRegistration}>
              <label htmlFor="name"> Enter your name: </label>
              <input type="text" name="name" id="nameRegister" value={registerData.name} onChange={e => setRegisterData(prev => ({ ...prev, name: e.target.value }))} required />
              <label htmlFor="age"> Enter your age: </label>
              <input type="number" name="age" id="ageRegister" value={registerData.age} onChange={e => setRegisterData(prev => ({ ...prev, age: Number(e.target.value) }))} required />
              <label htmlFor="gender"> Enter your gender: </label>
              <input type="text" name="gender" id="genderRegister" value={registerData.gender} onChange={e => setRegisterData(prev => ({ ...prev, gender: e.target.value }))} required />
              <label htmlFor="lookingFor"> Enter who you are looking for: </label>
              {/* TODO constraint to male / female  */}
              <input type="text" name="lookingFor" id="lookingForRegister" value={registerData.lookingFor} onChange={e => setRegisterData(prev => ({ ...prev, looking_for: e.target.value }))} required />
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
    )
  } else {
    return (
      <div> unknown register step </div>
    )
  }
}

export default Login;





// return (
//   <div className="LoginPage">
//     <div className="formsLoginRegister" >
//       <div className="logInfo" style={{ "--order": 0 }}>
//         <p className="borderLine"> Register </p>
//         <form onSubmit={handleSubmitRegistration}>
//           <label htmlFor="pseudo"> Enter your name: </label>
//           <input type="text" name="pseudo" id="pseudoRegister" value={pseudoRegister} onChange={e => setPseudoRegister(e.target.value)} required />
//           <label htmlFor="password"> Enter your password: </label>
//           <input type="password" name="password" id="passwordRegister" value={passwordRegister} onChange={e => setPasswordRegister(e.target.value)} required />
//           <input type="submit" value="Register" />
//         </form>
//         <div> {messageRegister} </div>
//       </div>

//       <div className="logInfo" style={{ "--order": 1 }}>
//         <p className="borderLine"> Login </p>
//         <form onSubmit={handleSubmitLogin}>
//           <label htmlFor="pseudo"> Enter your name: </label>
//           <input type="text" name="pseudo" id="pseudoLoginh" value={pseudoLogin} onChange={e => setPseudoLogin(e.target.value)} required />
//           <label htmlFor="password"> Enter your password: </label>
//           <input type="password" name="password" id="passwordLogin" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} required />
//           <label htmlFor="keepConnectede"> Keep me connected :</label>
//           <input
//             name="keepConnected"
//             type="checkbox"
//             checked={keepConnected}
//             onChange={e => setKeepConnected(e.target.checked)}
//           />
//           <input type="submit" value="Register" />
//         </form>
//       </div>
//     </div>
//     {/* < Footer /> */}
//   </div>
// )