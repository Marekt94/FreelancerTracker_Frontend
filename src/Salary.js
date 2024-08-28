import React, {useEffect, useState} from "react";
import "./Main.css";
import "./SalaryAPICLient";
import SalaryAPIClient from "./SalaryAPICLient";
import {MONTHS} from "./Dictionaries";
import { useParams } from "react-router-dom";
import { useNavigate, generatePath } from "react-router-dom";
import { Edit, Combo } from "./MyComponents";
import PATHS from "./SalaryClientURL";

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
  naUrlopowoChorobowe : 0,
  zablokowane : false,
  brutto : 0,
  vat : 0,
  podatek : 0
}

export function TakeSalary(props){
  let params = useParams();
  const [id, setID] = useState(useParams().id);
  const year  = props.year;  
  const [salary, setSalary] = useState(defSalary);
  const [miesiace, setMiesiace] = useState([{id :0, value : ""}]);
  const [formaOpodatkowania, setFormaOpodatkowania] = useState([{id : 0, value : ""}]);
  const navigate = useNavigate();

  useEffect(() => {
      let id = params.id;
      console.log("useEffect w take salary");
      SalaryAPIClient.GetDataForNewSalary(year, obj => {InitSalary(obj, id)});
    },[year, params.id]);
    
  function InitSalary(json, id){
    let miesiace = json.miesiace.map(obj => ({id : obj.iD, value : obj.monthName}));
    let formaOpodatkowania = json.formaOpodatkowania.map(obj => ({id : obj.id, value : obj.nazwa, wysokoscPodtku : obj.wysokoscPodatkuList}));
    if (id !== undefined){
      SalaryAPIClient.GetSalary(id, obj => {
        let miesiac = miesiace.find(x => x.id === obj.miesiac);
        if (miesiac === undefined) {
          miesiac = MONTHS.find(x => x.id === obj.miesiac);
          miesiace = [miesiac, ...miesiace];
          miesiace.sort((a, b) => a.id - b.id);                  
        }          
        setMiesiace([{id: "0", value: ""}, ...miesiace]);
        setFormaOpodatkowania([{id: "0", value: ""}, ...formaOpodatkowania]);  
        setSalary(obj);            
      })
    }
    setMiesiace([{id: "0", value: ""}, ...miesiace]);
    setFormaOpodatkowania([{id: "0", value: ""}, ...formaOpodatkowania]);
    setSalary(defSalary);
    setID(id);
  }    

  function onZapiszClick(){
    salary.rok = year;
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(salary)
    };

    SalaryAPIClient.SaveSalary(requestOptions, (json) => {
      salary.id = json.id;
      let tempSalary = {...salary};
      tempSalary.id = json.id;
      setSalary(tempSalary); 
      setID(json.id);   
    })
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

  function onEvaluateClick(){
    let tempFormaOpodatkowania = formaOpodatkowania.find(obj => obj.id === salary.idFormyOpodatkowania);
    salary.formaOpodatkowania = {id : tempFormaOpodatkowania.id, nazwa : tempFormaOpodatkowania.value, wysokoscPodatkuList : tempFormaOpodatkowania.wysokoscPodtku};
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(salary)
    };

    SalaryAPIClient.Evaluate(requestOptions, (json) =>{ 
      setSalary(json);
    }
    );
  }

  function onDeleteCLick(){
    SalaryAPIClient.DeleteSalary(salary.id, () => navigate(generatePath(PATHS.salariesPath, {year: year})))  
  };

  return (
    <>
      <Edit caption="Id" value={id} name="id" readonly="true" onChange={onChangeEdit}/>
      <Combo caption="Miesiąc" value={salary.miesiac} name="miesiac" dictionary={miesiace} defaultValue={0} readonly="true" onChange={onMiesiacChange}/>
      <Edit caption="Stawka godzinowa netto" value={salary.stawka} name="stawka" onChange={onChangeEdit}/>
      <Edit caption="Dni robocze w miesiącu" value={salary.dniRoboczych} name="dniRoboczych" onChange={onChangeEdit}/>
      <Combo caption="Forma opodatkowania" value={salary.idFormyOpodatkowania} name="idFormyOpodatkowania" dictionary={formaOpodatkowania} defaultValue={0} onChange={onFormaPodatkowaChange}/>
      <Edit caption="Dni przepracowane" value={salary.dniPrzepracowanych} name="dniPrzepracowanych" onChange={onChangeEdit}/>
      <Edit caption="Składka zdrowotna" value={salary.skladkaZdrowotna} name="skladkaZdrowotna" onChange={onChangeEdit}/>
      <Edit caption="Składka ZUS" value={salary.zUS} name="zUS" onChange={onChangeEdit}/>  
      <Edit caption="Podatek" value={salary.podatek} name="podatek" onChange={onChangeEdit}/>
      <Edit caption="Vat" value={salary.vat} name="vat" onChange={onChangeEdit}/>
      <br/>    
      <Edit caption="Netto" value={salary.netto} name="netto" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Pełne netto" value={salary.pelneNetto} name="pelneNetto" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Na urlopowo-chorobowe" value={salary.naUrlopowoChorobowe} name="naUrlopowoChorobowe" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Do wypłaty" value={salary.doWyplaty} name="doWyplaty" readonly="true" onChange={onChangeEdit}/>
      <Edit caption="Do rozdysponowania" value={salary.doRozdysponowania} name="doRozdysponowania" readonly="true" onChange={onChangeEdit}/>
      <button onClick={onZapiszClick}>Zapisz</button>
      <button onClick={onEvaluateClick}>Oblicz</button>
      {(id === undefined) ? <></> : (<button onClick={onDeleteCLick}>Usuń</button>)}
    </>
  );
}

export default TakeSalary;
