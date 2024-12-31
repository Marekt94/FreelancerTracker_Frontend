import { FRONTEND_PATHS } from "../Endpoints";
import { CookiesProvider } from "react-cookie";
import { useGlobalContext } from "../GlobalContext";
import { NavLink, Outlet } from "react-router-dom";

function Sidebar() {
    const { year } = useGlobalContext();

    return (
        <ol>
        <li><NavLink className="navlink" to={FRONTEND_PATHS.login}>Logowanie</NavLink></li>
        <li><NavLink className="navlink" to={FRONTEND_PATHS.salariesPath + `?year=${year}`}>Wróć do listy odcinków</NavLink></li>
        <li><NavLink className="navlink" to={FRONTEND_PATHS.newSalaryPath}>Dodaj</NavLink></li>
        </ol>
    );
}
  
function Content() {
    return (
        <CookiesProvider>
            <Outlet/>
        </CookiesProvider> 
    );
}
  
export default function AppLayout(){
    return(
        <>
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="content">
                <Content />
            </div>
        </>
    )
}