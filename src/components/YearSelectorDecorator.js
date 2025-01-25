import YearSelector from "./YearSelector";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useGlobalContext } from "../GlobalContext";

export function useYear() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { year, setYear: setYearContext } = useGlobalContext();

  useEffect(() => {
    searchParams.get("year") || setSearchParams({ year }, { replace: true });
  }, [searchParams, setSearchParams, year]);

  function setYear(year) {
    setSearchParams({ year }, { replace: true });
    setYearContext(year);
  }

  return { year, setYear };
}

export default function YearSelectorWithContext() {
  const { year, setYear } = useYear();

  return <YearSelector currentYear={year} onYearChange={setYear}></YearSelector>;
}
