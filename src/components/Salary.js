import React, { useEffect, useReducer } from "react";
import "../css/index.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Edit, Combo } from "./MyComponents";
import { BACKEND_PATHS } from "../Endpoints";
import { useSalary } from "../useSalary";
import { MONTHS, DEF_DICT } from "../Const";
import { useGlobalContext } from "../GlobalContext";
import { DEF_SALARY } from "../Const";
import YearSelectorWithContext, { useYear } from "./YearSelectorDecorator";

//TODO - gdy robie zapis, odswieza sie strona i scrolluje do góry

const ACTION_TYPE = {
  INIT: "init",
  SET_SALARY: "setSalary",
};

const initialState = {
  salary: DEF_SALARY,
  miesiace: DEF_DICT,
  formaOpodatkowania: DEF_DICT,
  year: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.INIT:
      let miesiace = action.payload.dataForNewSalary.miesiace.map((obj) => ({
        id: obj.iD,
        value: obj.monthName,
      }));
      if (Number(action.payload.year) === action.payload.salary.rok && action.payload.salary.miesiac) {
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
        miesiace,
        formaOpodatkowania,
      };

    case ACTION_TYPE.SET_SALARY: {
      return { ...state, salary: action.payload };
    }

    default:
      throw Error("Unknown action");
  }
}

export function Salary({ children }) {
  const { year } = useYear();
  const { isLoading, setError } = useGlobalContext();
  const initID = useParams().id;
  const [{ salary, formaOpodatkowania, miesiace }, dispatch] = useReducer(reducer, initialState);
  const {
    getSalary,
    getDataForNewSalary,
    saveSalary: saveSalaryInt,
    evaluate: evaluateInt,
    deleteSalary: deleteSalaryInt,
  } = useSalary(setError);
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

  async function deleteSalary() {
    await deleteSalaryInt(salary.id);
    navigate(BACKEND_PATHS.salariesPath);
  }

  async function evaluate() {
    salary.rok = year;
    salary.brutto = 0;
    salary.netto = 0;
    salary.pelneNetto = 0;
    salary.doWyplaty = 0;
    salary.doRozdysponowania = 0;
    salary.naUrlopowoChorobowe = 0;
    const data = await evaluateInt(salary);
    dispatch({
      type: ACTION_TYPE.SET_SALARY,
      payload: data,
    });
  }

  async function saveSalary() {
    salary.rok = year;
    const data = await saveSalaryInt(salary);
    if (data) {
      if (salary && Number(salary.id) !== Number(data.id)) {
        navigate(`${BACKEND_PATHS.salaryPath}/${data.id}`, { replace: true });
      }
      dispatch({
        type: ACTION_TYPE.SET_SALARY,
        payload: { ...salary, id: data.id },
      });
    }
  }

  function onChange(obj) {
    const field = obj.target.name;
    const value = obj.target.value;
    const newSalary = { ...salary, [field]: value };
    dispatch({
      type: ACTION_TYPE.SET_SALARY,
      payload: newSalary,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <YearSelectorWithContext />
      {children}
      <form onSubmit={handleSubmit}>
        <Edit caption="id" onChange={onChange} value={salary.id} name="id" readonly={true} type="number" />
        <Combo
          caption="Miesiąc"
          value={salary.miesiac}
          name="miesiac"
          dictionary={miesiace}
          readonly={isLoading}
          withEmptyOption={true}
          onChange={(e) => {
            dispatch({
              type: ACTION_TYPE.SET_SALARY,
              payload: {
                ...salary,
                miesiac: Number(e.target.value),
              },
            });
          }}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Stawka godzinowa netto"
          onChange={onChange}
          value={salary.stawka}
          name="stawka"
          readonly={isLoading}
          required={true}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Dni robocze w miesiącu"
          onChange={onChange}
          value={salary.dniRoboczych}
          name="dniRoboczych"
          readonly={isLoading}
          required={true}
        />
        <Combo
          caption="Forma opodatkowania"
          value={salary.idFormyOpodatkowania}
          name="idFormyOpodatkowania"
          dictionary={formaOpodatkowania}
          readonly={isLoading}
          required={true}
          onChange={(e) => {
            const formaOpodatkowaniaTemp = formaOpodatkowania.find((obj) => obj.id === Number(e.target.value));
            dispatch({
              type: ACTION_TYPE.SET_SALARY,
              payload: {
                ...salary,
                idFormyOpodatkowania: Number(formaOpodatkowaniaTemp?.id),
                formaOpodatkowania: formaOpodatkowaniaTemp,
              },
            });
          }}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Dni przepracowane"
          onChange={onChange}
          value={salary.dniPrzepracowanych}
          name="dniPrzepracowanych"
          readonly={isLoading}
          required={true}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Składka zdrowotna"
          onChange={onChange}
          value={salary.skladkaZdrowotna}
          name="skladkaZdrowotna"
          readonly={isLoading}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Składka ZUS"
          onChange={onChange}
          value={salary.zUS}
          name="zUS"
          readonly={isLoading}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Podatek"
          onChange={onChange}
          value={salary.podatek}
          name="podatek"
          readonly={isLoading}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Vat"
          onChange={onChange}
          value={salary.vat}
          name="vat"
          readonly={isLoading}
        />
        <br />
        <Edit
          autoComplete="off"
          type="number"
          caption="Netto"
          onChange={onChange}
          value={salary.netto}
          name="netto"
          readonly={true}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Pełne netto"
          onChange={onChange}
          value={salary.pelneNetto}
          name="pelneNetto"
          readonly={true}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Na urlopowo-chorobowe"
          onChange={onChange}
          value={salary.naUrlopowoChorobowe}
          name="naUrlopowoChorobowe"
          readonly={true}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Do wypłaty"
          onChange={onChange}
          value={salary.doWyplaty}
          name="doWyplaty"
          readonly={true}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Do rozdysponowania"
          onChange={onChange}
          value={salary.doRozdysponowania}
          name="doRozdysponowania"
          readonly={true}
        />
        <button onClick={saveSalary}>Zapisz</button>
        <button onClick={evaluate}>Oblicz</button>
        {salary.id ? (
          <button onClick={deleteSalary} formNoValidate={true}>
            Usuń
          </button>
        ) : (
          <></>
        )}
      </form>
    </>
  );
}

export default Salary;
