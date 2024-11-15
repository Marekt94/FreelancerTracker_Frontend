import { useGlobalContext } from "./GlobalContext";
import { BACKEND_PATHS } from "./SalaryClientURL";
import useFetchInternal, { SERVER_ADRESS } from "./useFetchInternal";

//TODO - dorobić wersjonowanie API

//TODO - wyciągnąć loading do kontekstu
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
    //NEW
    // const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.salariesPath, params);
    //OLD
    const URL = generateURL(
      SERVER_ADRESS,
      BACKEND_PATHS.salariesPath + `/${params[0].value}`
    );
    //zmienic na stare dopóki nie zmieni się backend
    const data = await internalSalaryFetch(URL);
    return data;
  }

  async function getSalary(id) {
    //NEW
    // const URL = generateURL(
    //   SERVER_ADRESS,
    //   BACKEND_PATHS.salariesPath + (id ? `/${id}` : "")
    // );
    //OLD
    const URL = generateURL(
      SERVER_ADRESS,
      BACKEND_PATHS.salaryPath + (id ? `/${id}` : "")
    );
    // zmienić na stare dopóki nie zmienie backendu
    const data = await internalSalaryFetch(URL);
    return data;
  }

  async function getDataForNewSalary(params) {
    //OLD
    const URL = generateURL(
      SERVER_ADRESS,
      `${BACKEND_PATHS.getDataForNewSalary}/${params}`
    );
    //new
    // const URL = SERVER_ADRESS + "get_data_for_new_salary" + createQueryString;
    const data = await internalSalaryFetch(URL);
    return data;
  }

  async function saveSalary(salary) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(salary),
    };
    const URL = generateURL(SERVER_ADRESS, BACKEND_PATHS.saveSalary);
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
    const URL = generateURL(
      SERVER_ADRESS,
      `${BACKEND_PATHS.deleteSalary}/${id}`
    );
    const data = await internalSalaryFetch(URL);
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
