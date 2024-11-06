import { useState } from "react";
import { SERVER_ADRESS } from "./Constants";

function createQueryString(paramsList){
  return '?' + paramsList.map((param) => `${param.name}=${param.value}`).join('&'); 
}

//TODO - dorobić wersjonowanie API

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
    const URL = SERVER_ADRESS + "/salaries" + (id ? `/${id}` : '');
    //OLD
    // const URL = SERVER_ADRESS + "/salary" + (id ? `/${id}` : '');
    // zmienić na stare dopóki nie zmienie backendu
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

  async function saveSalary(salary){
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(salary),
    };
    const URL = SERVER_ADRESS + "save_salary";
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;   
  }

  async function evaluate(salary){
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(salary),
    };
    const URL = SERVER_ADRESS + "evaluate";
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;       
  }

  async function deleteSalary(id){
    const URL = SERVER_ADRESS + "delete_salary" + `/${id}`;
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;      
  }

  return {getSalaries, getSalary, getDataForNewSalary, saveSalary, evaluate, deleteSalary};
}