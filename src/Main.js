import React, { useEffect, useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./Main.css";
import PATHS from "./SalaryClientURL";
import {NavLink, Routes, Route, generatePath, useNavigate} from 'react-router-dom';

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

  return(
    <>
      <header class='myheader'>
        Lista odcinków wypłat
      </header> 
      <div class='workspace'>
        <div class='sidebar'>
        <ol>
          <ul onClick={()=>setLastPath(PATHS.salariesPath)}><NavLink class="NavLink" to={generatePath(PATHS.salariesPath, {year: year})}>Wróć do listy odcinków</NavLink></ul>		
          <ul onClick={()=>setLastPath(PATHS.salaryPath)}><NavLink  class="NavLink" to={generatePath(PATHS.salaryPath, {year: year})}>Dodaj</NavLink></ul>  
        </ol>
        </div>
        <div class='content'>
          <select align='center' defaultValue={year} onChange={onChangeYear}>
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
