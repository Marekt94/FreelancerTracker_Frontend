import "../css/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import SalaryList from "./SalaryList";
import Salary from "./Salary";
import AppLayout from "./AppLayout";
import { FRONTEND_PATHS } from "../Endpoints";
import Error from "../components/Error";
import { GlobalContextProvider } from "../GlobalContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: FRONTEND_PATHS.salariesPath,
        element: <SalaryList />,
      },
      {
        path: FRONTEND_PATHS.salaryPath,
        element: <Salary />,
      },
      {
        path: FRONTEND_PATHS.newSalaryPath,
        element: <Salary />,
      },
      {
        path: FRONTEND_PATHS.login,
        element: <Login />,
      },
    ],
    errorElement: <Error />,
  },
]);

export default function MainView() {
  return (
    <>
      <header className="myheader">Lista odcinków wypłat</header>
      <div className="workspace">
        <GlobalContextProvider>
          <RouterProvider router={router} />
        </GlobalContextProvider>
      </div>
    </>
  );
}
