const API_URL = 'http://127.0.0.1:9000';
const LOGIN_ENDPOINT = '/api/login'
const REGISTER_ENDPOINT = '/api/register'

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
export async function login( email:string, password:string) {
  try {
    const toSend = {email, password}
    const response = await fetch(API_URL + LOGIN_ENDPOINT,
      {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
      }
    );

    if (!response.ok) {
      console.log('response.status:', response.status)
    return response.status
    }

    const data = await response.json();
    console.log(data);
    return data
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

/** Change the url endpoint to a constant permenant one later */
export async function register(email:string, password:string, password_confirm:string) {
  try {
    const toSend = {email, password, password_confirm}
    const response = await fetch(API_URL + REGISTER_ENDPOINT,
      {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
      }
    );

    if (!response.ok) {
      console.log('response.status:', response.status)
    return response.status
    }

    const data = await response.json();
    console.log(data);
    return data
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}