import {API_ACCESS, SERVER_ADRESS} from "./Constants";


class SalaryAPIClient {

    static InternalFetch(URL, successfullCallback, requestOptions){
        let adress = SERVER_ADRESS + URL;
        return fetch(adress, requestOptions).then((obj) => obj.json()).then((json) => {
            console.log(API_ACCESS, adress);
            successfullCallback(json)
        }).catch((e)=> alert(e));
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

    static SaveSalary(requestOptions, successfullCallback){
        return SalaryAPIClient.InternalFetch("save_salary", successfullCallback, requestOptions)
    }

    static Evaluate(requestOptions, successfullCallback){
        return SalaryAPIClient.InternalFetch("evaluate", successfullCallback, requestOptions)
    }
}

export default SalaryAPIClient;