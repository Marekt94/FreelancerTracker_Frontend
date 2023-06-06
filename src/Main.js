import React, { useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";

const Years = [{year: 2022}, 
  {year : 2023},
  {year : 2024}
];

function MainView(){
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

  function onBackButtonClick(){
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
      <button onClick={onBackButtonClick}>{view.backButtonCaption}</button> 
    </>
  )
}

export default MainView;
