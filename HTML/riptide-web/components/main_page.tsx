'use client';

import "./main_page.css";
import { useState } from "react";
import Image from 'next/image'

export default function MainPage() {
  /* Track whether each side panel is open. */
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

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
          <div className="left_chat_box_scrolling">
            <div className="left_box_sizing left_chat_box_1"></div>
            <div className="left_box_sizing left_chat_box_1"></div>
            <div className="left_box_sizing left_chat_box_1"></div>
          </div>




        </div>
        <div className="left_linked_playlists">
          <div className="left_playlist_title">Your linked service playlists:</div>
          <div className="left_linked_playlists_scrolling">
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          <div className="left_box_sizing left_playlist_box_1"></div>
          </div>


        </div>
        <div className="left_profile_container">
          <div className="left_profile_icon_bg"><div className="left_profile_icon_text">JD</div></div>
          <div className="left_profile_info_box">
            <div className="left_profile_name">John Doe</div>
            <div className="left_profile_service_state">Service - Spotify Connected</div>
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
*/}

              {/* <div className="box1 center_box_sizing_user">Sure, here is an autmoasndhsdasjdjisoj</div>
              <div className="box1 center_box_sizing_system">Sure, here is an autmoasndhsdasjdjisoj</div> */}
      </div>
      <div className='center_chats_input_box'>
        <input
      className='center_chats_input_clickable'
      id="user_chat"
      name="chat"
      type="text"
      autoComplete="off"
      required
      ></input><button className="center_chats_send_message"><Image className="center_send_button_image" src="send.svg" width={30} height={30} alt="send button"></Image></button></div>





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
  )
}