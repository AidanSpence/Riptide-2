'use client';

import "./main_page.css";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-provider";
import Image from 'next/image'
import {
  listChats,
  createChat,
  deleteChat,
  getChat,
  sendChatMessage,
  listPlaylists,
  deletePlaylist,
  exportPlaylist,
  isPlaylistData,
  PLAYLIST_DEMO_MODE,
  ChatApiError,
  getSpotifyStatus,
  getCurrentUser,
  getLinkedPlaylists,
  type ChatSummary,
  type ChatMessageData,
  type PlaylistData,
  type LinkedPlaylist
} from "../lib/api";
import { demoPlaylists } from "../lib/playlist-demo";

export default function MainPage() {
  // retrieve the login key from the shared auth provider
  const { accessToken, logout } = useAuth();


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
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  // used to ignore old requests after someone logs out
  const activeTokenRef = useRef<string | null>(accessToken);
  const requestPendingRef = useRef<boolean>(false);

  // right panel playlist state, separate from the users chat messages
  const [playlists, setPlaylists] = useState<PlaylistData[]>(PLAYLIST_DEMO_MODE ? demoPlaylists : []);
  const [playlistError, setPlaylistError] = useState<string>("");
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState<boolean>(false);
  const [deletingPlaylistId, setDeletingPlaylistId] = useState<number | null>(null);
  const [exportingPlaylistId, setExportingPlaylistId] = useState<number | null>(null);
  const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState<string>("");
  // negative IDs are temporary for generated playlists not saved by Django
  const nextLocalPlaylistId = useRef<number>(-2);

  // linked playlists map
  const [linked, setLinked] = useState<boolean>(false);
  const [linkedPlaylists, setLinkedPlaylists] = useState<LinkedPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // spotify
  const [spotifyConnected, setSpotifyConnected] = useState<boolean>(false);

  // active chat
  const [activeChatId, setActiveChatId] = useState<number | null>(null);


  const [username, setUsername] = useState<string>("");


  async function loadUsername() {
      try {
      const user = await getCurrentUser(accessToken!);
      setUsername(user.username);
      } catch (error) {
      console.error("Failed to retrieve username:", error);
      }
  } 
  
useEffect(() => {
  if (accessToken) {
    void loadUsername();
  }
}, [accessToken]);
    
  
useEffect(() => {
  if (!accessToken) {
    void setUsername("");
  }
}, [accessToken]);


  // message limit message, sets limit internally to true, and
  // if django returns limit reached, run this and it should lockout interface
  function setLimitMessage() {
    // show an error without saving a made-up system message to postgres
    setChatError("Send limit reached, create a new chat to continue");
    setSendLimit(true);
  }

  // show the actual request error so failed endpoints aren't silent
  function describeChatError(error: unknown, action: string): string {
    if (error instanceof ChatApiError) {
      if (error.status === 404) {
        return `${action}: HTTP 404. Check that the Django chat endpoints exist.`;
      }
      return `${action}: HTTP ${error.status} - ${error.message}`;
      }
      if (error instanceof TypeError) {
        return `${action}: Cannot contact Django. Check the API URL, server and CORS settings.`;
      }
    return `${action}: ${error instanceof Error ? error.message : "Unknown error"}`;
  }

  // playlist errors use the playlist endpoint rather than the chat endpoint
  function describePlaylistError(error: unknown, action: string): string {
    if (error instanceof ChatApiError && error.status === 404) {
      return `${action}: HTTP 404. Check that the Django playlist endpoints exist.`;
    }
    return describeChatError(error, action);
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

  // load the users saved conversations after the access token becomes available
  useEffect(() => {
    activeTokenRef.current = accessToken;

    // clear the previous account's chats whenever the login changes
    setChats([]);
    setCurrentChatId(null);
    setMessageText([]);
    setTempMessageText("");
    setSendLimit(false);
    setChatError("");
    setIsSending(false);
    setIsLoadingChat(false);

    if (!accessToken) return;

    let cancelled = false;
    listChats(accessToken)
      .then(result => {
        if (!cancelled) setChats(result.chats);
      })
      .catch(error => {
        if (cancelled) return;
        console.error("Failed to load chats:", error);
        if (error instanceof ChatApiError && error.status === 401) {
          logout();
        } else {
          setChatError(describeChatError(error, "Unable to load saved conversations"));
        }
      });

    return () => { cancelled = true; };
  }, [accessToken, logout]);

  // load saved playlists after login (demo data is used until Django has an endpoint)
  useEffect(() => {
    setPlaylists(PLAYLIST_DEMO_MODE ? demoPlaylists : []);
    setPlaylistError("");
    setDeletingPlaylistId(null);

    if (PLAYLIST_DEMO_MODE || !accessToken) {
      setIsLoadingPlaylists(false);
      return;
    }

    let cancelled = false;
    setIsLoadingPlaylists(true);

    listPlaylists(accessToken)
      .then(result => {
        if (!cancelled) {
          // keep any unsaved playlist generated while the request was loading
          setPlaylists(previous => [...previous.filter(item => (item.id ?? 0) < 0), ...result]);
        }
      })
      .catch(error => {
        if (cancelled) return;
        console.error("Failed to load playlists:", error);
        setPlaylistError(describePlaylistError(error, "Unable to load playlists"));
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPlaylists(false);
      });

    return () => { cancelled = true; };
  }, [accessToken]);

  // display the seconds from Django as minutes and seconds
  function formatPlaylistDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  }

  // remove the playlist from the UI, and from Django if it was saved there
  async function removePlaylist(playlist: PlaylistData) {
    if (deletingPlaylistId !== null) return;
    if (!window.confirm(`Delete playlist "${playlist.name}"?`)) return;

    const playlistId = playlist.id;
    if (playlistId === undefined) return;
    setPlaylistError("");

    // previews don't exist in postgres; deleting them only affects this page
    if (playlistId < 0 || PLAYLIST_DEMO_MODE) {
      setPlaylists(previous => previous.filter(item => item.id !== playlistId));
      return;
    }

    if (!accessToken) {
      setPlaylistError("Log in before deleting a saved playlist.");
      return;
    }
  }
  // check spotify connected and update the profile in bottom left
  useEffect(() => {
    if (!accessToken) return;
    console.log("Spotify Connection status: ", getSpotifyStatus(accessToken))
    let cancelled = false;

    getSpotifyStatus(accessToken)
      .then(connected => {
        if (!cancelled) setSpotifyConnected(connected);
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [accessToken]);



  // load spotify playlists when the user logs in
  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function loadLinkedPlaylists() {
      setLoading(true);

      try {
        const data = await getLinkedPlaylists(accessToken!);

        if (cancelled) return;

        setLinked(data.linked);
        setLinkedPlaylists(data.playlists);

      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load Spotify playlists:", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadLinkedPlaylists();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);



  // package the playlist, send it to django, and ensure it can only be done once
  async function sendExportPlaylist(playlist: PlaylistData) {
    if (!window.confirm(`export playlist "${playlist.name}"?`)) return;

    const playlistId = playlist.id;
    if (playlistId === undefined) return;
    setPlaylistError("");

    if (!accessToken) {
      setPlaylistError("Log in before exporting a saved playlist.");
      return;
    }

    const token = accessToken;
    setExportingPlaylistId(playlistId);
    try {
      await exportPlaylist(token, playlistId);
      if (activeTokenRef.current !== token) return;
    } catch (error) {
      if (activeTokenRef.current !== token) return;
      console.error("Failed to export playlist:", error);
      setPlaylistError(describePlaylistError(error, "Unable to export playlist"));
    } finally {
      if (activeTokenRef.current === token) setExportingPlaylistId(null);
    }
  }

  // updates the temp variables each time the input field changes
  // which can then be sent to the proper setMessageText field
  function tempChatInput(event: React.ChangeEvent<HTMLInputElement>){
    setTempMessageText(event.currentTarget.value);
    // DEBUG
    // const inputID = event.currentTarget.id
    // const inputText = event.currentTarget.value
    // const sender = "user"
    // console.log(inputID)
    // console.log(inputText)
    // console.log(sender)
  };
  async function handleDeleteChat(chatId: number) {
    if (!accessToken) return;

    try {
      await deleteChat(accessToken, chatId);

      // remove deleted chat from the sidebar
      setChats(previous =>
        previous.filter(chat => chat.id !== chatId)
      );

      // clear the current chat if it was deleted
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessageText([]);
        setSendLimit(false);
      }

    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  }
async function saveChatInput() {
  const text = tempMessageText.trim();
  if (!text) return;

  // let the user know why the message wasn't sent rather than doing nothing
  if (!accessToken) {
    setChatError("Log in using the profile button before sending a message.");
    return;
  }

  // django handles the real send limit, the state here locks the button
  if (sendLimit) {
    setLimitMessage();
    return;
  }

  if (isSending || isLoadingChat || requestPendingRef.current) return;

  // prevents duplicate submissions while react is updating its state
  requestPendingRef.current = true;
  const token = accessToken;
  let tempMessageId: string | null = null;

  setIsSending(true);
  setChatError("");

  try {
    let chatId = currentChatId;

    // first message: create the conversation automatically if none is selected
    if (chatId === null) {
      const chat = await createChat(token);
      if (activeTokenRef.current !== token) return;

      chatId = chat.id;
      setChats(previous => [chat, ...previous]);
      setCurrentChatId(chat.id);
      setMessageText([]);
    }

    // display the user's message immediately
    tempMessageId = crypto.randomUUID();

    const tempUserMessage: message = {
      id: tempMessageId,
      text: text,
      sender: "user"
    };

    setMessageText(previous => [...previous, tempUserMessage]);

    // send just the new message to django instead of the full array
    const result = await sendChatMessage(token, chatId, text, selectedSpotifyPlaylistId);
    if (activeTokenRef.current !== token) return;

    console.log(token, chatId, text, selectedSpotifyPlaylistId);
    // update the chat name in the sidebar
    if (result.playlist?.chat_name) {
      setChats(previous =>
        previous.map(chat =>
          chat.id === chatId
            ? { ...chat, name: result.playlist!.chat_name }
            : chat
        )
      );
    }
    // replace the temporary message with django's saved message
    setMessageText(previous =>
      previous.map(msg =>
        msg.id === tempMessageId
          ? toClientMessage(result.message)
          : msg
      )
    );

    const newMessages: message[] = [];

    // append the system message if django returned one with the playlist
    if (result.playlist?.message) {
      const temp_sys_msg: message = {
        text: result.playlist.message,
        id: crypto.randomUUID(),
        sender: "system"
      };

      newMessages.push(temp_sys_msg);
    }

    // append the system message
    setMessageText(previous => [...previous, ...newMessages]);
    setSelectedSpotifyPlaylistId("");
    // django can optionally include a new playlist alongside the chat reply
    if (result.playlist) {
      if (isPlaylistData(result.playlist)) {
        const newPlaylist: PlaylistData = {
          ...result.playlist,
          id: result.playlist.id ?? nextLocalPlaylistId.current--
        };

        setPlaylists(previous => [
          newPlaylist,
          ...previous.filter(item => item.id !== newPlaylist.id)
        ]);
      } else {
        setPlaylistError("Django returned a playlist in an unexpected format.");
      }
    }

    setTempMessageText("");
    setSendLimit(result.remaining_messages === 0);

    if (result.remaining_messages === 0) {
      setChatError("Send limit reached, create a new chat to continue");
    }

  } catch (error) {
    if (activeTokenRef.current !== token) return;

    // remove the temporary message if django rejected the request
    if (tempMessageId !== null) {
      const failedMessageId = tempMessageId;

      setMessageText(previous =>
        previous.filter(msg => msg.id !== failedMessageId)
      );
    }

    console.error("Failed to send message:", error);

    if (error instanceof ChatApiError && error.status === 429) {
      setLimitMessage();
    } else if (error instanceof ChatApiError && error.status === 401) {
      logout();
    } else {
      setChatError(describeChatError(error, "Failed to send message"));
    }

  } finally {
    requestPendingRef.current = false;

    if (activeTokenRef.current === token) {
      setIsSending(false);
    }
  }
}

  async function startNewChat() {
    if (!accessToken || isSending || isLoadingChat) return;
    const token = accessToken;
    setIsLoadingChat(true);
    setChatError("");

    try {
      const chat = await createChat(token);
      if (activeTokenRef.current !== token) return;
      if (chats.length >= 3) return;
      // Add the new chat to the sidebar array
      setChats(previous => [chat, ...previous]);

      // Select the newly created chat
      setCurrentChatId(chat.id);

      // Clear previous chat messages and input
      setMessageText([]);
      setTempMessageText("");

      // Unlock messaging for the new chat
      setSendLimit(false);
    } catch (error) {
      if (activeTokenRef.current !== token) return;
      console.error("Failed to create chat:", error);
      if (error instanceof ChatApiError && error.status === 401) logout();
      else setChatError(describeChatError(error, "Unable to create conversation"));
    } finally {
      if (activeTokenRef.current === token) setIsLoadingChat(false);
    }
  }

  async function openChat(chatId: number) {
    if (!accessToken || isSending || isLoadingChat) return;
    const token = accessToken;
    setIsLoadingChat(true);
    setChatError("");

    try {
      const chat = await getChat(token, chatId);
      if (activeTokenRef.current !== token) return;

      // Select this conversation
      setCurrentChatId(chat.id);

      // Load its messages into the existing array
      setMessageText(chat.messages.map(toClientMessage));

      // Apply Django's message limit
      setSendLimit(chat.remaining_messages === 0);
      setTempMessageText("");
    } catch (error) {
      if (activeTokenRef.current !== token) return;
      console.error("Failed to load chat:", error);
      if (error instanceof ChatApiError && error.status === 401) logout();
      else setChatError(describeChatError(error, "Unable to load conversation"));
    } finally {
      if (activeTokenRef.current === token) setIsLoadingChat(false);
    }
  }
  function getInitials(username: string): string {
    return username
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
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
            className="new_chat_button"
            onClick={startNewChat}
            disabled={!accessToken || isSending || isLoadingChat}
          >
            New Chat
          </button>
          <div className="left_chat_box_scrolling">
            {chats.map(chat => (
              <button
                key={chat.id}
                type="button"
                className={`left_box_sizing${chat.id === currentChatId ? " active" : ""}`}
                onClick={() => {
                  setActiveChatId(chat.id);
                  openChat(chat.id);
                }}
                disabled={isSending || isLoadingChat}
              >
                {chat.name}
              </button>
            ))}
          </div>

      <div className="left_linked_playlists">
        <div className="left_playlist_title">Your linked service playlists:</div>
        <div className="left_linked_playlists_scrolling">
          {loading && <div>Loading…</div>}

          {!loading && !linked && (
            <p>Connect Spotify To See Linked Playlists</p>
          )}

          {!loading && linked && linkedPlaylists.length === 0 && (
            <div>No playlists found.</div>
          )}

          {!loading && linked && linkedPlaylists.map((p) => (
            <button
              key={p.id}
              className={`left_box_sizing left_playlist_box ${
                selectedSpotifyPlaylistId === p.id ? "selected" : ""}`}
            >
              {p.image && <img className="left_playlist_img" src={p.image} alt="" />}
              <div className="left_playlist_info">
                <div className="left_playlist_name">{p.name}</div>
                <div className="left_playlist_count">{p.track_count ?? "?"} tracks</div>
              </div>
            </button>
          ))}
        </div>
      </div>


        </div>
        <div className="left_profile_container">
          <div className="left_profile_icon_bg"><div className="left_profile_icon_text">{username? getInitials(username): "JD"}</div></div>
          <div className="left_profile_info_box">
            <div className="left_profile_name">{username? username: "John Doe"}</div>
            <div className="left_profile_service_state">{spotifyConnected ? "Spotify Connected" : "Spotify Not Connected"}</div>
          </div>
        </div>
      </div>

      {/* Main chat area. */}
      <div className="center_box">
        <div className="center_title_bar">
          <div className="center_playlist_title"> {"Chat Title"} 
            <div className="center_playlist_attached_title">No playlist Attached</div>
          </div>

          <div className="center_playlist_privacy_title">Private</div>
          <div className="delete_chat_button_box" title="Delete current chat">
            <button className="delete_chat_button" onClick={() => {if(currentChatId !== null){handleDeleteChat(currentChatId)}} }>
              <Image src="bin.svg" alt="alt" width={30} height={30}/>
            </button>
          </div>
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
        {/* show errors / login instructions outside the scrolling chat messages */}
        {(chatError || isSending || isLoadingChat || !accessToken || currentChatId === null || sendLimit) && (
          <div role={chatError ? "alert" : "status"} aria-live="polite"
            style={{ padding: "0.25rem 1rem", fontSize: "0.85rem" }}>
            {chatError || (isSending ? "Generating response..." :
              isLoadingChat ? "Loading conversation..." :
              !accessToken ? "Log in using the profile button to send messages." :
              sendLimit ? "Send limit reached, create a new chat to continue." :
              "Send a message to create a conversation, or select a saved chat.")}
          </div>
        )}
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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void saveChatInput();
            }
          }}
          required
          ></input>
          {/* send the message to django, prevent duplicates while waiting for a response */}
          <button
            type="button"
            className="center_chats_send_message"
            onClick={saveChatInput}
            disabled={sendLimit || isSending || isLoadingChat}
            aria-label={isSending ? "Sending message" : "Send message"}
          >
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

    {/* playlist demo data is local only until the Django endpoints are ready */}
    {PLAYLIST_DEMO_MODE && (
      <div className="right_playlist_status">Demo playlist - changes reset on refresh</div>
    )}
    {playlistError && (
      <div className="right_playlist_status" role="alert">{playlistError}</div>
    )}
    {isLoadingPlaylists && (
      <div className="right_playlist_status" role="status">Loading playlists...</div>
    )}

    <div className="right_all_playlists_container">
      {/* playlists goes here - create a box for each playlist Django returns */}
      {!isLoadingPlaylists && playlists.length === 0 && (
        <div className="right_playlist_status">
          {!PLAYLIST_DEMO_MODE && !accessToken
            ? "Log in to view your playlists."
            : "No playlists to display."}
        </div>
      )}

      {playlists.map(playlist => (
        <div className="right_playlist_layout" key={playlist.id}>
          <div className="right_playlist_title_box">
            <span className="right_playlist_title_text" title={playlist.name}>
              {playlist.name}
            </span>
            <button
              className="right_playlist_delete_button"
              type="button"
              onClick={() => void removePlaylist(playlist)}
              disabled={deletingPlaylistId !== null}
              aria-label={`Delete playlist ${playlist.name}`}
            >
              {deletingPlaylistId === playlist.id ? "Deleting..." : "Delete"}
            </button>
              <button
              className="right_playlist_export_button"
              type="button"
              onClick={() => void sendExportPlaylist(playlist)}
              disabled={deletingPlaylistId !== null}
              aria-label={`export playlist ${playlist.name}`}
            >
              {deletingPlaylistId === playlist.id ? "Export..." : "Export"}
            </button>
          </div>
          <div className="right_playlist_song_list">
            {/* display each song using the existing title / artist / length classes */}
            {playlist.tracks.map((track, index) => (
              <div className="right_playlist_song_box" key={`${track.id}-${index}`}>
                <div className="right_playlist_song_title" title={track.title}>{track.title}</div>
                <div className="right_playlist_song_artist" title={track.artists}>{track.artists}</div>
                <div className="right_playlist_song_length">{formatPlaylistDuration(track.duration_s)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

  </div>
</div>
)}