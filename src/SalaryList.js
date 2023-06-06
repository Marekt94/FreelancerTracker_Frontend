import React, {useEffect, useState, createContext} from "react";
import "./Main.css";
import TakeSalary from "./Salary";

const Years = [{year: 2022}, 
  {year : 2023},
  {year : 2024}
];

function SalaryList(props) {
    const [salaries, setSalaries] = useState("");
    const [id, setID] = useState(null);
    const year = props.year;

    function onEditClick(event){
        setID(event.target.getAttribute("id"));
    }
    
    async function GetListItems(){
        let json = await fetch("http://localhost:8080/salaries/" + year).then((obj) => obj.json());

        console.log(json);

        setSalaries(json.map((salary) =>
            <li key={salary.id}>{salary.rok} {salary.miesiąc} {salary.netto} {salary.stawka}<button id={salary.id} onClick={onEditClick}>Edytuj</button></li>
        ))
    }

    return(
        <>    
          <ul>{salaries}</ul>
          <button onClick={GetListItems}>Pobierz odcinki z wypłat</button>          
        </>
    )
}

export default function MainView(){
  const [year, setYear] = useState(Years[1].year); 

  function createView(){
    const viewList = [{
      id : 0,
      view : <SalaryList year={year}/>,
      backButtonCaption : "Dodaj nowy odcinek"
    },{
      id : 1,
      view : <TakeSalary new="true" year={year}/>,
      backButtonCaption : "Wróć do listy odcinków"
    }
    ]; 
    return(viewList);
  }
  const [view, setView] = useState(createView()[0]);

  function updateView(){
    const viewList = createView(); 
    return(viewList[view.id]);
  }

  function getView(){
    const viewList = createView(); 
    let viewTemp;
    switch (view.id){
      case 0:
        viewTemp = viewList[1]
      break
      case 1:
        viewTemp = viewList[0]
      break
      default:
        viewTemp = viewList[0]
    }
    setView(viewTemp);
  }  

  function onChangeYear(event){
    setYear(event.target.value);
  }  

  return(
    <>
      <select defaultValue={year} onChange={onChangeYear}>
        {Years.map((obj) => <option>{obj.year}</option>)}
      </select>        
      {updateView().view}
      <button onClick={getView}>{view.backButtonCaption}</button> 
    </>
  )
}