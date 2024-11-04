import React, { useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./index.css";
import PATHS from "./SalaryClientURL";
import { Routes, Route, generatePath, useNavigate } from "react-router-dom";
import Login from "./Login";
import { CookiesProvider } from "react-cookie";
import YearSelector, { Years } from "./YearSelector";

function Sidebar() {
  const navigate = useNavigate();

  return (
    //TODO - change to <NavLink>
    <ol>
      <ul onClick={() => navigate(PATHS.login)}>Logowanie</ul>
      <ul onClick={() => navigate(PATHS.salariesPath)}>
        Wróć do listy odcinków
      </ul>
      <ul onClick={() => navigate(PATHS.salaryPath)}>Dodaj</ul>
    </ol>
  );
}

function Content() {
  const [year, setYear] = useState(Years[1].year);

  function handleYearChange(year) {
    setYear(year);
  }

  return (
    <CookiesProvider>
      <Routes>
        <Route
          path={PATHS.salariesPath}
          element={
            <SalaryList year={year}>
              <YearSelector
                currentYear={year}
                onYearChange={handleYearChange}
              />
            </SalaryList>
          }
        />
        <Route
          path={PATHS.salaryPath}
          element={
            <TakeSalary year={year}>
              <YearSelector
                currentYear={year}
                onYearChange={handleYearChange}
              />
            </TakeSalary>
          }
        />
        <Route path={PATHS.login} element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </CookiesProvider>
  );
}

export default function MainView() {
  return (
    <>
      <header className="myheader">Lista odcinków wypłat</header>
      <div className="workspace">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <Content />
        </div>
      </div>
    </>
  );
}
