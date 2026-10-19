'use client';

import "./main_page.css";
import { useState } from "react";
import Image from 'next/image'


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
      {/* change end */}

      <div className="center_box">
        <div className="center_title_bar">
          <div className="center_playlist_title">Title Placeholder
            <div className="center_playlist_attached_title">No playlist Attached</div>
          </div>

          <div className="center_playlist_privacy_title">Private</div>
        </div>
        <div className="center_chats_container">
          {/* className="box1 center_box_sizing_user/center_box_sizing_system */}
              <div className="box1 center_box_sizing_user">Sure, here is an autmoasndhsdasjdjisoj</div>
              <div className="box1 center_box_sizing_system">Sure, here is an autmoasndhsdasjdjisoj</div>
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

    <div className="playlist_top_bar">Your Playlists</div>
    <div className="all_playlists_container">
      <div className="right_playlist_layout">
        <div className="right_playlist_title_box">Road Trip</div>
        <div className="right_playlist_song_list">
          <div className="right_playlist_song_box box1">
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>

            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
            <div className="right_playlist_song_title">Midnight City</div>
            <div className="right_playlist_song_artist">M83</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box2">
            <div className="right_playlist_song_title">Dreams12312312321321321</div>
            <div className="right_playlist_song_artist">Fleetwood Mac12312312312321</div>
            <div className="right_playlist_song_length">4:171232312312</div>
          </div>
          <div className="right_playlist_song_box box3">
            <div className="right_playlist_song_title">Go Your Own Way</div>
            <div className="right_playlist_song_artist">Fleetwood Mac</div>
            <div className="right_playlist_song_length">3:43</div>
          </div>
          <div className="right_playlist_song_box box4">
            <div className="right_playlist_song_title">Nightcall</div>
            <div className="right_playlist_song_artist">Kavinsky</div>
            <div className="right_playlist_song_length">4:18</div>
          </div>




        </div>
      </div>
      <div className="right_playlist_layout">
        <div className="right_playlist_title_box">Sunday Morning</div>
        <div className="right_playlist_song_list">
          <div className="right_playlist_song_box box6">
            <div className="right_playlist_song_title">Banana Pancakes</div>
            <div className="right_playlist_song_artist">Jack Johnson</div>
            <div className="right_playlist_song_length">3:12</div>
          </div>
          <div className="right_playlist_song_box box7">
            <div className="right_playlist_song_title">Put Your Records On</div>
            <div className="right_playlist_song_artist">Corinne Bailey Rae</div>
            <div className="right_playlist_song_length">3:35</div>
          </div>
          <div className="right_playlist_song_box box8">
            <div className="right_playlist_song_title">Better Together</div>
            <div className="right_playlist_song_artist">Jack Johnson</div>
            <div className="right_playlist_song_length">3:28</div>
          </div>
          <div className="right_playlist_song_box box9">
            <div className="right_playlist_song_title">Sunday Morning</div>
            <div className="right_playlist_song_artist">Maroon 5</div>
            <div className="right_playlist_song_length">4:03</div>
          </div>
          <div className="right_playlist_song_box box10">
            <div className="right_playlist_song_title">Lovely Day</div>
            <div className="right_playlist_song_artist">Bill Withers</div>
            <div className="right_playlist_song_length">4:15</div>
          </div>
        </div>
      </div>
    </div>



      </div>
      {/* change end */}

    </div>
  )
}