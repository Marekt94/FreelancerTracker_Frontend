import { createContext, useCallback, useContext, useReducer } from "react";
import Error from "./components/Error";
import { DEF_ERROR } from "./Const";
import "./css/index.css";
import { DEF_YEAR } from "./components/YearSelector";

const GlobalContext = createContext();

const ACTION_TYPE = {
  setIsLoading: "setIsLoading",
  setError: "setError",
  setYear: "setYear,",
};

function reduce(state, action) {
  switch (action.type) {
    case ACTION_TYPE.setIsLoading: {
      return { ...state, isLoading: action.payload };
    }
    case ACTION_TYPE.setError: {
      return { ...state, error: action.payload };
    }
    case ACTION_TYPE.setYear: {
      return { ...state, year: action.payload };
    }
    default:
      return state;
  }
}

function GlobalContextProvider({ children }) {
  const yearTemp = DEF_YEAR;
  const [{ isLoading, error, year }, dispatch] = useReducer(reduce, {
    isLoading: false,
    error: DEF_ERROR,
    year: yearTemp,
  });

  const setLoadingState = useCallback((state) => {
    dispatch({ type: ACTION_TYPE.setIsLoading, payload: state });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTION_TYPE.setError, payload: error });
  }, []);

  function setYear(year) {
    dispatch({ type: ACTION_TYPE.setYear, payload: year });
  }

  return (
    <GlobalContext.Provider value={{ isLoading, year, setLoadingState, setError, setYear }}>
      {!error.code ? children : <Error className="content">{error}</Error>}
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
