import React, { useEffect, useState } from "react";
import "../css/index.css";
import { MONTHS } from "../Const";
import { NavLink } from "react-router-dom";
import { useSalary } from "../useSalary";
import { BACKEND_PATHS } from "../Endpoints";
import { useGlobalContext } from "../GlobalContext";
import YearSelectorWithContext from "./YearSelectorWithContext";

function SalaryList({ children }) {
  const { setError, year } = useGlobalContext();
  const [salaries, setSalaries] = useState(undefined);
  const { getSalaries } = useSalary(setError);

  useEffect(() => {
    async function fetchSalaries() {
      const params = [{ name: "year", value: year }];
      const temp = await getSalaries(params);
      setSalaries(temp);
    }
    fetchSalaries();
  }, [year, getSalaries]);

  function createSalaryList(json) {
    const salary = json.sort((x, y) => x.miesiac - y.miesiac);
    return salary.map((obj) => {
      let month = MONTHS.find((element) => element.id === obj.miesiac);
      return (
        <li key={obj.id}>
          <NavLink className="navlink" to={`${BACKEND_PATHS.salaryPath}/${obj.id}`}>
            {month ? `${month.value}: ` : ""}stawka godzinowa - {obj.stawka}, netto = {obj.netto}
          </NavLink>
        </li>
      );
    });
  }

  function updateSalaries(json) {
    return json ? createSalaryList(json) : <></>;
  }

  return (
    <>
      <YearSelectorWithContext />
      {children}
      <ol>{updateSalaries(salaries)}</ol>
    </>
  );
}

export default SalaryList;
