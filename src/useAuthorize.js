import internalFetch, { SERVER_ADRESS, generateURL } from "./useFetchInternal";
import { BACKEND_PATHS } from "./Endpoints";
import { useGlobalContext } from "./GlobalContext";

export function useAuthorize(setError) {
  const { setLoadingState } = useGlobalContext();

  async function internalAuthFetch(URL, requestOptions) {
    setLoadingState(true);
    const dat = await internalFetch(URL, requestOptions, setError);
    setLoadingState(false);
    return dat;
  }

  async function authorize(login, password) {
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.login);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username: login, password: password }),
    };

    const data = await internalAuthFetch(URL, requestOptions);
    return data;
  }

  async function logout() {
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.logout);

    const requestOptions = {
      method: "DELETE",
    };

    const data = await internalAuthFetch(URL, requestOptions);
    return data;
  }

  return { authorize, logout };
}
