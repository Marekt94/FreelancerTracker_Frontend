import React, { useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./Main.css";
import {NavLink, Routes, Route, generatePath, useNavigate} from 'react-router-dom';

function MainView(){
  const Years = [{year: 2022}, 
    {year : 2023},
    {year : 2024}
  ];

  const paths ={
    salaryPath  : "salary/:year/:id?",
    salariesPath: "salaries/:year"
  }  

  const [year, setYear] = useState(Years[1].year); 
  const [lastPath, setLastPath] = useState();
  const navigate = useNavigate();  

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
          <ul onClick={()=>setLastPath(paths.salariesPath)}><NavLink to={generatePath(paths.salariesPath, {year: year})} class="NavLink">Wróć do listy odcinków</NavLink></ul>		
          <ul onClick={()=>setLastPath(paths.salaryPath)}><NavLink to={generatePath(paths.salaryPath, {year: year})} class="NavLink">Dodaj</NavLink></ul>  
        </ol>
        </div>
        <div class='content'>
          <select align='center' defaultValue={year} onChange={onChangeYear}>
            {Years.map((obj) => <option>{obj.year}</option>)}
          </select>            
          <Routes>
            <Route path={paths.salariesPath} element={<SalaryList/>} loader={(params) => {params.year = year}}/>
            <Route path={paths.salaryPath} element={<TakeSalary/>} loader={(params) => {params.year = year}}/>
          </Routes>        
        </div>
      </div>                 
    </>
  )
}

export default MainView;
