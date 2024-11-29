import { useGlobalContext } from "./GlobalContext";
import { BACKEND_PATHS } from "./Endpoints";
import internalFetch, { SERVER_ADRESS, generateURL } from "./useFetchInternal";
import { useCallback } from "react";

export function useSalary(setError) {
  const { setLoadingState } = useGlobalContext();

  const internalSalaryFetch = useCallback(
    async (URL, requestOptions) => {
      setLoadingState(true);
      const data = await internalFetch(URL, requestOptions, setError);
      setLoadingState(false);
      return data;
    },
    [setLoadingState, setError]
  );

  const getSalaries = useCallback(
    async (params) => {
      const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.salariesPath, params);
      const data = await internalSalaryFetch(URL);
      return data;
    },
    [internalSalaryFetch]
  );

  const getSalary = useCallback(
    async (id) => {
      const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.salaryPath + (id ? `/${id}` : "`/0"));
      const data = await internalSalaryFetch(URL);
      return data;
    },
    [internalSalaryFetch]
  );

  const getDataForNewSalary = useCallback(
    async (year) => {
      const URL = generateURL(SERVER_ADRESS, `${BACKEND_PATHS.getDataForNewSalary}/${year}`);
      const data = await internalSalaryFetch(URL);
      return data;
    },
    [internalSalaryFetch]
  );

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
