import { useState, useEffect } from 'react';
import { get, post } from './utils/Requests';

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

         try {
            setLoved(await get(`/users/${sub}/statistics/loved`, user.token))
         } catch (error) {
            console.log('loved stats error : ' + error)
         }
         try {
            setRejections(await get(`/users/${sub}/statistics/rejected`, user.token))
         } catch (error) {
            console.log('rejection stats error : ' + error)
         }
         try {
            setLoving(await get(`/users/${sub}/statistics/loving`, user.token))
         } catch (error) {
            console.log('loving stats error : ' + error)
         }
         try {
            setRejecting(await get(`/users/${sub}/statistics/rejecting`, user.token))
         } catch (error) {
            console.log('rejection stats error : ' + error)
         }
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