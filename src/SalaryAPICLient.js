const serverAdress = "http://localhost:8080/";

class SalaryAPIClient {

    static InternalFetch(URL, successfullCallback){
        return fetch(serverAdress + URL).then((obj) => obj.json()).then(successfullCallback).catch((e)=> alert(e));
    }

    static GetSalaries(year, successfullCallback){
        return SalaryAPIClient.InternalFetch("salaries/" + year, successfullCallback);
    }

    static GetSalary(id, successfullCallback){
        return SalaryAPIClient.InternalFetch("salary/" + id, successfullCallback);
    }

    static GetDataForNewSalary(year, successfullCallback){
        return SalaryAPIClient.InternalFetch("get_data_for_new_salary/" + year, successfullCallback);
    }
}

export default SalaryAPIClient;