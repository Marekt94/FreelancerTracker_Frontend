import React, { useEffect, useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./Main.css";
import PATHS from "./SalaryClientURL";
import {Routes, Route, generatePath, useNavigate} from 'react-router-dom';

function MainView(){
  const Years = [{year: 2022}, 
    {year : 2023},
    {year : 2024}
  ]; 

  const [year, setYear] = useState(Years[1].year); 
  const [lastPath, setLastPath] = useState(PATHS.salariesPath);
  const navigate = useNavigate();  

  useEffect(()=>{navigate(generatePath(lastPath, {year: year}))},[null]);

  function onChangeYear(event){
    setYear(event.target.value);
    navigate(generatePath(lastPath, {year: event.target.value}))
  }
  
  function onClick(path, year){
    setLastPath(path);
    navigate(generatePath(path, {year: year}))
  }

  return(
    <>
      <header class='myheader'>
        Lista odcinków wypłat
      </header> 
      <div class='workspace'>
        <div class='sidebar'>
        <ol>
          <ul onClick={()=>onClick(PATHS.salariesPath, year)}>Wróć do listy odcinków</ul>		
          <ul onClick={()=>onClick(PATHS.salaryPath, year)}>Dodaj</ul>  
        </ol>
        </div>
        <div class='content'>
          <select class='select' align='center' defaultValue={year} onChange={onChangeYear}>
            {Years.map((obj) => <option>{obj.year}</option>)}
          </select>            
          <Routes>
            <Route path="/">
              <Route path={PATHS.salariesPath} element={<SalaryList/>} loader={(params) => {params.year = year}}/>
              <Route path={PATHS.salaryPath} element={<TakeSalary/>} loader={(params) => {params.year = year}}/>
            </Route>
          </Routes>        
        </div>
      </div>                 
    </>
  )
}

export default MainView;
