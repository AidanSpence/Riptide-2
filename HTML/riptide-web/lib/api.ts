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

/**
 * Does a basic fetch, returns data.
 *
 * @param url_endpoint - The api endpoint. "/api/chats".
 * @returns retrieved data
 * @throws {new Error} HTTP error.
 */
export async function fetchData(url_endpoint:string) {
  try {
    const response = await fetch(API_URL + url_endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data
  } catch (error) {
    console.error('Fetch failed:', error);
  }
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

// export async function register(
//   username: string,
//   password: string,
// ): Promise<RegisterResponse> {
//   const toSend = { username, password };

//   const response = await fetch(API_URL + REGISTER_ENDPOINT, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(toSend)
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     console.log("Registration errors:", errorData);
//     throw new Error(`Registration failed: ${response.status}`);
//   }

//   const data: RegisterResponse = await response.json();

//   return data;
// }
