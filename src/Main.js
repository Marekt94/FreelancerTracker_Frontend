import React, { useEffect, useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./Main.css";
import PATHS from "./SalaryClientURL";
import {Routes, Route, generatePath, useNavigate} from 'react-router-dom';
import Login from "./Login";

function MainView(){
  const Years = [{year: 2022}, 
    {year : 2023},
    {year : 2024}
  ]; 

  const [year, setYear] = useState(Years[1].year); 
  const navigate = useNavigate();  

  useEffect(()=>{
    console.log('useEffect w Main');
    navigate('/login');
  },[]);

  function onChangeYear(event){
    setYear(event.target.value);      
  };

  return(
    <>
      <header class='myheader'>
        Lista odcinków wypłat
      </header> 
      <div class='workspace'>
        <div class='sidebar'>
        <ol>
          <ul onClick={() => navigate(generatePath(PATHS.salariesPath))}>Wróć do listy odcinków</ul>		
          <ul onClick={() => navigate(generatePath(PATHS.salaryPath))}>Dodaj</ul>  
        </ol>
        </div>
        <div class='content'>
          <select class='select' align='center' defaultValue={year} onChange={onChangeYear}>
            {Years.map((obj) => <option>{obj.year}</option>)}
          </select>            
          <Routes>
              <Route path={PATHS.salariesPath} element={<SalaryList year={year}/>}/>
              <Route path={PATHS.salaryPath} element={<TakeSalary year={year}/>}/>
              <Route path='/login' element={<Login/>}/>
          </Routes>        
        </div>
      </div>                 
    </>
  )
}

export default MainView;
