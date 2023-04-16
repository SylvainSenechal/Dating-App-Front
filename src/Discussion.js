import { useState, useEffect, useCallback } from "react";
import { get, post, put } from "./utils/Requests";

const Discussion = ({
  user,
  loveUUID,
  setLoveUUID,
  lovers,
  newChatMessage,
  newGreenTickLoveUUID
}) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid, exp } = tokenPayload;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessagesList = async () => {
      try {
        setMessages(await get(`/messages/${loveUUID}`, user.token));
        const messageDiv = document.getElementById("messagesList");
        const messagesDivViewHeight = messageDiv.clientHeight; // The height that we can view
        const messagesDivHeight = messageDiv.scrollHeight; // The height if we could view the whole div with a big monitor
        messageDiv.scroll(0, messagesDivHeight - messagesDivViewHeight);
      } catch (error) {
        console.log("get discussion message list error : " + error);
      }
    };

    getMessagesList();
  }, [newChatMessage]);

  const postMessage = async (e) => {
    e.preventDefault(); //: TODO : see if useful ?
    try {
      await post(`/messages`, user.token, {
        message: newMessage,
        poster_uuid: user_uuid,
        love_uuid: loveUUID,
      }); // TODO add authorization.. : Dont post message to someone never matched
      setNewMessage("");
    } catch (error) {
      console.log("post message error : " + error);
    }
  };

  useEffect(() => {
    let newMessages = []
    for (let message of messages) {
      console.log(newGreenTickLoveUUID)
      const love_uuid_new_tick = newGreenTickLoveUUID.split(",")[0]
      if (message.love_uuid === love_uuid_new_tick ) { // This verif is not so usefull, as all the message love_uuid should be the same tickLoveUUID
        if (message.poster_uuid === user_uuid) { // Mark as "seen" only your own messages (you cannot view your own messages for the others)
        message.seen = 1
        }
      }
      newMessages.push(message)
    }
    setMessages(newMessages)
  }, [newGreenTickLoveUUID])

  useEffect(() => {
    const greenTickCurrentMessages = async () => {
      for (let message of messages) {
        if (message.poster_uuid !== user_uuid) {
          // Only green tick messages of the other person
          if (!message.seen) {
            // Only green tick messages that are not already ticked
            try {
              await put(`/messages/tick_messages`, user.token, {
                lover_ticked_uuid: message.poster_uuid,
                love_uuid: message.love_uuid,
              });
              break // Since we tick the whole discussion at the same time, no need to continue the loop
            } catch (error) {
              console.log("green tick messages error : " + error);
            }
          }
        }
      }
    };

    greenTickCurrentMessages();
  }, [messages]);

  const greenTickSeen = (seen) => {
    if (seen) {
      return (
        // <span className='tickUnseen'>  </span>
        <svg className="tickSeen">
          <circle cx="0" cy="0" r="5" fill="green" />
        </svg>
      );
    } else {
      return (
        // <span className='tickUnseen'>  </span>
        <svg className="tickUnseen">
          <circle cx="0" cy="0" r="5" fill="red" />
        </svg>
      );
    }
  };

  // Text tres long en train decrire: augmenter la taille de la box pour ecrire
  // TODO : pinned/keep a lover at the top feature
  // TODO : Message DATE : Onky print if delta between previous message is bigger than some defined time
  return (
    <div id="discussion">
      <div id="messagesList">
        {messages.map((message, id) => {
          const date = new Date(message.creation_datetime);
          // todo : be careful get the right week
          const displayedDate =
            days[date.getDay()] +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds();
          let lastSeenPerson = new Date();
          for (let lover of lovers) {
            if (lover.love_uuid === loveUUID) {
              lastSeenPerson = new Date(lover.last_seen);
            }
          }
          const DisplayLastSeen =
            days[lastSeenPerson.getDay()] +
            " " +
            lastSeenPerson.getHours() +
            ":" +
            lastSeenPerson.getMinutes() +
            ":" +
            lastSeenPerson.getSeconds();
          let showLastConnection = false;
          if (lastSeenPerson > date) {
            let nextMessage = messages[id + 1];
            if (nextMessage != undefined) {
              if (lastSeenPerson < new Date(nextMessage.creation_datetime)) {
                showLastConnection = true;
              }
            } else {
              showLastConnection = true;
            }
          }
          console.log(showLastConnection);

          if (showLastConnection) {
            return message.poster_uuid === user_uuid ? (
              <div key={message.uuid} className="ownMessagePosition">
                {greenTickSeen(message.seen)}
                <div className="message ownMessage">
                  <div> {message.message} </div>
                </div>
                <div className="datetimeMessage"> {displayedDate} </div>
                <div id="loverLasteSeen">
                  {" "}
                  Last connection: {DisplayLastSeen}{" "}
                </div>
              </div>
            ) : (
              <div key={message.uuid} className="otherMessagePosition">
                <div className="message otherMessage"> {message.message}</div>
                <div className="datetimeMessage"> {displayedDate} </div>
                <div id="loverLasteSeen">
                  {" "}
                  Last connection: {DisplayLastSeen}{" "}
                </div>
              </div>
            );
          } else {
            return message.poster_uuid === user_uuid ? (
              <div key={message.uuid} className="ownMessagePosition">
                {greenTickSeen(message.seen)}
                <div className="message ownMessage">
                  <div> {message.message} </div>
                </div>
                <div className="datetimeMessage"> {displayedDate} </div>
              </div>
            ) : (
              <div key={message.uuid} className="otherMessagePosition">
                <div className="message otherMessage"> {message.message}</div>
                <div className="datetimeMessage"> {displayedDate} </div>
              </div>
            );
          }
        })}
      </div>
      <form id="formPostMessage">
        <input
          id="chatText"
          type="text"
          placeholder=" Send a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button id="postMessageBtn" onClick={postMessage}>
          {" "}
          Go{" "}
        </button>
      </form>
    </div>
  );
};

const days = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6: "Sat",
};

export default Discussion;
