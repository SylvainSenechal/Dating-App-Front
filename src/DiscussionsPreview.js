import { useState, useEffect, useCallback } from 'react';
import { envData } from './App';

const DiscussionsPreview = ({ user, messages, socket, setLoveID }) => {
  const tokenData64URL = user.token.split('.')[1]
  const tokenB64 = tokenData64URL.replace(/-/g, '+').replace(/_/g, '/')
  const tokenPayload = JSON.parse(atob(tokenB64))
  const { name, sub, iat, exp } = tokenPayload



  const chatWith = e => {
    const loveID = Number(e.currentTarget.dataset.index)
    console.log(e)
    console.log(loveID)
    setLoveID(loveID)
    socket.send(`/join ${loveID}`) // joining a love room 
  }

  const discussionPreview = () => {
    let content = []
    let contentSorted = []
    for (const [loveID, messageArray] of messages.entries()) {
      content.push({
        loveID: loveID,
        lastMessage: messageArray[messageArray.length - 1].message,
        lastMessageDate: new Date(messageArray[messageArray.length - 1].creation_datetime)
      })
    }
    content.sort((a, b) => { // Most recent active discussion will come first in the list
      if (a.lastMessageDate < b.lastMessageDate) return 1
      else return -1
    })
    for (let elem of content) {
      console.log(elem.lastMessageDate)
      const dateDisplay = days[elem.lastMessageDate.getDay()] + " " + elem.lastMessageDate.getHours() + ":" + elem.lastMessageDate.getMinutes() + ":" + elem.lastMessageDate.getSeconds()
      contentSorted.push(
        <button data-index={elem.loveID} onClick={chatWith} key={elem.loveID} className='discussionBlocPreview'>
          <div className='previewName'> Love {elem.loveID} </div>
          <div> {dateDisplay} </div>
          <div> {elem.lastMessage} </div>
        </button>
      )
    }
    return (contentSorted)
  }


  return (
    <div id='previewDiscussion'>
      <div id='listOfDiscussionGreating'> Your ongoing discussions </div>
      <div id='ongoingDiscussions'>
        {discussionPreview()}
      </div>
    </div>
  )
}

const days = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thur",
  5: "Fri",
  6: "Sat",
}


export default DiscussionsPreview;