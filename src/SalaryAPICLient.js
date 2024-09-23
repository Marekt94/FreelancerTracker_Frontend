import { API_ACCESS, SERVER_ADRESS } from "./Constants";

class SalaryAPIClient {
  static InternalFetch(URL, successfullCallback, requestOptions) {
    let adress = SERVER_ADRESS + URL;
    requestOptions = {
      ...requestOptions,
      credentials: "include",
      mode: "cors",
    };
    return fetch(adress, requestOptions)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else throw new Error(response.status + ": " + response.statusText);
      })
      .then((json) => {
        console.log(API_ACCESS, adress);
        successfullCallback(json);
      })
      .catch((e) => alert(e));
  }

  static GetSalaries(year, successfullCallback) {
    return SalaryAPIClient.InternalFetch(
      "salaries/" + year,
      successfullCallback
    );
  }

  static GetSalary(id, successfullCallback) {
    return SalaryAPIClient.InternalFetch("salary/" + id, successfullCallback);
  }

  static GetDataForNewSalary(year, successfullCallback) {
    return SalaryAPIClient.InternalFetch(
      "get_data_for_new_salary/" + year,
      successfullCallback
    );
  }

  static SaveSalary(object, successfullCallback) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(object),
    };
    return SalaryAPIClient.InternalFetch(
      "save_salary",
      successfullCallback,
      requestOptions
    );
  }

  static Evaluate(object, successfullCallback) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(object),
    };
    return SalaryAPIClient.InternalFetch(
      "evaluate",
      successfullCallback,
      requestOptions
    );
  }

  static DeleteSalary(id, successfullCallback) {
    return SalaryAPIClient.InternalFetch(
      "delete_salary/" + id,
      successfullCallback
    );
  }

  static Login(requestOptions, successfullCallback = () => {}) {
    return SalaryAPIClient.InternalFetch(
      "login",
      successfullCallback,
      requestOptions
    );
  }

  static Logout(requestOptions, successfullCallback = () => {}) {
    return SalaryAPIClient.InternalFetch(
      "logout",
      successfullCallback,
      requestOptions
    );
  }
}

export default SalaryAPIClient;
