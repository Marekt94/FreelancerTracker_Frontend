export const SALARY_API_VERSION = process.env.REACT_APP_SALARY_API_VERSION;

const SALARY_VERSION = SALARY_API_VERSION ? `/${SALARY_API_VERSION}` : "";

export const BACKEND_PATHS = {
  salaryPath: SALARY_VERSION + "/salaries",
  salariesPath: SALARY_VERSION + "/salaries",
  login: "/login",
  logout: "/logout",
  getDataForNewSalary: SALARY_VERSION + "/get_data_for_new_salary",
  evaluate: SALARY_VERSION + "/evaluate",
  deleteSalary: SALARY_VERSION + "delete_salary",
};

export const FRONTEND_PATHS = {
  salaryPath: BACKEND_PATHS.salaryPath + "/:id",
  newSalaryPath: BACKEND_PATHS.salaryPath + "/0",
  salariesPath: BACKEND_PATHS.salariesPath,
  login: BACKEND_PATHS.login,
  logout: BACKEND_PATHS.logout,
};
