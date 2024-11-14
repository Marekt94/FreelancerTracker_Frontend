import { createContext, useContext, useState } from "react";
import Error from "./Error";
import { DEF_ERROR } from "./Const";

const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(DEF_ERROR);

  function setLoadingState(state) {
    setIsLoading(state);
  }

  return (
    //TODO - wyciągnąć obsługę errora wyżej
    <GlobalContext.Provider value={{ isLoading, setLoadingState, setError }}>
      {!error.code ? children : <Error>{error}</Error>}
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
