import YearSelector, { DEF_YEAR } from "./YearSelector";
import { useGlobalContext } from "../GlobalContext";
import { useSearchParams } from "react-router-dom";

export default function YearSelectorWithContext() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { year, setYear } = useGlobalContext();

  function updateYear(year) {
    setYear(year);
    const isParamPresent = searchParams.get("year");
    isParamPresent && setSearchParams({ year: year }, { replace: true });
  }

  return <YearSelector currentYear={year} onYearChange={updateYear}></YearSelector>;
}
