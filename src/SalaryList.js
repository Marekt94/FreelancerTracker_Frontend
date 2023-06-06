import React, {useState} from "react";
import "./Main.css";
import {months} from "./Dictionaries";

function SalaryList(props) {
    const [salaries, setSalaries] = useState("");
    const [id, setID] = useState(null);
    const year = props.year;

    function onEditClick(event){
        setID(event.target.getAttribute("id"));
    }    
    
    async function onGetItemsClick(){
        let json = await fetch("http://localhost:8080/salaries/" + year).then((obj) => obj.json());

        console.log(json);

        setSalaries(json.map((salary) =>
            <li key={salary.id}>{months.find(element => element.id === salary.miesiac).value}: stawka godzinowa - {salary.stawka}, netto = {salary.netto}<button id={salary.id} onClick={onEditClick}>Edytuj</button></li>
        ))
    }

    return(
        <>    
          <ul>{salaries}</ul>
          <button onClick={onGetItemsClick}>Pobierz odcinki z wypłat</button>          
        </>
    )
}

export default SalaryList;