const API_URL = 'http://127.0.0.1:9000';


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
