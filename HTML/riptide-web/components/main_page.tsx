import "./main_page.css";

export default function main_page() {
  return(
    <div className="page_layout">
      <div className="left_container">
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

      <div className="center_box">
      center box

      </div>

      <div className="right_box">
      right box

      </div>














    </div>
  )
}