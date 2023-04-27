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
      let loverName = ""
      for (let loveRelationship of lovers) {
        console.log(loveRelationship.loveUUID)
        if (loveRelationship.love_uuid === elem.loveUUID) {
          loverName = loveRelationship.name
        }
      }
      let msSince1970 = elem.lastMessageDate.getTime()
      let diffMs = Date.now() - msSince1970
      let minutesDiff = Math.round(diffMs / 60000)
      let dateDisplay = ""
      if (minutesDiff <= 1) {
        dateDisplay = "1 minute ago:"
      } else if (minutesDiff < 60) {
        dateDisplay = minutesDiff + " minutes ago:"
      } else {
        dateDisplay = Math.floor(minutesDiff / 60) + " hours ago:"
      }
  
      contentSorted.push(
        <button
          data-index={elem.loveUUID}
          onClick={chatWith}
          key={elem.loveUUID}
          className="discussionBlocPreview"
        >
          <div className="previewName"> {loverName} </div>{" "}
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

export default DiscussionsPreview;
