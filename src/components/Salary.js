import React, { useEffect, useReducer } from "react";
import "../css/index.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Edit, Combo } from "./MyComponents";
import { BACKEND_PATHS } from "../Endpoints";
import { useSalary } from "../useSalary";
import { MONTHS, DEF_DICT, DEF_DICT_VALUE } from "../Const";
import Loading from "./Loading";
import { useGlobalContext } from "../GlobalContext";
import { DEF_SALARY } from "../Const";
import YearSelectorWithContext from "./YearSelectorWithContext";

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

export function TakeSalary({ children }) {
  const { isLoading, setError, year } = useGlobalContext();
  const initID = useParams().id;
  const [{ salary, formaOpodatkowania, miesiace }, dispatch] = useReducer(reducer, initialState);
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

  async function DeleteSalary() {
    await deleteSalary(salary.id);
    navigate(BACKEND_PATHS.salariesPath);
  }

  async function Evaluate(formData) {
    const salary = PackSalary(formData);
    const data = await evaluate(salary);
    dispatch({
      type: ACTION_TYPE.SET_SALARY,
      payload: data,
    });
  }

  async function Save(formData) {
    const salary = PackSalary(formData);
    salary.rok = year;
    const data = await saveSalary(salary);
    if (Number(salary.id) !== Number(data.id)) {
      navigate(`${BACKEND_PATHS.salaryPath}/${data.id}`, { replace: true });
    }
    dispatch({
      type: ACTION_TYPE.SET_SALARY,
      payload: data,
    });
  }

  function PackSalary(formData) {
    const id = formData.get("id");
    const miesiac = formData.get("miesiac");
    const formaOpodatkowaniaTemp = formaOpodatkowania.find((obj) => obj.id === formData.get("idFormyOpodatkowania"));
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

    const newSalary = {
      ...salary,
      id,
      miesiac,
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

    return newSalary;
  }

  return (
    <>
      <YearSelectorWithContext />
      {children}
      <form action={Save}>
        <Edit caption="Id" value={salary.id} name="id" readonly="true" type="number" />
        <Combo
          caption="Miesiąc"
          value={salary.miesiac}
          name="miesiac"
          dictionary={miesiace}
          readonly={isLoading}
          withEmptyOption={false}
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
          defaultValue={salary.stawka}
          name="stawka"
          readonly={isLoading}
          required={true}
        />
        <Edit
          autoComplete="off"
          type="number"
          caption="Dni robocze w miesiącu"
          defaultValue={salary.dniRoboczych}
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
                idFormyOpodatkowania: formaOpodatkowaniaTemp?.id,
                formaOpodatkowania: formaOpodatkowaniaTemp,
              },
            });
          }}
        />
        <Edit
          roundNumberDigit={3}
          autoComplete="off"
          type="number"
          caption="Dni przepracowane"
          defaultValue={salary.dniPrzepracowanych}
          name="dniPrzepracowanych"
          readonly={isLoading}
          required={true}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Składka zdrowotna"
          defaultValue={salary.skladkaZdrowotna}
          name="skladkaZdrowotna"
          readonly={isLoading}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Składka ZUS"
          defaultValue={salary.zUS}
          name="zUS"
          readonly={isLoading}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Podatek"
          defaultValue={salary.podatek}
          name="podatek"
          readonly={isLoading}
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Vat"
          defaultValue={salary.vat}
          name="vat"
          readonly={isLoading}
        />
        <br />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Netto"
          defaultValue={salary.netto}
          name="netto"
          readonly="true"
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Pełne netto"
          defaultValue={salary.pelneNetto}
          name="pelneNetto"
          readonly="true"
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Na urlopowo-chorobowe"
          defaultValue={salary.naUrlopowoChorobowe}
          name="naUrlopowoChorobowe"
          readonly="true"
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Do wypłaty"
          defaultValue={salary.doWyplaty}
          name="doWyplaty"
          readonly="true"
        />
        <Edit
          roundNumberDigit={2}
          autoComplete="off"
          type="number"
          caption="Do rozdysponowania"
          defaultValue={salary.doRozdysponowania}
          name="doRozdysponowania"
          readonly="true"
        />
        <button>Zapisz</button>
        <button formAction={Evaluate}>Oblicz</button>
        {salary.id ? <button formAction={DeleteSalary}>Usuń</button> : <></>}
      </form>
      {isLoading && <Loading></Loading>}
    </>
  );
}

export default TakeSalary;
