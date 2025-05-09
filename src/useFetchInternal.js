import { UNHANDLED_ERROR_CODE } from "./Const.js";
export const SERVER_ADRESS = process.env.REACT_APP_BACKEND_ADDRESS;

function createQueryString(paramsList) {
  return "?" + paramsList.map((param) => `${param.name}=${param.value}`).join("&");
}

export function generateURL(serverAdress, endpoint, params = "") {
  const lServerAdress = serverAdress.endsWith("/") ? serverAdress : serverAdress + "/";
  const lEndpoint = endpoint.startsWith("/") ? endpoint.slice(1, endpoint.length) : endpoint;
  const lURL = lServerAdress + lEndpoint + (params ? createQueryString(params) : "");
  console.log("URL: " + lURL);
  return lURL;
}

export default async function internalFetch(URL, requestOptions, setError) {
  try {
    const opt = {
      ...requestOptions,
      credentials: "include",
      mode: "cors",
    };
    const res = await fetch(URL, opt);
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
      const error = data.erro || res.statusText;
      setError ? setError({ code: res.status, statusText: error }) : alert(res);
    }
  } catch (e) {
    setError ? setError({ code: UNHANDLED_ERROR_CODE, statusText: e.message }) : alert(e);
  }
}
