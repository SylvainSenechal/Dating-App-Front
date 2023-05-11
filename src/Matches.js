import { useState, useEffect } from "react";
import Discussion from "./Discussion";
import UserSettings from "./UserSettings";
import DiscussionsPreview from "./DiscussionsPreview";
import { get, post, put } from "./utils/Requests";

const Matches = ({
  user,
  lovers,
  newChatMessage,
  tickUnseenMatch,
  setTickUnseenMatch,
  newGreenTickLoveUUID,
}) => {
  const [loveUUID, setLoveUUID] = useState(-1);
  const [messages, setMessages] = useState(new Map());

  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid, exp } = tokenPayload;

  useEffect(() => {
    const getMessagesList = async () => {
      try {
        const result = await get(`/messages/users/${user_uuid}`, user.token);
        const newMessages = new Map();
        for (let newMessage of result) {
          if (!newMessages.has(newMessage.love_uuid)) {
            newMessages.set(newMessage.love_uuid, [newMessage]);
          } else {
            const messagesInLoveRoomUUID = newMessages.get(
              newMessage.love_uuid
            );
            messagesInLoveRoomUUID.push(newMessage);
            newMessages.set(newMessage.love_uuid, messagesInLoveRoomUUID);
          }
        }
        setMessages(newMessages);
      } catch (error) {
        console.log("get message list error : " + error);
      }
    };

    getMessagesList();
  }, [newChatMessage]);

  const chatWith = async (e) => {
    const loveUUID = e.currentTarget.dataset.index;
    for (let lover of lovers) {
      console.log(lover.love_uuid);
      console.log(loveUUID);
      if (lover.love_uuid === loveUUID) {
        if (user_uuid === lover.lover1 && lover.seen_by_lover1 === 0) {
          try {
            await put(
              `/lovers/action/${lover.love_uuid}/tick_love`,
              user.token
            );
            setTickUnseenMatch(tickUnseenMatch + 1);
          } catch (error) {
            console.log(" tick love error : " + error);
          }
        } else if (user_uuid === lover.lover2 && lover.seen_by_lover2 === 0) {
          try {
            await put(
              `/lovers/action/${lover.love_uuid}/tick_love`,
              user.token
            );
            setTickUnseenMatch(tickUnseenMatch + 1);
          } catch (error) {
            console.log(" tick love error : " + error);
          }
        }
      }
    }
    setLoveUUID(loveUUID);
  };

  document.onclick = (e) => {
    console.log(lovers);
  };

  // TODO : pinned lover feature
  return (
    <div className="display" id="matches">
      {loveUUID === -1 ? (
        <>
          <div id="matchesWelcome">
            {" "}
            You matched with these amazing people !
          </div>
          <div id="matchesPreview">
            {lovers.map((lover) => (
              <div
                className="lover"
                data-index={lover.love_uuid}
                onClick={chatWith}
                key={lover.love_uuid}
              >
                <img id="previewImage" src={lover.first_photo_url} />
                <div> {lover.name} </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
        <div id="generalInfosTargetDiscussion">
          <button id="buttonBackListLovers" onClick={() => setLoveUUID(-1)}> back </button>
          <img
            id="previewImage"
            src={
              lovers.find((elem) => elem.love_uuid == loveUUID).first_photo_url
            }
          />
          <div id="nameLoverDiscussion"> {lovers.find((elem) => elem.love_uuid == loveUUID).name} </div>
        </div>
        <div id="lineDivider"> </div>
        </>
      )}

      {loveUUID === -1 ? (
        <DiscussionsPreview
          user={user}
          messages={messages}
          setLoveUUID={setLoveUUID}
          lovers={lovers}
          tickUnseenMatch={tickUnseenMatch}
          setTickUnseenMatch={setTickUnseenMatch}
        />
      ) : (
        <Discussion
          user={user}
          loveUUID={loveUUID}
          setLoveUUID={setLoveUUID}
          lovers={lovers}
          newChatMessage={newChatMessage}
          newGreenTickLoveUUID={newGreenTickLoveUUID}
        />
      )}
    </div>
  );
};

export default Matches;
