import { useState } from "react";
import { API_ACCESS, SERVER_ADRESS } from "./Constants";

export function useSalary(){
  async function getSalaries(params){
    const paramsString = params.map((param) => `?${param.name}=${param.value}`).join('');
    const URL = SERVER_ADRESS + "/salaries" + paramsString;
    //zmienic na stare dopóki nie zmieni się backend
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  }

  async function getSalary(id){
    const URL = SERVER_ADRESS + "/salaries" + (id ? `/${id}` : '');
    //zmienić na stare dopóki nie zmienie backendu
    console.log(URL);
    const res = await fetch(URL);
    const data = await res.json();
    return data;
  }

  return {getSalaries, getSalary};
}