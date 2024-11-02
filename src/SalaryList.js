import React, { useEffect, useState } from "react";
import "./index.css";
import { MONTHS } from "./Dictionaries";
import "./SalaryAPICLient";
import { useNavigate, generatePath } from "react-router-dom";
import PATHS from "./SalaryClientURL";
import SalaryAPIClient from "./SalaryAPICLient";
import { useSalary } from "./useSalary";

function SalaryList(props) {
  const year = props.year;
  const [salaries, setSalaries] = useState(undefined);
  const navigate = useNavigate();
  const {getSalaries} = useSalary();

  useEffect(() => {
    console.log("useEffect in Salaries");
    async function fetchSalaries(){
      const params = 
      [
        {name: 'year',
         value: year
        }
      ]; 
      const temp = await getSalaries(params);
      setSalaries(temp);
    }
    // SalaryAPIClient.GetSalaries(year, (obj) => {
    //   console.log(obj);
    //   setSalaries(obj);
    // });
    fetchSalaries();
  }, [year]);

  function onEditClick(event) {
    navigate(
      generatePath(PATHS.salaryPath, {
        year: year,
        id: event.target.getAttribute("id"),
      })
    );
  }

  function createSalaryList(json) {
    let salary = json.sort((x, y) => x.miesiac - y.miesiac);
    return salary.map((obj) => (
      <ul id={obj.id} onClick={onEditClick} key={obj.id}>
        {MONTHS.find((element) => element.id === obj.miesiac).value}: stawka
        godzinowa - {obj.stawka}, netto = {obj.netto}
      </ul>
    ));
  }

  function updateSalaries(json) {
    console.log(`json: ${json}`);
    return json ? createSalaryList(json) : <></>;
  }

  return (
    <>
      {props.children}
      <ol>{updateSalaries(salaries)}</ol>
    </>
  );
}

export default SalaryList;
