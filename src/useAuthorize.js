import { SERVER_ADRESS } from "./Constants";
import useFetchInternal from "./useFetchInternal";
import { BACKEND_PATHS } from "./SalaryClientURL";

export function useAuthorize(changeLoading) {
  const { internalFetch, generateURL } = useFetchInternal(changeLoading);

  async function authorize(login, password) {
    console.log(`login ${login} haslo ${password}`);
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.login);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username: login, password: password }),
    };

    const data = await internalFetch(URL, requestOptions);
    return data;
  }

  async function logout() {
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.logout);

    const requestOptions = {
      method: "DELETE",
    };

    const data = await internalFetch(URL, requestOptions);
    return data;
  }

  return { authorize, logout };
}
