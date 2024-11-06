export function useFetchInternal() {
  async function internalFetch(URL, requestOptions) {
    try {
      const opt = {
        ...requestOptions,
        credentials: "include",
        mode: "cors",
      };
      const res = await fetch(URL, opt);
      if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        return data;
      } else {
        alert(`Code ${res.status}: ${res.statusText}`);
      }
    } catch (e) {
      alert(e);
    }
  }

  return { internalFetch };
}
