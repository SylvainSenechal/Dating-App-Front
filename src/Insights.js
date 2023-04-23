import { useState, useEffect } from "react";
import { get, post } from "./utils/Requests";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const Insights = ({ user, setUser, userInfos, setUserInfos }) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid } = tokenPayload;

  const [loved, setLoved] = useState(0);
  const [rejections, setRejections] = useState(0);
  const [loving, setLoving] = useState(0);
  const [rejecting, setRejecting] = useState(0);
  const [traces, setTraces] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getUserStatistics() {
      // TODO : clean parallel calls..
      // TODO : D3.js clean graph visualisation of love
      // TODO : Statistics by dates
      // TODO : NB messages sent, NB messages seen,

      try {
        setLoved(await get(`/users/${user_uuid}/statistics/loved`, user.token));
      } catch (error) {
        console.log("loved stats error : " + error);
      }
      try {
        setRejections(
          await get(`/users/${user_uuid}/statistics/rejected`, user.token)
        );
      } catch (error) {
        console.log("rejection stats error : " + error);
      }
      try {
        setLoving(
          await get(`/users/${user_uuid}/statistics/loving`, user.token)
        );
      } catch (error) {
        console.log("loving stats error : " + error);
      }
      try {
        setRejecting(
          await get(`/users/${user_uuid}/statistics/rejecting`, user.token)
        );
      } catch (error) {
        console.log("rejection stats error : " + error);
      }
      try {
        setTraces(await get(`/statistics/traces`, user.token));
      } catch (error) {
        console.log("traces stats error : " + error);
      }
    }

    getUserStatistics();
  }, []);

  document.onclick = (e) => console.log(traces);

  useEffect(() => {
    if (traces !== undefined) {
      let d = [];
      for (let i = 0; i < 24; i++) {
        d.push({
          hour: i,
          activity: 0,
        });
      }
      for (let trace of traces) {
        const dateHours = new Date(trace.datetime).getHours();
        d[dateHours].activity++;
      }
      setData(d);
    }
  }, [traces]);

  console.log(data);

  const renderLineChart = () => {
    return (
      <LineChart
        width={800}
        height={300}
        data={data}
        margin={{ top: 25, right: 20, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey="activity" stroke="#8884d8" dot={false} />
        <XAxis dataKey="hour" />
        <YAxis />
      </LineChart>
    );
  };

  return (
    <div className="display">
      insights :<div>Number of person fitting your search criterion :</div>
      <div>You were swiped {loved + rejections} times </div>
      <div>You were loved {loved} times </div>
      <div>You were rejected {rejections} times </div>
      <div>You loved {loving} persons</div>
      <div>You rejected {rejecting} persons </div>
      {renderLineChart()}
    </div>
  );
};

export default Insights;
