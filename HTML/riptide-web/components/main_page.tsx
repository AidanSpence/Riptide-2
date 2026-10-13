'use client';

import "./main_page.css";
import { useState } from "react";

export default function MainPage() {
  /* This change will let each side panel expand and collapse independently. */
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  /* change end */

  return(
    <div className="page_layout">

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
        className={`left_container${leftOpen ? " is_open" : ""}`}
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
      {/* change end */}

      <div className="center_box">
        <div className="center_title_bar">
          <div className="center_playlist_title">Title Placeholder
            <div className="center_playlist_attached">No playlist Attached</div>
          </div>

          <div className="center_playlist_privacy">Private</div>
        </div>
        <div className="center_chats_container">
          <input
              className='center_chats_input'
              id="user_chat"
              name="chat"
              type="text"
              autoComplete="off"
              required
              ></input>
      </div>



      </div>



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
      right box

      </div>
      {/* change end */}

    </div>
  )
}