import React, { useEffect, useState } from "react";
import "../css/index.css";
import { MONTHS } from "../Const";
import { NavLink, useNavigate } from "react-router-dom";
import { useSalary } from "../useSalary";
import { BACKEND_PATHS } from "../Endpoints";
import Loading from "./Loading";
import { useGlobalContext } from "../GlobalContext";
import YearSelectorWithContext from "./YearSelectorWithContext";

function SalaryList({ children }) {
  const { isLoading, setError, year } = useGlobalContext();
  const [salaries, setSalaries] = useState(undefined);
  const navigate = useNavigate();
  const { getSalaries } = useSalary(setError);

  useEffect(() => {
    console.log("useEffect in Salaries");
    async function fetchSalaries() {
      const params = [{ name: "year", value: year }];
      const temp = await getSalaries(params);
      setSalaries(temp);
    }

    fetchSalaries();
  }, [year, getSalaries]);

  function onEditClick(event) {
    const id = event.target.getAttribute("id");
    id ? navigate(`${BACKEND_PATHS.salaryPath}/${id}`) : navigate(`${BACKEND_PATHS.salaryPath}`);
  }

  function createSalaryList(json) {
    let salary = json.sort((x, y) => x.miesiac - y.miesiac);
    return salary.map((obj) => (
      <li>
        <NavLink className="navlink" to={`${BACKEND_PATHS.salaryPath}/${obj.id}`}>
          {MONTHS.find((element) => element.id === obj.miesiac).value}: stawka godzinowa - {obj.stawka}, netto ={" "}
          {obj.netto}        
        </NavLink>
      </li>
    ));
  }

  function updateSalaries(json) {
    console.log(`json: ${json}`);
    return json ? createSalaryList(json) : <></>;
  }

  return !isLoading ? (
    <>
      <YearSelectorWithContext/>
      {children}
      <ol>{updateSalaries(salaries)}</ol>
    </>
  ) : (
    <Loading />
  );
}

export default SalaryList;
