import { UNHANDLED_ERROR_CODE } from "./Const.js";
export const SERVER_ADRESS = process.env.REACT_APP_BACKEND_ADDRESS;

export default function useFetchInternal(setError) {
  function createQueryString(paramsList) {
    return "?" + paramsList.map((param) => `${param.name}=${param.value}`).join("&");
  }

  function generateURL(serverAdress, endpoint, params = "") {
    const lServerAdress = serverAdress.endsWith("/") ? serverAdress : serverAdress + "/";
    const lEndpoint = endpoint.startsWith("/") ? endpoint.slice(1, endpoint.length) : endpoint;
    const lURL = lServerAdress + lEndpoint + (params ? createQueryString(params) : "");
    console.log("URL: " + lURL);
    return lURL;
  }

  async function internalFetch(URL, requestOptions) {
    try {
      const opt = {
        ...requestOptions,
        credentials: "include",
        // mode: "cors",
      };
      console.log(opt);
      const res = await fetch(URL, opt);
      if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();

        return data;
      } else {
        setError ? setError({ code: res.status, statusText: res.statusText }) : alert(res);
      }
    } catch (e) {
      setError ? setError({ code: UNHANDLED_ERROR_CODE, statusText: e.message }) : alert(e);
    }
  }

  return { internalFetch, generateURL };
}
