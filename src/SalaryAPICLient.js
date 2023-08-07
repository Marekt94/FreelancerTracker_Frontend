import {API_ACCESS, SERVER_ADRESS} from "./Constants";


class SalaryAPIClient {

    static InternalFetch(URL, successfullCallback){
        let adress = SERVER_ADRESS + URL;
        return fetch(adress).then((obj) => obj.json()).then((json) => {
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
}

export default SalaryAPIClient;