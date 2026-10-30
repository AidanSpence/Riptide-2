'use client';

import "./main_page.css";
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import {
  listChats,
  createChat,
  getChat,
  sendChatMessage,
  ChatApiError,
  type ChatSummary,
  type ChatMessageData
} from "../lib/api";

export default function MainPage({
  accessToken
}: {
  accessToken: string | null;
}) {


  // declared variables
  // setstate for left box, open = true
  const [leftOpen, setLeftOpen] = useState(true);
  // setstate for right box, open = true
  const [rightOpen, setRightOpen] = useState(true);
  // this is an array with all of the users/systems message, anything in here is displayed
  const [messageText, setMessageText] = useState<message[]>([]);
  // constantly updates this variable to the contents of the message textarea
  const [tempMessageText, setTempMessageText] = useState<string>("");
  // this enforces the sendlimit, false is unlocked, true is locked
  const [sendLimit, setSendLimit] = useState<boolean>(false);

  const [chats, setChats] = useState<ChatSummary[]>([]);

  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const [isSending, setIsSending] = useState<boolean>(false);

  const [chatError, setChatError] = useState<string>("");
  // sets the message limit to 3
  const messagelimit: number =  3;










  // message limit message, sets limit internally to true, and
  // if django returns limit reached, run this and it should lockout interface
function setLimitMessage() {
  const limitMessage: message = {
    // im making it +2 because otherwise it has the same id (bad, fix later)
    id: String(messageText.length + 2),
    text: "Send limit reached, create a new chat to continue",
    sender: "system"
  };
  // more or less appends to array
  setMessageText(previous => [...previous, limitMessage]);
  setSendLimit(true);
}





function toClientMessage(data: ChatMessageData): message {
  return {
    id: String(data.id),
    text: data.text,
    sender: data.sender
  };
}

  type message = {
  id: string;
  text: string;
  sender: "system" | "user";
  };

  // updates the temp variables each time the input field changes
  // which can then be sent to the proper setMessageText field
  function tempChatInput(event: React.ChangeEvent<HTMLInputElement>){

    setTempMessageText(event.currentTarget.value)
    // DEBUG
    // const inputID = event.currentTarget.id
    // const inputText = event.currentTarget.value
    // const sender = "user"
    // console.log(inputID)
    // console.log(inputText)
    // console.log(sender)
  };

  function saveChatInput(){
    if (tempMessageText.trim() === "") return;
    // return the length of messages with the "user" tag
    const userMessageCount = messageText.filter( (msg) => msg.sender === "user").length;
    // enforces send limit, if its true do nothing
      if (sendLimit === true) {return false;}
      // if sendlimit isn't set yet, but messagelimit reached, addlimitmessage, which sets the limit to true
      if (userMessageCount >= messagelimit) {setLimitMessage(); return false;}

      // create new message
      const newMessage: message = {
        id: String(messageText.length + 1),
        text: tempMessageText,
        sender: "user"
      };
        //  this adds the newmessage it to the array to be sent to postgres
        setMessageText(previous => [...previous, newMessage]);
      // Clear the input box
      setTempMessageText("");
      // debug
      // addDebugMessage()
      // console.log(newMessage)
    }


  async function startNewChat() {
    if (!accessToken || isSending) return;

    try {
      const chat = await createChat(accessToken);

      // Add the new chat to the sidebar array
      setChats(previous => [chat, ...previous]);

      // Select the newly created chat
      setCurrentChatId(chat.id);

      // Clear previous chat messages and input
      setMessageText([]);
      setTempMessageText("");

      // Unlock messaging for the new chat
      setSendLimit(false);
      setChatError("");

    } catch (error) {
      console.error("Failed to create chat:", error);
      setChatError("Unable to create conversation.");
    }
  }


  async function openChat(chatId: number) {
    if (!accessToken || isSending) return;

    try {
      const chat = await getChat(accessToken, chatId);

      // Select this conversation
      setCurrentChatId(chat.id);

      // Load its messages into the existing array
      setMessageText(
        chat.messages.map(toClientMessage)
      );

      // Apply Django's message limit
      setSendLimit(chat.remaining_messages === 0);

      setChatError("");
      setTempMessageText("");

    } catch (error) {
      console.error("Failed to load chat:", error);
      setChatError("Unable to load conversation.");
    }
  }



}
  // Page stuff
  return(

    <div className="page_layout">
      {/* Left panel with chats, playlists, and profile. */}
      <button
        className={`drawer_toggle left_drawer_toggle${leftOpen ? " is_open" : ""}`}
        type="button"
        aria-label={leftOpen ? "Close chats panel" : "Open chats panel"}
        aria-controls="left-drawer"
        aria-expanded={leftOpen}
        onClick={() => setLeftOpen((open) => !open)}
      >
        {leftOpen ? "<" : ">"}
      </button>
      <div
        className={`left_box${leftOpen ? " is_open" : ""}`}
        id="left-drawer"
        aria-hidden={!leftOpen}
        inert={!leftOpen}
      >
        <div className="left_chats">
          <div className="left_chat_title">Chats:</div>
          <button
            type="button"
            onClick={startNewChat}
            disabled={!accessToken || isSending}
          >
            New Chat
          </button>
          <div className="left_chat_box_scrolling">
            {chats.map(chat => (
              <button
                key={chat.id}
                type="button"
                className="left_box_sizing left_chat_box_1"
                onClick={() => openChat(chat.id)}
                disabled={isSending}
              >
                {chat.name}
              </button>
            ))}
          </div>




        </div>
        <div className="left_linked_playlists">
          <div className="left_playlist_title">Your linked service playlists:</div>
          <div className="left_linked_playlists_scrolling">
            <div className="left_box_sizing left_playlist_box_1"></div>
          </div>


        </div>
        <div className="left_profile_container">
          <div className="left_profile_icon_bg"><div className="left_profile_icon_text">JD</div></div>
          <div className="left_profile_info_box">
            <div className="left_profile_name">John Doe</div>
            <div className="left_profile_service_state">Service - Spotify Connectedsdfguiopoigfghj</div>
          </div>
        </div>
      </div>

      {/* Main chat area. */}
      <div className="center_box">
        <div className="center_title_bar">
          <div className="center_playlist_title">Title Placeholder
            <div className="center_playlist_attached_title">No playlist Attached</div>
          </div>

          <div className="center_playlist_privacy_title">Private</div>
        </div>
        <div className="center_chats_container">
                
                
          {/* Create all boxes for chatting here in the container center_chats_container.
          center_box_sizing_user - (message is from the user)
          center_box_sizing_system - (message is from the system)
          Display the store messages, use map, check values are correct, display. */}
          {messageText.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === "user"
                  ? "center_box_sizing_user"
                  : "center_box_sizing_system"
              }
            >
              {msg.text}
            </div>
          ))}

        </div>
        <div className='center_chats_input_box'>
            <input
          className='center_chats_input_clickable'
          id="user_chat"
          name="chat"
          type="text"
          autoComplete="off"
          // update the temp variable everytime an input happens
          value={tempMessageText}
          onChange={tempChatInput}
          required
          ></input>
          {/* For debugging system messages, add (() => {saveChatInput; addTestMessage} into the onclick */}
          <button className="center_chats_send_message" onClick={saveChatInput}>
            <Image className="center_send_button_image" src="send.svg" width={30} height={30} alt="send button"></Image>
          </button>
        </div>
      </div>









      {/* Right panel with the user's playlists. */}
      <button
        className={`drawer_toggle right_drawer_toggle${rightOpen ? " is_open" : ""}`}
        type="button"
        aria-label={rightOpen ? "Close playlist panel" : "Open playlist panel"}
        aria-controls="right-drawer"
        aria-expanded={rightOpen}
        onClick={() => setRightOpen((open) => !open)}
      >
        {rightOpen ? ">" : "<"}
      </button>
      <div
        className={`right_box${rightOpen ? " is_open" : ""}`}
        id="right-drawer"
        aria-hidden={!rightOpen}
        inert={!rightOpen}
      >




{/*

all playlists should be created in javascript and placed
into the right_all_playlists_container parent, the order should go:


"right_playlist_layout" - (creates the box)
"right_playlist_title_box" - (should contain the title of the playlist)
"right_playlist_song_list" - (grid container for all the songs, should be empty)
"right_playlist_song_box (box*)" - (contains the information for 1 song, box* is a leftover
-js identifier that might be removed later but currently does nothing and should be empty)

"right_playlist_song_title / artist / length" - (should contain the title / artist / length)

all elements can be of any type or length including blank but preferably have content.
*/}

    <div className="playlist_top_bar">Your Playlists</div>

    <div className="right_all_playlists_container">
    {/* playlists goes here */}
    </div>

  </div>
</div>
)}