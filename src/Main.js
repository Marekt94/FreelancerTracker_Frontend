import React, { useState } from "react";
import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "./index.css";
import { FRONTEND_PATHS } from "./SalaryClientURL";
import { Routes, Route, generatePath, useNavigate } from "react-router-dom";
import Login from "./Login";
import { CookiesProvider } from "react-cookie";
import YearSelector, { Years } from "./YearSelector";
import { GlobalContextProvider } from "./GlobalContext";

function Sidebar() {
  const navigate = useNavigate();

  return (
    //TODO - change to <NavLink> - nie da się, nieskończona pętla
    <ol>
      <ul onClick={() => navigate(FRONTEND_PATHS.login)}>Logowanie</ul>
      <ul onClick={() => navigate(FRONTEND_PATHS.salariesPath)}>
        Wróć do listy odcinków
      </ul>
      <ul onClick={() => navigate(FRONTEND_PATHS.newSalaryPath)}>Dodaj</ul>
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
      <GlobalContextProvider>
        <Routes>
          <Route
            path={FRONTEND_PATHS.salariesPath}
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
            path={FRONTEND_PATHS.salaryPath}
            element={
              <TakeSalary year={year}>
                <YearSelector
                  currentYear={year}
                  onYearChange={handleYearChange}
                />
              </TakeSalary>
            }
          />
          <Route
            path={FRONTEND_PATHS.newSalaryPath}
            element={
              <TakeSalary year={year}>
                <YearSelector
                  currentYear={year}
                  onYearChange={handleYearChange}
                />
              </TakeSalary>
            }
          />
          <Route path={FRONTEND_PATHS.login} element={<Login />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </GlobalContextProvider>
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
