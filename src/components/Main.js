import SalaryList from "./SalaryList";
import TakeSalary from "./Salary";
import "../css/index.css";
import { FRONTEND_PATHS } from "../Endpoints";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import { CookiesProvider } from "react-cookie";
import YearSelector from "./YearSelector";
import { GlobalContextProvider, useGlobalContext } from "../GlobalContext";

function Sidebar() {
  const navigate = useNavigate();
  const { year } = useGlobalContext();

  return (
    //TODO - change to <NavLink> - nie da się, nieskończona pętla
    <ol>
      <ul onClick={() => navigate(FRONTEND_PATHS.login)}>Logowanie</ul>
      <ul onClick={() => navigate(FRONTEND_PATHS.salariesPath + `?year=${year}`)}>Wróć do listy odcinków</ul>
      <ul onClick={() => navigate(FRONTEND_PATHS.newSalaryPath)}>Dodaj</ul>
    </ol>
  );
}

function Content() {
  const { year, setYear } = useGlobalContext();

  return (
    <CookiesProvider>
      <Routes>
        <Route
          path={FRONTEND_PATHS.salariesPath}
          element={
            <SalaryList>
              <YearSelector currentYear={year} onYearChange={setYear} />
            </SalaryList>
          }
        />
        <Route
          path={FRONTEND_PATHS.salaryPath}
          element={
            <TakeSalary>
              <YearSelector currentYear={year} onYearChange={setYear} />
            </TakeSalary>
          }
        />
        <Route
          path={FRONTEND_PATHS.newSalaryPath}
          element={
            <TakeSalary>
              <YearSelector currentYear={year} onYearChange={setYear} />
            </TakeSalary>
          }
        />
        <Route path={FRONTEND_PATHS.login} element={<Login />} />
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
        <GlobalContextProvider>
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="content">
            <Content />
          </div>
        </GlobalContextProvider>
      </div>
    </>
  );
}
