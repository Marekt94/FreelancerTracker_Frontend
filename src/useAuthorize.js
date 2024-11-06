import { SERVER_ADRESS } from "./Constants";
import { useFetchInternal } from "./useFetchInternal";

export function useAuthorize() {
  const { internalFetch } = useFetchInternal();

  async function authorize(login, password) {
    console.log(`login ${login} haslo ${password}`);
    const URL = SERVER_ADRESS + "login";

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username: login, password: password }),
    };

    const data = await internalFetch(URL, requestOptions);
    return data;
  }

  async function logout() {
    const URL = SERVER_ADRESS + "logout";

    const requestOptions = {
      method: "DELETE",
    };

    const data = await internalFetch(URL, requestOptions);
    return data;
  }

  return { authorize, logout };
}
