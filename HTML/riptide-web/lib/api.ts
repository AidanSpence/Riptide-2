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

export type SendMessageResponse = {
  message: ChatMessageData;
  remaining_messages: number;
};


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

  if (data === null) {
    throw new Error("API returned no valid JSON");
  }

  return data as T;
}


// List the user's conversations
export function listChats(accessToken: string) {
  return authRequest<{ chats: ChatSummary[] }>(
    "/api/chats/",
    accessToken
  );
}


// Create a conversation
export function createChat(
  accessToken: string,
  name: string = "New chat"
) {
  return authRequest<ChatSummary>(
    "/api/chats/",
    accessToken,
    {
      method: "POST",
      body: JSON.stringify({ name })
    }
  );
}


// Load a conversation
export function getChat(
  accessToken: string,
  chatId: number
) {
  return authRequest<ChatDetail>(
    `/api/chats/${chatId}/`,
    accessToken
  );
}


// existing conversation
export function sendChatMessage(
  accessToken: string,
  chatId: number,
  text: string
) {
  return authRequest<SendMessageResponse>(
    `/api/chats/${chatId}/messages/`,
    accessToken,
    {
      method: "POST",
      body: JSON.stringify({ text })
    }
  );
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
    const errorData = await response.json();
    console.log("Registration errors:", errorData);
    throw new Error(`Registration failed: ${response.status}`);
  }

  // const data: RegisterResponse = await response.json();
  console.log("HTTP status:", response.status);
  console.log("Content-Type:", response.headers.get("content-type"));

  const body = await response.text();
  console.log("Response:", body.substring(0, 500));

  const data: RegisterResponse = JSON.parse(body);
  return data;
}

