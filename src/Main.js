import React, { useEffect, useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./Main.css";
import PATHS from "./SalaryClientURL";
import {Routes, Route, generatePath, useNavigate} from 'react-router-dom';
import SalaryAPIClient from "./SalaryAPICLient";

function MainView(){
  const Years = [{year: 2022}, 
    {year : 2023},
    {year : 2024}
  ]; 

  const [year, setYear] = useState(Years[1].year); 
  const navigate = useNavigate();  

  useEffect(()=>{
    console.log('useEffect w Main');
    navigate(generatePath(PATHS.salariesPath));
  },[]);

  function onChangeYear(event){
    setYear(event.target.value);      
  }

  function onListaOdcinkowClick(){
    navigate(generatePath(PATHS.salariesPath));     
  }

  function onDodajClick(){
    navigate(generatePath(PATHS.salaryPath));
  }

  return(
    <>
      <header class='myheader'>
        Lista odcinków wypłat
      </header> 
      <div class='workspace'>
        <div class='sidebar'>
        <ol>
          <ul onClick={onListaOdcinkowClick}>Wróć do listy odcinków</ul>		
          <ul onClick={onDodajClick}>Dodaj</ul>  
        </ol>
        </div>
        <div class='content'>
          <select class='select' align='center' defaultValue={year} onChange={onChangeYear}>
            {Years.map((obj) => <option>{obj.year}</option>)}
          </select>            
          <Routes>
              <Route path={PATHS.salariesPath} element={<SalaryList year={year}/>}/>
              <Route path={PATHS.salaryPath} element={<TakeSalary year={year}/>}/>
              {/* <Route path="*" element={navigate(PATHS.salariesPath)}/> */}
          </Routes>        
        </div>
      </div>                 
    </>
  )
}

export default MainView;
