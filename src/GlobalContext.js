import { createContext, useContext, useEffect, useReducer, useState } from "react";
import Error from "./Error";
import { DEF_ERROR } from "./Const";
import "./index.css";
import { YEARS } from "./YearSelector";
import { act } from "react";
import { useSearchParams } from "react-router-dom";


const GlobalContext = createContext();

const ACTION_TYPE = {
  setIsLoading: "setIsLoading",
  setError: "setError",
  setYear: "setYear,"
}

function reduce(state, action){
  switch (action.type){
    case ACTION_TYPE.setIsLoading:{
      return {...state, isLoading: action.payload};
    }
    case ACTION_TYPE.setError:{
      return {...state, error: action.payload};
    }
    case ACTION_TYPE.setYear:{
      return {...state, year: action.payload};
    }

  }  
}

function GlobalContextProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const yearTemp = searchParams.get("year") || YEARS[1].year;
  const [{isLoading, error, year}, dispatch] = useReducer(reduce, {isLoading: false, error: DEF_ERROR, year: yearTemp})

  useEffect(()=>{
    let yearTemp = year || YEARS[1].year;
    setSearchParams({"year": yearTemp})
  }, [year])

  function setLoadingState(state) {
    dispatch({type: ACTION_TYPE.setIsLoading, payload: state})
  }

  function setError(error){
    dispatch({type: ACTION_TYPE.setError, payload: error})
  }

  function setYear(year){
    dispatch({type: ACTION_TYPE.setYear, payload: year})
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
