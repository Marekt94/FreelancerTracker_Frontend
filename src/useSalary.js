import { useState } from "react";
import { API_ACCESS, SERVER_ADRESS } from "./Constants";

function createQueryString(paramsList){
  return '?' + paramsList.map((param) => `${param.name}=${param.value}`).join('&'); 
}

export function useSalary(){
  async function getSalaries(params){
    const paramsString = createQueryString(params);
    const URL = SERVER_ADRESS + "/salaries" + paramsString;
    //zmienic na stare dopóki nie zmieni się backend
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  }

  async function getSalary(id){
    //NEW
    // const URL = SERVER_ADRESS + "/salaries" + (id ? `/${id}` : '');
    //OLD
    const URL = SERVER_ADRESS + "/salary" + (id ? `/${id}` : '');
    //zmienić na stare dopóki nie zmienie backendu
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  }

  async function getDataForNewSalary(params){
    //OLD
    const URL = SERVER_ADRESS + "get_data_for_new_salary/" + params;
    //new
    //const URL = SERVER_ADRESS + "get_data_for_new_salary" + createQueryString;
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  }

  return {getSalaries, getSalary, getDataForNewSalary};
}