import React, {useState} from "react";
import "./Main.css";
import {months} from "./Dictionaries";
import "./SalaryAPICLient";
import SalaryAPIClient from "./SalaryAPICLient";
import TakeSalary from "./Salary";

function SalaryList(props) {
    const [salaries, setSalaries] = useState("");
    const [id, setID] = useState(null);
    const year = props.year;
    const [viewID, setViewID] = useState(0);

    function onEditClick(event){
        setViewID(1);
        setID(event.target.getAttribute("id"));
    }   

    function updateSalaries(json){
        setSalaries(json.map((salary) =>
            <li key={salary.id}>{months.find(element => element.id === salary.miesiac).value}: stawka godzinowa - {salary.stawka}, netto = {salary.netto}<button id={salary.id} onClick={onEditClick}>Edytuj</button></li>
        ))
        setViewID(0);
    } 

    function updateView(){
        switch (viewID){
          case 0:
            return <ul>{salaries}</ul>;
          case 1:
            return <TakeSalary new={false} year={year} id={id}/>;
          default:
            return <ul>{salaries}</ul>;  
        }
    }
    
    function onGetItemsClick(){
        SalaryAPIClient.GetSalaries(year, updateSalaries).then(updateView);
    }

    return(
        <>    
          {updateView()}
          <button onClick={onGetItemsClick}>Pobierz odcinki z wypłat</button>          
        </>
    )
}

export default SalaryList;