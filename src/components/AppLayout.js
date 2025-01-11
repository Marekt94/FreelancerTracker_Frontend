import { FRONTEND_PATHS } from "../Endpoints";
import { CookiesProvider } from "react-cookie";
import { useGlobalContext } from "../GlobalContext";
import { NavLink, Outlet } from "react-router-dom";
import Error from "./Error";
import Loading from "./Loading";
import { createPortal } from "react-dom";

function Sidebar() {
  return (
    <ol>
      <li>
        <NavLink className="navlink" to={FRONTEND_PATHS.login}>
          Logowanie
        </NavLink>
      </li>
      <li>
        <NavLink className="navlink" to={FRONTEND_PATHS.salariesPath}>
          Wróć do listy odcinków
        </NavLink>
      </li>
      <li>
        <NavLink className="navlink" to={FRONTEND_PATHS.newSalaryPath}>
          Dodaj
        </NavLink>
      </li>
    </ol>
  );
}

function Content() {
  const { isLoading } = useGlobalContext();
  return (
    <CookiesProvider>
      <Outlet />
      {isLoading ? createPortal(<Loading />, document.getElementById("root")) : <></>}
    </CookiesProvider>
  );
}

export default function AppLayout() {
  const { error, isLoading } = useGlobalContext();

  return error?.code ? (
    <Error className="content" />
  ) : (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className={isLoading ? "content-blur" : "content"}>
        <Content />
      </div>
    </>
  );
}
