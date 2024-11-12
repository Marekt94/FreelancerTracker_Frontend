export default function useFetchInternal(changeLoadingState) {
  function updateFetchStatus(state) {
    changeLoadingState && changeLoadingState(state);
  }
  function createQueryString(paramsList) {
    return (
      "?" + paramsList.map((param) => `${param.name}=${param.value}`).join("&")
    );
  }

  function generateURL(serverAdress, endpoint, params = "") {
    const lServerAdress = serverAdress.endsWith("/")
      ? serverAdress
      : serverAdress + "/";
    const lEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1, endpoint.length)
      : endpoint;
    const lURL =
      lServerAdress + lEndpoint + (params ? createQueryString(params) : "");
    console.log("URL: " + lURL);
    return lURL;
  }

  async function internalFetch(URL, requestOptions) {
    updateFetchStatus(true);
    try {
      const opt = {
        ...requestOptions,
        credentials: "include",
        mode: "cors",
      };
      console.log(opt);
      const res = await fetch(URL, opt);
      if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        updateFetchStatus(false);
        return data;
      } else {
        alert(`Code ${res.status}: ${res.statusText}`);
        updateFetchStatus(false);
      }
    } catch (e) {
      alert(e);
      updateFetchStatus(false);
    }
  }

  return { internalFetch, generateURL };
}
