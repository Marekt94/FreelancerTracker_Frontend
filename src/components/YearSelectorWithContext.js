import YearSelector, { DEF_YEAR } from "./YearSelector";
import { useGlobalContext } from "../GlobalContext";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function YearSelectorWithContext() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(()=>{
    searchParams.get("year") || setSearchParams({year: DEF_YEAR}, {replace: true})
  }, [searchParams, setSearchParams]);

  function updateYear(year) {
    const yearTemp = year || DEF_YEAR;
    setSearchParams({ year: yearTemp }, { replace: true });
  }

  return <YearSelector currentYear={Number(searchParams.get("year")) || DEF_YEAR} onYearChange={updateYear}></YearSelector>;
}
