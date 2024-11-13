import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  function setLoadingState(state) {
    setIsLoading(state);
  }

  return (
    <GlobalContext.Provider value={{ isLoading, setLoadingState }}>
      {children}
    </GlobalContext.Provider>
  );
}

function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("GlobalContext is outside provider");
  }
  return context;
}

export { GlobalContextProvider, useGlobalContext };
