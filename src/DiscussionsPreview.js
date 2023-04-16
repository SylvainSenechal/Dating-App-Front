import { useState, useEffect, useCallback } from "react";
import { get, post, put } from "./utils/Requests";

const DiscussionsPreview = ({
  user,
  messages,
  setLoveUUID,
  lovers,
  tickUnseenMatch,
  setTickUnseenMatch,
}) => {
  const tokenData64URL = user.token.split(".")[1];
  const tokenB64 = tokenData64URL.replace(/-/g, "+").replace(/_/g, "/");
  const tokenPayload = JSON.parse(atob(tokenB64));
  const { user_uuid, exp } = tokenPayload;

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

  console.log("rerender");
  const discussionPreview = () => {
    let content = [];
    let contentSorted = [];
    // console.log("messages", messages)
    for (const [loveUUID, messageArray] of messages.entries()) {
      let nbMessagesUnseen = 0;
      // console.log(messageArray)
      // console.log(loveID)
      // console.log(messageArray)

      for (let message of messageArray) {
        if (message.poster_uuid !== user_uuid && !message.seen) {
          // Message not posted by me, and that I havent seen
          // console.log("UNSEEEEN ", nbMessagesUnseen)
          // console.log("UNSEEEEN 1", message.id)
          nbMessagesUnseen++;
        }
      }
      content.push({
        loveUUID: loveUUID,
        lastMessage: messageArray[messageArray.length - 1].message,
        nbMessagesUnseen: nbMessagesUnseen,
        lastMessageDate: new Date(
          messageArray[messageArray.length - 1].creation_datetime
        ),
      });
    }
    content.sort((a, b) => {
      // Most recent active discussion will come first in the list
      if (a.lastMessageDate < b.lastMessageDate) return 1;
      else return -1;
    });

    for (let elem of content) {
      const dateDisplay =
        days[elem.lastMessageDate.getDay()] +
        " " +
        elem.lastMessageDate.getHours() +
        ":" +
        elem.lastMessageDate.getMinutes() +
        ":" +
        elem.lastMessageDate.getSeconds();
      contentSorted.push(
        <button
          data-index={elem.loveUUID}
          onClick={chatWith}
          key={elem.loveUUID}
          className="discussionBlocPreview"
        >
          <div className="previewName"> Love {elem.loveID} </div>{" "}
          {/* todo : name of the lover */}
          <div className="previewDate"> {dateDisplay} </div>
          <div className="PreviewUnSeenMessages"> {elem.nbMessagesUnseen} </div>
          <div className="previewMessage"> {elem.lastMessage} </div>
        </button>
      );
    }
    return contentSorted;
  };

  return (
    <div id="previewDiscussion">
      <div id="listOfDiscussionGreating"> Your ongoing discussions </div>
      <div id="ongoingDiscussions">{discussionPreview()}</div>
    </div>
  );
};

const days = {
  // todo : move to utils/const folder
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6: "Sat",
};

export default DiscussionsPreview;
