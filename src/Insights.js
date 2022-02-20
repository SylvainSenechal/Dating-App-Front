import { useState, useEffect } from 'react';
import { envData } from './App';

const Insights = ({ user, setUser, userInfos, setUserInfos }) => {
   const tokenData64URL = user.token.split('.')[1]
   const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
   const tokenPayload = JSON.parse(atob(tokenB64))
   const { name, sub, iat, exp } = tokenPayload

   const [loved, setLoved] = useState(0)
   const [rejections, setRejections] = useState(0)
   const [loving, setLoving] = useState(0)
   const [rejecting, setRejecting] = useState(0)
   console.log("OUOUI")


   useEffect(() => {
      async function getUserStatistics() {
         // TODO : clean parallel calls..
         // TODO : D3.js clean graph visualisation of love
         // TODO : Statistics by dates

         const result1 = await fetch(`${envData.apiURL}/users/${sub}/statistics/loved`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${user.token}`,
               'Content-Type': 'application/json'
            }
         })
         const readableResult1 = await result1.json()
         console.log(readableResult1)
         setLoved(readableResult1)

         const result2 = await fetch(`${envData.apiURL}/users/${sub}/statistics/rejected`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${user.token}`,
               'Content-Type': 'application/json'
            }
         })
         const readableResult2 = await result2.json()
         console.log(readableResult2)
         setRejections(readableResult2)

         const result3 = await fetch(`${envData.apiURL}/users/${sub}/statistics/loving`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${user.token}`,
               'Content-Type': 'application/json'
            }
         })
         const readableResult3 = await result3.json()
         console.log(readableResult3)
         setLoving(readableResult3)

         const result4 = await fetch(`${envData.apiURL}/users/${sub}/statistics/rejecting`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${user.token}`,
               'Content-Type': 'application/json'
            }
         })
         const readableResult4 = await result4.json()
         console.log(readableResult4)
         setRejecting(readableResult4)
      }

      getUserStatistics();
   }, []);
   return (
      <div className="display">
         insights :
         <div>Number of person fitting your search criterion :</div>
         <div>You were swiped {loved + rejections} times </div>
         <div>You were loved {loved} times </div>
         <div>You were rejected {rejections} times </div>
         <div>You loved {loving} persons</div>
         <div>You rejected {rejecting} persons </div>
      </div>
   )
}

export default Insights;