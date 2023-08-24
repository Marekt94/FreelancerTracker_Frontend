import React, {useState} from "react";
import "./Main.css";
import {months} from "./Dictionaries";
import "./SalaryAPICLient";
import SalaryAPIClient from "./SalaryAPICLient";
import {useEffect} from "react";
import {FETCH_COMM} from "./Constants";
import { useParams, useNavigate, generatePath } from "react-router-dom";
import PATHS from "./SalaryClientURL";

function SalaryList() {
    const year = useParams().year;  
    const [salaries, setSalaries] = useState("");
    const [id, setID] = useState(null);
    const [viewID, setViewID] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
      let ignore = false;
      SalaryAPIClient.GetSalaries(year, (obj) => {
        if (!ignore){
          console.log(FETCH_COMM, "GetSalaries")
          updateSalaries(obj);
        }
      })
      return () => {ignore = true}
    },[year]);

    function onEditClick(event){
        setViewID(1);
        setID(event.target.getAttribute("id"));
        navigate(generatePath(PATHS.salaryPath, {year: year, id: event.target.getAttribute("id")}));
    }   

    function updateSalaries(json){
        const salary = json.sort((x, y) => x.miesiac > y.miesiac ? 1 : -1); 
        setSalaries(salary.map((obj) =>
            <ul id={obj.id} onClick={onEditClick} key={obj.id}>{months.find(element => element.id === obj.miesiac).value}: stawka godzinowa - {obj.stawka}, netto = {obj.netto}</ul>
        ))
    } 
    
    return(
        <>    
          <ol>{salaries}</ol>       
        </>
    )
}

export default SalaryList;