import React, { useEffect, useReducer, useState } from "react";
import "./index.css";
import "./SalaryAPICLient";
import SalaryAPIClient from "./SalaryAPICLient";
import { MONTHS } from "./Dictionaries";
import { useParams } from "react-router-dom";
import { useNavigate, generatePath } from "react-router-dom";
import { Edit, Combo } from "./MyComponents";
import PATHS from "./SalaryClientURL";
import { defDict } from "./Dictionaries";
import { useSalary } from "./useSalary";

const defSalary = {
  id: 0,
  idFormyOpodatkowania: 0,
  formaOpodatkowania: {
    id: 0,
    nazwa: "",
    wysokoscPodatkuList: [
      {
        id: 0,
        stwka: 0,
        formaOpodatkowaniaId: 0,
      },
    ],
  },
  miesiac: 0,
  stawka: 0,
  dniRoboczych: 0,
  dniPrzepracowanych: 0,
  skladkaZdrowotna: 0,
  zUS: 0,
  netto: 0,
  pelneNetto: 0,
  doWyplaty: 0,
  doRozdysponowania: 0,
  naUrlopowoChorobowe: 0,
  zablokowane: false,
  brutto: 0,
  vat: 0,
  podatek: 0,
};

const TASK = {
  SAVE: "save",
  EVALUATE: "evaluate",
  DELETE: "delete",
};

const initialState = {
  salary: defSalary,
  miesiace: defDict,
  formaOpodatkowania: defDict,
  task: null,
  readyToExecute: false,
}

function reducer(state, action){
  switch (action.type){
    case "init":
      console.log("init")
      const miesiace = action.payload.dataForNewSalary.miesiace.map((obj) => ({
        id: obj.iD,
        value: obj.monthName,
      }));      

      const formaOpodatkowania = action.payload.dataForNewSalary.formaOpodatkowania.map((obj) => ({
        id: obj.id,
        value: obj.nazwa,
        wysokoscPodatku: obj.wysokoscPodatkuList,
      }));
      
      return {...state, salary: action.payload.salary, miesiace: miesiace, formaOpodatkowania: formaOpodatkowania};

    case "setSalary":{
      console.log("setSalary")
      return{...state, salary: action.payload};
    }

    case "setTask":{
      console.log("task set")
      return {...state, task: action.payload};
    }

    case "submit":{
      console.log("submit");
      return {...state, readyToExecute: true, salary: action.payload};
    }

    case "afterSubmit":{
      console.log("afterSubmit");
      return{...state, readyToExecute: false}
    }

    default:
      throw Error('Unknown action');
  }
}

export function TakeSalary({ children, year }) {
  let params = useParams();
  const [{salary, formaOpodatkowania, miesiace, task, readyToExecute}, dispatch] = useReducer(reducer, initialState);
  const [id, setID] = useState(useParams().id);
  const {getSalary, getDataForNewSalary} = useSalary();
  const navigate = useNavigate();

  useEffect(() => {
    const id = 2023;
    
    async function fetchSalary(id){
      const data = await getSalary(id);
      return data;
    };

    async function fetchDataForNewSalary(year){
      const data = await getDataForNewSalary(year);
      return data;
    }

    async function fetchData(){
      const dataForNewSalary = await fetchDataForNewSalary(year);
      const salary = await fetchSalary(id);
      const action = {
        type: "init", 
        payload:{
          salary: salary,
          dataForNewSalary: dataForNewSalary,
        }
      };
      dispatch(action);
    }

    fetchData();
  }, [year, params.id]);

  useEffect(()=>{
    function execute(){
      if (readyToExecute){
        switch (task) {
          case TASK.DELETE:
            console.log("delete");
            dispatch({type: "afterSubmit"});
            return 0;
          case TASK.EVALUATE:
            console.log("evaluate");
            dispatch({type: "afterSubmit"});
            return 0;
          case TASK.SAVE:
            console.log("save");
            dispatch({type: "afterSubmit"});
            return 0;
          default:
            return 0;
        }
      }
    }
    
    execute();
  }, [readyToExecute])

  function Save() {
    salary.rok = year;

    SalaryAPIClient.SaveSalary(salary, (json) => {
      const tempSalary = { ...salary, id: json.id };
      dispatch({type: "setSalary", payload: tempSalary});
      setID(json.id);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit " + task);

    const formData = new FormData(e.target);

    const id = formData.get("id");
    const miesiac = formData.get("miesiac");
    const currFormaOpodatkowania = formData.get("idFormyOpodatkowania");
    const stawka = formData.get("stawka");
    const dniRoboczych = formData.get("dniRoboczych");
    const dniPrzepracowanych = formData.get("dniPrzepracowanych");
    const skladkaZdrowotna = formData.get("skladkaZdrowotna");
    const zUS = formData.get("zUS");
    const podatek = formData.get("podatek");
    const vat = formData.get("vat");
    const netto = formData.get("netto");
    const pelneNetto = formData.get("pelneNetto");
    const naUrlopowoChorobowe = formData.get("naUrlopowoChorobowe");
    const doWyplaty = formData.get("doWyplaty");
    const doRozdysponowania = formData.get("doRozdysponowania");

    const formaOpodatkowaniaTemp = formaOpodatkowania.find(
      (obj) => obj.value === currFormaOpodatkowania
    );
    const miesiacTemp = miesiace.find((obj) => obj.value === miesiac);

    const newSalary = {
      ...salary,
      id: id,
      miesiac: miesiacTemp?.id,
      idFormyOpodatkowania: formaOpodatkowaniaTemp?.id,
      formaOpodatkowania: {
        id: formaOpodatkowaniaTemp?.id,
        nazwa: formaOpodatkowaniaTemp?.value,
        wysokoscPodatkuList: formaOpodatkowaniaTemp?.wysokoscPodatku,
      },
      stawka: stawka,
      dniRoboczych: dniRoboczych,
      dniPrzepracowanych: dniPrzepracowanych,
      skladkaZdrowotna: skladkaZdrowotna,
      zUS: zUS,
      podatek: podatek,
      vat: vat,
      netto: netto,
      pelneNetto: pelneNetto,
      naUrlopowoChorobowe: naUrlopowoChorobowe,
      doWyplaty: doWyplaty,
      doRozdysponowania: doRozdysponowania,
    };
    dispatch({type: "submit", payload: newSalary});
  }

  // function DeleteSalary() {
  //   SalaryAPIClient.DeleteSalary(salary.id, () =>
  //     navigate(generatePath(PATHS.salariesPath, { year: year }))
  //   );
  // }

  // function Evaluate() {
  //   SalaryAPIClient.Evaluate(salary, (json) => {
  //     dispatch({type: "setSalary", payload: json})
  //   });
  // }

  return (
    <>
      {children}
      <form onSubmit={handleSubmit}>
        <Edit caption="Id" value={id} name="id" readonly="true" />
        <Combo
          caption="Miesiąc"
          value={salary.miesiac}
          name="miesiac"
          dictionary={miesiace}
          defaultValue={0}
          readonly="true"
          onChange={
            (e) => {
            dispatch({type: "setSalary", payload: {
              ...salary,
              miesiac: miesiace.find((obj) => obj.value === e.target.value)?.id,
            }});
          }}
        />
        <Edit
          caption="Stawka godzinowa netto"
          value={salary.stawka}
          name="stawka"
        />
        <Edit
          caption="Dni robocze w miesiącu"
          value={salary.dniRoboczych}
          name="dniRoboczych"
        />
        <Combo
          caption="Forma opodatkowania"
          value={salary.idFormyOpodatkowania}
          name="idFormyOpodatkowania"
          dictionary={formaOpodatkowania}
          defaultValue={0}
          onChange={(e) => {
            const formaOpodatkowaniaTemp = formaOpodatkowania.find(
              (obj) => obj.value === e.target.value
            );

            dispatch({type:"setSalary", payload:{
              ...salary,
              idFormyOpodatkowania: formaOpodatkowaniaTemp?.id,
              formaOpodatkowania: formaOpodatkowaniaTemp,
            }});
          }}
        />
        <Edit
          caption="Dni przepracowane"
          value={salary.dniPrzepracowanych}
          name="dniPrzepracowanych"
        />
        <Edit
          caption="Składka zdrowotna"
          value={salary.skladkaZdrowotna}
          name="skladkaZdrowotna"
        />
        <Edit caption="Składka ZUS" value={salary.zUS} name="zUS" />
        <Edit caption="Podatek" value={salary.podatek} name="podatek" />
        <Edit caption="Vat" value={salary.vat} name="vat" />
        <br />
        <Edit
          caption="Netto"
          value={salary.netto}
          name="netto"
          readonly="true"
        />
        <Edit
          caption="Pełne netto"
          value={salary.pelneNetto}
          name="pelneNetto"
          readonly="true"
        />
        <Edit
          caption="Na urlopowo-chorobowe"
          value={salary.naUrlopowoChorobowe}
          name="naUrlopowoChorobowe"
          readonly="true"
        />
        <Edit
          caption="Do wypłaty"
          value={salary.doWyplaty}
          name="doWyplaty"
          readonly="true"
        />
        <Edit
          caption="Do rozdysponowania"
          value={salary.doRozdysponowania}
          name="doRozdysponowania"
          readonly="true"
        />
        <button type="submit" onClick={() => dispatch({type: "setTask", payload: TASK.SAVE})/*setTask(TASK.SAVE)*/}>
          Zapisz
        </button>
        <button type="submit" onClick={() => dispatch({type: "setTask", payload: TASK.EVALUATE})/*setTask(TASK.EVALUATE)*/}>
          Oblicz
        </button>
        {id && (
          <button type="submit" onClick={() => dispatch({type: "setTask", payload: TASK.DELETE})/*setTask(TASK.DELETE)*/}>
            Usuń
          </button>
        )}
        {/* {readyForExecute && ExecuteTask()} */}
      </form>
    </>
  );
}

export default TakeSalary;
