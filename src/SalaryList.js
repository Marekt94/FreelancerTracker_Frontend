import React, {useState} from "react";
import "./Main.css";
import {months} from "./Dictionaries";
import "./SalaryAPICLient";
import SalaryAPIClient from "./SalaryAPICLient";
import TakeSalary from "./Salary";
import {useEffect} from "react";
import {FETCH_COMM} from "./Constants";

function SalaryList(props) {
    const year = props.year;  
    const [salaries, setSalaries] = useState("");
    const [id, setID] = useState(null);
    const [viewID, setViewID] = useState(0);

    useEffect(() => {
      let ignore = false;
      SalaryAPIClient.GetSalaries(year, (obj) => {
        if (!ignore){
          console.log(FETCH_COMM, "GetSalaries")
          updateSalaries(obj);
          updateView();
        }
      })
      return () => {ignore = true}
    },[year]);

    function onEditClick(event){
        setViewID(1);
        setID(event.target.getAttribute("id"));
    }   

    function updateSalaries(json){
        const salary = json.sort((x, y) => x.miesiac > y.miesiac ? 1 : -1); 
        setSalaries(salary.map((obj) =>
            <li key={obj.id}>{months.find(element => element.id === obj.miesiac).value}: stawka godzinowa - {obj.stawka}, netto = {obj.netto}<button id={obj.id} onClick={onEditClick}>Edytuj</button></li>
        ))
    } 

    function onClickBack(){
      SalaryAPIClient.GetSalaries(year, updateSalaries).then(updateView);
      setViewID(0);
    }

    function updateView(){
        switch (viewID){
          case 0:
            return <ul>{salaries}</ul>;
          case 1:
            return(
            <>
              <TakeSalary new={false} year={year} id={id}/>
              <button onClick={onClickBack}>Wróć</button> 
            </>)
          default:
            return <ul>{salaries}</ul>;  
        }
    }
    
    return(
        <>    
          {updateView()}        
        </>
    )
}

export default SalaryList;