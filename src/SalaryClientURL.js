export const  BACKEND_PATHS = {
    salaryPath  : "/salary",
    salariesPath: "/salaries",
    login: "/login",
    logout: "/logout",
    getDataForNewSalary: "/get_data_for_new_salary",
    evaluate: "/evaluate",
    deleteSalary: "delete_salary"
};

export const FRONTEND_PATHS={
    salaryPath  : BACKEND_PATHS.salaryPath + "/:id",
    newSalaryPath  : BACKEND_PATHS.salaryPath,
    salariesPath: BACKEND_PATHS.salariesPath,
    login: BACKEND_PATHS.login,
    logout: BACKEND_PATHS.logout,
}