import React, {useContext, useEffect, useState} from "react";
import "./Main.css";
import "./SalaryAPICLient";
import SalaryAPICLient from "./SalaryAPICLient";
import {months} from "./Dictionaries";

const defSalary = {
  id : 0,
  idFormyOpodatkowania : 0,
  formaOpodatkowania : {},
  miesiac : 0,
  stawka: 0,
  dniRoboczych : 0,
  dniPrzepracowanych : 0,
  skladkaZdrowotna : 0,
  zUS: 0,
  netto: 0,
  pelneNetto : 0,
  doWyplaty : 0,
  doRozdysponowania : 0,
  zablokowane : false
}

function Edit({caption, value, name, readonly = false, onChange = null}){
  return(
    <div style={{flexDirection : "row"}}>
        <label>{caption}</label>
        <input readonly={readonly} name={name} value={value} defaultValue={value} onChange={onChange}/>   
    </div>
  );
}

function Combo({caption, value, name, dictionary, defaultValue = null, readonly = false, onChange = null}){
  return(
    <div style={{flexDirection : "row"}}>
        <label>{caption}</label>
        <select value={defaultValue} name={name} readonly={readonly} onChange={onChange}>
          {dictionary.map((slownik) => <option>{slownik.value}</option>)}
        </select>
    </div>    
  );
}

export function TakeSalary(props){
  const isNew = props.new;
  const year  = props.year;
  const [defId, setDefId] = useState(props.id);
  const [miesiace, setMiesiace] = useState([{}]);
  const [formaOpodatkowania, setFormaOpodatkowania] = useState([{}]);
  const [salary, setSalary] = useState(defSalary);
  const [defMiesiacIFormaOpodatkowania, setDefMiesiacIFormaOpodatkowania] = useState(
    {miesiac : null,
    formaOpodatkowania : null}
  );

  async function onZapiszClick(){
    salary.rok = year;
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(salary)
    };

    let obj = await fetch('http://localhost:8080/save_salary', requestOptions);
    let json =  await obj.json();
    console.log(json);
    salary.id = json.id;
    let tempSalary = {...salary};
    tempSalary.id = json.id;
    setSalary(tempSalary);
  }  

  function onChangeEdit(event){
    let tempSalary = {...salary};
    tempSalary[event.target.name] = event.target.value;
    setSalary(tempSalary);
  }  

  function onFormaPodatkowaChange(event){
    let tempSalary = {...salary};
    let tempFormaOpodatkowania = formaOpodatkowania.find(obj => obj.value === event.target.value);
    tempSalary[event.target.name] = tempFormaOpodatkowania.id;
    setSalary(tempSalary);
  }

  function onMiesiacChange(event){
    let tempSalary = {...salary};
    let tempMiesiac = miesiace.find(obj => obj.value === event.target.value);
    tempSalary[event.target.name] = tempMiesiac.id;
    setSalary(tempSalary);
  }  

  async function onEvaluateClick(){
    let tempFormaOpodatkowania = formaOpodatkowania.find(obj => obj.id === salary.idFormyOpodatkowania);
    salary.formaOpodatkowania = {id : tempFormaOpodatkowania.id, nazwa : tempFormaOpodatkowania.value, wysokoscPodatkuList : tempFormaOpodatkowania.wysokoscPodatku};
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(salary)
    };

    let obj = await fetch('http://localhost:8080/evaluate', requestOptions);
    let json =  await obj.json();
    setSalary(json);
  }

  function AfterFetchDataForNewSalary(json){
    let tempFormaOpodatkowania = json.miesiace.map(obj => ({id : obj.iD, value : obj.monthName}));
    let tempMiesiace = json.formaOpodatkowania.map(obj => ({id : obj.id, value : obj.nazwa, wysokoscPodatku : obj.wysokoscPodatkuList}));
    setMiesiace([{id : 0, value : ""}, ...tempFormaOpodatkowania]);
    setFormaOpodatkowania([{id : 0, value : ""}, ...tempMiesiace]);
  }

  function InitSalary(json){
    setSalary(json);
    let miesiacIFormaOpodtkowania = {
      miesiac : (months.find(x => x.id === json.miesiac).value),
      formaOpodatkowania : json.formaOpodatkowania.nazwa
    };
    setDefMiesiacIFormaOpodatkowania(miesiacIFormaOpodtkowania);
  }

  function Init(){
    if (isNew){
      return SalaryAPICLient.GetDataForNewSalary(year, AfterFetchDataForNewSalary);
    }
    else{
      return SalaryAPICLient.GetSalary(defId, SalaryAPICLient.GetDataForNewSalary(year, AfterFetchDataForNewSalary)).then(InitSalary);
    }
  }

  useEffect(() => {Init()},[year]);
  return (
    <>
      <Edit caption="Id" value={salary.id} name="id" readonly="true" onChange={onChangeEdit}/>
      <Combo caption="Miesiąc" value={salary.miesiac} name="miesiac" dictionary={miesiace} defaultValue={defMiesiacIFormaOpodatkowania.miesiac} readonly="true" onChange={onMiesiacChange}/>
      <Edit caption="Stawka dzienna netto" value={salary.stawka} name="stawka" onChange={onChangeEdit}/>
      <Edit caption="Dni robocze w miesiącu" value={salary.dniRoboczych} name="dniRoboczych" onChange={onChangeEdit}/>
      <Combo caption="Forma opodatkowania" value={salary.idFormyOpodatkowania} name="idFormyOpodatkowania" dictionary={formaOpodatkowania} defaultValue={defMiesiacIFormaOpodatkowania.formaOpodatkowania} onChange={onFormaPodatkowaChange}/>
      <Edit caption="Dni przepracowane" value={salary.dniPrzepracowanych} name="dniPrzepracowanych" onChange={onChangeEdit}/>
      <Edit caption="Składka zdrowotna" value={salary.skladkaZdrowotna} name="skladkaZdrowotna" onChange={onChangeEdit}/>
      <Edit caption="Składka ZUS" value={salary.zUS} name="zUS" onChange={onChangeEdit}/>  
      <br/>    
      <Edit caption="Netto" value={salary.netto} name="netto" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Pełne netto" value={salary.pelneNetto} name="pelneNetto" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Do wypłaty" value={salary.doWyplaty} name="doWyplaty" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Do rozdysponowania" value={salary.doRozdysponowania} name="doRozdysponowania" readonly="true" onChange={onChangeEdit}/>
      <button onClick={onZapiszClick}>Zapisz</button>
      <button onClick={onEvaluateClick}>Oblicz</button>
    </>
  );
}

export default TakeSalary;
