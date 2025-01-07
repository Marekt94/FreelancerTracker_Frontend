import YearSelector, { DEF_YEAR } from "./YearSelector";
import { useGlobalContext } from "../GlobalContext";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect } from "react";

export default function YearSelectorWithContext() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { year, setYear } = useGlobalContext();

  const stableSetSearchParams = useCallback(
    (params) => {
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const currentYearInParams = searchParams.get("year");
    const yearToSet = year || DEF_YEAR;

    if (currentYearInParams !== yearToSet) {
      stableSetSearchParams({ year: yearToSet });
    }
  }, [year, searchParams, stableSetSearchParams]);

  return <YearSelector currentYear={year} onYearChange={setYear}></YearSelector>;
}
