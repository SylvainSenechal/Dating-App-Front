import { useState, useEffect, useCallback } from "react";

const EventsDisplay = ({ user, notificationDisplay }) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid, exp } = tokenPayload;

  return <div id="eventsDisplay">{notificationDisplay}</div>;
};

export default EventsDisplay;
