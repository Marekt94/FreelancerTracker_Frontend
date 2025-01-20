import YearSelector, { DEF_YEAR } from "./YearSelector";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function useYear() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    searchParams.get("year") || setSearchParams({ year: DEF_YEAR }, { replace: true });
  }, [searchParams, setSearchParams]);

  function setYear(year) {
    setSearchParams({ year }, { replace: true });
  }

  return { year: Number(searchParams.get("year")) || DEF_YEAR, setYear };
}

export default function YearSelectorWithContext() {
  const { year, setYear } = useYear();

  return <YearSelector currentYear={year} onYearChange={setYear}></YearSelector>;
}
