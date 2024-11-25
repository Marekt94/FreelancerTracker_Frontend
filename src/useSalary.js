import { useGlobalContext } from "./GlobalContext";
import { BACKEND_PATHS } from "./SalaryClientURL";
import useFetchInternal, { SERVER_ADRESS } from "./useFetchInternal";

export function useSalary(setError) {
  const { setLoadingState } = useGlobalContext();
  const { internalFetch, generateURL } = useFetchInternal(setError);

  async function internalSalaryFetch(URL, requestOptions) {
    setLoadingState(true);
    const data = await internalFetch(URL, requestOptions);
    setLoadingState(false);
    return data;
  }

  async function getSalaries(params) {
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.salariesPath, params);
    const data = await internalSalaryFetch(URL);
    return data;
  }

  async function getSalary(id) {
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.salaryPath + (id ? `/${id}` : "`/0"));
    const data = await internalSalaryFetch(URL);
    return data;
  }

  async function getDataForNewSalary(year) {
    const URL = generateURL(SERVER_ADRESS, `${BACKEND_PATHS.getDataForNewSalary}/${year}`);
    const data = await internalSalaryFetch(URL);
    return data;
  }

  async function saveSalary(salary) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(salary),
    };
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.salariesPath);
    const data = await internalSalaryFetch(URL, requestOptions);
    return data;
  }

  async function evaluate(salary) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(salary),
    };
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.evaluate);
    const data = await internalSalaryFetch(URL, requestOptions);
    return data;
  }

  async function deleteSalary(id) {
    const requestOptions = {
      method: "GET",
    };
    const URL = generateURL(SERVER_ADRESS, `${BACKEND_PATHS.deleteSalary}/${id}`);
    const data = await internalSalaryFetch(URL, requestOptions);
    return data;
  }

  return {
    getSalaries,
    getSalary,
    getDataForNewSalary,
    saveSalary,
    evaluate,
    deleteSalary,
  };
}
