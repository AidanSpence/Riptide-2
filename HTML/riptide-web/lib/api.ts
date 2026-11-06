// used by the static frontend at build time; localhost remains the dev fallback
const API_URL = 'http://127.0.0.1:9000';
const LOGIN_ENDPOINT = '/api/login/'
const REGISTER_ENDPOINT = '/api/signup/'

type LoginResponse = {
  access: string;
  refresh: string;
};
type RegisterResponse = {
  message: string;
};


export type ChatMessageData = {
  id: number;
  text: string;
  sender: "user" | "system";
  created_at: string;
};

export type ChatSummary = {
  id: number;
  name: string;
  created_at: string;
};

export type ChatDetail = ChatSummary & {
  messages: ChatMessageData[];
  remaining_messages: number;
};

// Django can optionally return a generated playlist with a chat response
export type PlaylistTrackData = {
  id: number;
  title: string;
  artists: string;
  duration_s: number;
  spotify_track_id?: string | null;
};

export type PlaylistData = {
  // optional for a generated playlist that has not been saved to postgres yet
  id?: number;
  message: string,
  chat_name : string,
  name:string,
  tracks: PlaylistTrackData[];
};

export type SendMessageResponse = {
  message: ChatMessageData;
  remaining_messages: number;
  playlist: PlaylistData;
};


export type UserData = {
  id: string;
  username: string;
};


type SpotifyLoginResponse = {
  url: string;
};



// use the provided JSON while the Django playlist endpoints are unfinished
// set NEXT_PUBLIC_PLAYLIST_MODE=api before building to enable real API requests
export const PLAYLIST_DEMO_MODE = false
// process.env.NEXT_PUBLIC_PLAYLIST_MODE !== "api";

export async function getCurrentUser(accessToken: string): Promise<UserData> {
  return authRequest<UserData>(
    "/api/me/",
    accessToken
  );
}



export async function spotifyLogin(accessToken: string): Promise<void> {
  const data = await authRequest<SpotifyLoginResponse>(
    "/api/spotify-login/",
    accessToken
  );

  window.location.assign(data.url);
}



export function isPlaylistData(value: unknown): value is PlaylistData {
  if (!value || typeof value !== "object") return false;
  const playlist = value as Partial<PlaylistData>;
  return (playlist.id === undefined || (typeof playlist.id === "number" && Number.isInteger(playlist.id))) &&
    typeof playlist.name === "string" &&
    Array.isArray(playlist.tracks) &&
    playlist.tracks.every(track =>
      !!track && typeof track === "object" &&
      typeof track.id === "number" &&
      typeof track.title === "string" &&
      typeof track.artists === "string" &&
      typeof track.duration_s === "number"
    );
}


export class ChatApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

async function authRequest<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {

  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${accessToken}`);

  if (options.body != null) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let message = `HTTP ${response.status}`;

    if (data && typeof data === "object") {
      const errorData = data as {
        error?: string;
        detail?: string;
      };

      message = errorData.error ?? errorData.detail ?? message;
    }

    throw new ChatApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return data as T;
}


// List the user's conversations
export async function listChats(accessToken: string) {
  const result = await authRequest<{ chats: ChatSummary[] } | ChatSummary[]>(
    "/api/chats/",
    accessToken
  );

  // accepts either a wrapped response or a plain list from django
  const chats = Array.isArray(result) ? result : result?.chats;
  if (!Array.isArray(chats)) {
    throw new Error("Django returned an unexpected chat list. Expected { chats: [...] }.");
  }
  return { chats };
}

// Delete a conversation
export async function deleteChat(
  accessToken: string,
  chatId: number
): Promise<void> {
  await authRequest<void>(
    `/api/chats/${chatId}/`,
    accessToken,
    {
      method: "DELETE"
    }
  );
}


// Create a conversation
export async function createChat(
  accessToken: string,
  name: string = "Awaiting Name"
) {
  const chat = await authRequest<ChatSummary>(
    "/api/chats/",
    accessToken,
    {
      method: "POST",
      body: JSON.stringify({ name })
    }
  );

  // the frontend needs the database id to submit messages to this chat
  if (!chat || typeof chat.id !== "number") {
    throw new Error("Django created a chat but did not return a numeric chat id.");
  }

  return chat;
}


// Load a conversation
export async function getChat(
  accessToken: string,
  chatId: number
) {
  const chat = await authRequest<ChatDetail>(
    `/api/chats/${chatId}/`,
    accessToken
  );

  if (!chat || !Array.isArray(chat.messages) ||
      typeof chat.remaining_messages !== "number") {
    throw new Error("Django returned an unexpected chat detail. Expected 'messages' and 'remaining_messages'.");
  }
  return chat;
}


// existing conversation
export async function sendChatMessage(
  accessToken: string,
  chatId: number,
  text: string
) {
  const result = await authRequest<SendMessageResponse>(
    `/api/chats/${chatId}/messages/`,
    accessToken,
    {
      method: "POST",
      body: JSON.stringify({ text })
    }
  );

  // catch unexpected API response shapes rather than failing silently in React
  if (!result || !result.message || typeof result.message.text !== "string" ||
      typeof result.message.id !== "number" ||
      typeof result.remaining_messages !== "number") {
    throw new Error("Django returned an unexpected message response. Expected 'message' and 'remaining_messages'.");
  }

  return result;
}


export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const toSend = { username, password };

  const response = await fetch(API_URL + LOGIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toSend)
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const data: LoginResponse = await response.json();

  return data;
}
export async function register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  const toSend = { username, password };

  const response = await fetch(API_URL + REGISTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toSend)
  });

  if (!response.ok) {
    // Django may return JSON validation errors, or HTML for a server error
    const errorData: unknown = await response.json().catch(() => null);
    let message = `Registration failed: ${response.status}`;
    if (errorData && typeof errorData === "object") {
      const parts = Object.entries(errorData).flatMap(([field, value]) => {
        if (Array.isArray(value)) return value.map(item => `${field}: ${String(item)}`);
        if (typeof value === "string") return [`${field}: ${value}`];
        return [];
      });
      if (parts.length > 0) message = parts.join("; ");
    }
    throw new Error(message);
  }

  const data: RegisterResponse = await response.json();
  return data;
}



// Retrieve saved playlists for the logged-in user
// Django should return { playlists: [...] } (or a plain playlist array)
export async function listPlaylists(accessToken: string): Promise<PlaylistData[]> {
  const result = await authRequest<unknown>("/api/playlists/", accessToken);
  let playlists: unknown;

  if (Array.isArray(result)) {
    playlists = result;
  } else if (result && typeof result === "object" && "playlists" in result) {
    playlists = (result as { playlists: unknown }).playlists;
  } else {
    playlists = [result]; // also accepts a single playlist object
  }

  if (!Array.isArray(playlists) || !playlists.every(isPlaylistData)) {
    throw new Error("Django returned invalid playlist data. Check title, tracks, artists and duration_s.");
  }

  // saved playlists need a database id so DELETE can identify the correct one
  if (playlists.some(playlist => typeof playlist.id !== "number" || playlist.id <= 0)) {
    throw new Error("Saved playlists returned by Django need a positive numeric playlist id.");
  }

  return playlists;
}


// Delete one saved playlist; Django should return HTTP 204 (no body)
export async function deletePlaylist(accessToken: string, playlistId: number): Promise<void> {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/api/playlists/${playlistId}/`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    let message = `HTTP ${response.status}`;
    if (data && typeof data === "object") {
      const error = data as { error?: string; detail?: string };
      message = error.error ?? error.detail ?? message;
    }
    throw new ChatApiError(response.status, message);
  }
}
export async function exportPlaylist(accessToken: string, playlistId: number): Promise<void> {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/api/spotify/export/${playlistId}/`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      }
    }
  );

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    let message = `HTTP ${response.status}`;
    if (data && typeof data === "object") {
      const error = data as { error?: string; detail?: string };
      message = error.error ?? error.detail ?? message;
    }
    throw new ChatApiError(response.status, message);
  }
}
