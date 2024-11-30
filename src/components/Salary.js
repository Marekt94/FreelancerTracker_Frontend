import React, { useCallback, useEffect, useReducer } from "react";
import "../css/index.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Edit, Combo } from "./MyComponents";
import { BACKEND_PATHS } from "../Endpoints";
import { useSalary } from "../useSalary";
import { MONTHS, DEF_DICT } from "../Const";
import Loading from "./Loading";
import { useGlobalContext } from "../GlobalContext";
import { DEF_SALARY } from "../Const";

//TODO - gdy robie zapis, odswieza sie strona i scrolluje do góry

const TASK = {
  SAVE: "save",
  EVALUATE: "evaluate",
  DELETE: "delete",
};

const ACTION_TYPE = {
  INIT: "init",
  SET_SALARY: "setSalary",
  SET_TASK: "setTask",
  SUBMIT: "submit",
  AFTER_SUBMIT: "afterSubmit",
};

const initialState = {
  salary: DEF_SALARY,
  miesiace: DEF_DICT,
  formaOpodatkowania: DEF_DICT,
  task: null,
  readyToExecute: false,
  year: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.INIT:
      let miesiace = action.payload.dataForNewSalary.miesiace.map((obj) => ({
        id: obj.iD,
        value: obj.monthName,
      }));
      if (action.payload.year === action.payload.salary.rok && action.payload.salary.miesiac) {
        const currMiesiac = MONTHS.find((obj) => obj.id === action.payload.salary.miesiac);
        miesiace = [...miesiace, { id: currMiesiac.id, value: currMiesiac.value }];
      }
      miesiace.sort((a, b) => a.id - b.id);

      const formaOpodatkowania = action.payload.dataForNewSalary.formaOpodatkowania.map((obj) => ({
        id: obj.id,
        value: obj.nazwa,
        wysokoscPodatku: obj.wysokoscPodatkuList,
      }));

      return {
        ...state,
        salary: action.payload.salary,
        miesiace: miesiace,
        formaOpodatkowania: [DEF_DICT, ...formaOpodatkowania],
      };

    case ACTION_TYPE.SET_SALARY: {
      return { ...state, salary: action.payload };
    }

    case ACTION_TYPE.SET_TASK: {
      return { ...state, task: action.payload };
    }

    case ACTION_TYPE.SUBMIT: {
      return { ...state, readyToExecute: true, salary: action.payload };
    }

    case ACTION_TYPE.AFTER_SUBMIT: {
      return { ...state, readyToExecute: false };
    }

    default:
      throw Error("Unknown action");
  }
}

export function TakeSalary({ children }) {
  const { isLoading, setError, year } = useGlobalContext();
  const initID = useParams().id;
  const [{ salary, formaOpodatkowania, miesiace, task, readyToExecute }, dispatch] = useReducer(reducer, initialState);
  const { getSalary, getDataForNewSalary, saveSalary, evaluate, deleteSalary } = useSalary(setError);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSalary(id) {
      const data = await getSalary(id);
      return data;
    }

    async function fetchDataForNewSalary(year) {
      const data = await getDataForNewSalary(year);
      return data;
    }

    async function fetchData(id) {
      const dataForNewSalary = await fetchDataForNewSalary(year);
      const salary = id ? await fetchSalary(id) : DEF_SALARY;
      const action = {
        type: ACTION_TYPE.INIT,
        payload: {
          salary,
          dataForNewSalary,
          year,
        },
      };
      dispatch(action);
    }

    fetchData(initID);
  }, [year, initID, getDataForNewSalary, getSalary]);

  const DeleteSalary = useCallback(
    async (id) => {
      await deleteSalary(id);
      navigate(BACKEND_PATHS.salariesPath);
    },
    [deleteSalary, navigate]
  );

  const Evaluate = useCallback(async () => {
    const data = await evaluate(salary);
    dispatch({ type: ACTION_TYPE.SET_SALARY, payload: data });
  }, [evaluate, dispatch, salary]);

  const Save = useCallback(async () => {
    salary.rok = year;
    const data = await saveSalary(salary);
    dispatch({
      type: ACTION_TYPE.SET_SALARY,
      payload: { ...salary, id: data.id },
    });
    navigate(`${BACKEND_PATHS.salaryPath}/${data.id}`);
  }, [navigate, salary, saveSalary, year]);

  useEffect(() => {
    function execute() {
      if (readyToExecute) {
        switch (task) {
          case TASK.DELETE:
            console.log("delete");
            DeleteSalary(salary.id);
            dispatch({ type: ACTION_TYPE.AFTER_SUBMIT });
            return 0;
          case TASK.EVALUATE:
            console.log("evaluate");
            Evaluate();
            dispatch({ type: ACTION_TYPE.AFTER_SUBMIT });
            return 0;
          case TASK.SAVE:
            console.log("save");
            Save();
            dispatch({ type: ACTION_TYPE.AFTER_SUBMIT });
            return 0;
          default:
            return 0;
        }
      }
    }

    execute();
  }, [readyToExecute, task, salary.id, DeleteSalary, Evaluate, Save]);

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

    const formaOpodatkowaniaTemp = formaOpodatkowania.find((obj) => obj.value === currFormaOpodatkowania);
    const miesiacTemp = miesiace.find((obj) => obj.value === miesiac);

    const newSalary = {
      ...salary,
      id,
      miesiac: miesiacTemp?.id,
      rok: year,
      idFormyOpodatkowania: formaOpodatkowaniaTemp?.id,
      formaOpodatkowania: {
        id: formaOpodatkowaniaTemp?.id,
        nazwa: formaOpodatkowaniaTemp?.value,
        wysokoscPodatkuList: formaOpodatkowaniaTemp?.wysokoscPodatku,
      },
      stawka,
      dniRoboczych,
      dniPrzepracowanych,
      skladkaZdrowotna,
      zUS,
      podatek,
      vat,
      netto,
      pelneNetto,
      naUrlopowoChorobowe,
      doWyplaty,
      doRozdysponowania,
    };
    console.log(`New salary: ${newSalary}`);
    dispatch({ type: ACTION_TYPE.SUBMIT, payload: newSalary });
  }

  return (
    <>
      {children}
      <form onSubmit={handleSubmit}>
        <Edit caption="Id" value={salary.id} name="id" readonly="true" />
        <Combo
          caption="Miesiąc"
          value={salary.miesiac}
          name="miesiac"
          dictionary={miesiace}
          defaultValue={0}
          readonly={isLoading}
          onChange={(e) => {
            dispatch({
              type: ACTION_TYPE.SET_SALARY,
              payload: {
                ...salary,
                miesiac: miesiace.find((obj) => obj.value === e.target.value)?.id,
              },
            });
          }}
        />
        <Edit caption="Stawka godzinowa netto" value={salary.stawka} name="stawka" readonly={isLoading} />
        <Edit caption="Dni robocze w miesiącu" value={salary.dniRoboczych} name="dniRoboczych" readonly={isLoading} />
        <Combo
          caption="Forma opodatkowania"
          value={salary.idFormyOpodatkowania}
          name="idFormyOpodatkowania"
          dictionary={formaOpodatkowania}
          defaultValue={0}
          readonly={isLoading}
          onChange={(e) => {
            const formaOpodatkowaniaTemp = formaOpodatkowania.find((obj) => obj.value === e.target.value);

            dispatch({
              type: ACTION_TYPE.SET_SALARY,
              payload: {
                ...salary,
                idFormyOpodatkowania: formaOpodatkowaniaTemp?.id,
                formaOpodatkowania: formaOpodatkowaniaTemp,
              },
            });
          }}
        />
        <Edit
          caption="Dni przepracowane"
          value={salary.dniPrzepracowanych}
          name="dniPrzepracowanych"
          readonly={isLoading}
        />
        <Edit
          caption="Składka zdrowotna"
          value={salary.skladkaZdrowotna}
          name="skladkaZdrowotna"
          readonly={isLoading}
        />
        <Edit caption="Składka ZUS" value={salary.zUS} name="zUS" readonly={isLoading} />
        <Edit caption="Podatek" value={salary.podatek} name="podatek" readonly={isLoading} />
        <Edit caption="Vat" value={salary.vat} name="vat" readonly={isLoading} />
        <br />
        <Edit caption="Netto" value={salary.netto} name="netto" readonly="true" />
        <Edit caption="Pełne netto" value={salary.pelneNetto} name="pelneNetto" readonly="true" />
        <Edit
          caption="Na urlopowo-chorobowe"
          value={salary.naUrlopowoChorobowe}
          name="naUrlopowoChorobowe"
          readonly="true"
        />
        <Edit caption="Do wypłaty" value={salary.doWyplaty} name="doWyplaty" readonly="true" />
        <Edit caption="Do rozdysponowania" value={salary.doRozdysponowania} name="doRozdysponowania" readonly="true" />
        <button type="submit" onClick={() => dispatch({ type: ACTION_TYPE.SET_TASK, payload: TASK.SAVE })}>
          Zapisz
        </button>
        <button type="submit" onClick={() => dispatch({ type: ACTION_TYPE.SET_TASK, payload: TASK.EVALUATE })}>
          Oblicz
        </button>
        {salary.id ? (
          <button type="submit" onClick={() => dispatch({ type: ACTION_TYPE.SET_TASK, payload: TASK.DELETE })}>
            Usuń
          </button>
        ) : (
          <></>
        )}
      </form>
      {isLoading && <Loading></Loading>}
    </>
  );
}

export default TakeSalary;
