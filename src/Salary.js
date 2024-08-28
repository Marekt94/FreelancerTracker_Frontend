import React, { useEffect, useState } from "react";
import "./index.css";
import "./SalaryAPICLient";
import SalaryAPIClient from "./SalaryAPICLient";
import { MONTHS } from "./Dictionaries";
import { useParams } from "react-router-dom";
import { useNavigate, generatePath } from "react-router-dom";
import { Edit, Combo } from "./MyComponents";
import PATHS from "./SalaryClientURL";

const defSalary = {
  id: 0,
  idFormyOpodatkowania: 0,
  formaOpodatkowania: {},
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

const defDict = [{ id: 0, value: "" }];

export function TakeSalary({ children, year }) {
  let params = useParams();
  const [id, setID] = useState(useParams().id);
  const [salary, setSalary] = useState(defSalary);
  const [miesiace, setMiesiace] = useState(defDict);
  const [formaOpodatkowania, setFormaOpodatkowania] = useState(defDict);
  const navigate = useNavigate();

  useEffect(() => {
    const id = params.id;
    console.log("useEffect w take salary");
    SalaryAPIClient.GetDataForNewSalary(year, (obj) => {
      InitSalary(obj, id);
    });
  }, [year, params.id]);

  function InitSalary(json, id) {
    let miesiace = json.miesiace.map((obj) => ({
      id: obj.iD,
      value: obj.monthName,
    }));
    const formaOpodatkowania = json.formaOpodatkowania.map((obj) => ({
      id: obj.id,
      value: obj.nazwa,
      wysokoscPodtku: obj.wysokoscPodatkuList,
    }));
    id &&
      SalaryAPIClient.GetSalary(id, (obj) => {
        let miesiac = miesiace.find((x) => x.id === obj.miesiac);
        if (miesiac === undefined) {
          miesiac = MONTHS.find((x) => x.id === obj.miesiac);
          miesiace = [miesiac, ...miesiace];
          miesiace.sort((a, b) => a.id - b.id);
        }
        setMiesiace([defDict, ...miesiace]);
        setFormaOpodatkowania([defDict, ...formaOpodatkowania]);
        setSalary(obj);
      });
    setMiesiace([defDict, ...miesiace]);
    setFormaOpodatkowania([defDict, ...formaOpodatkowania]);
    setSalary(defSalary);
    setID(id);
  }

  function onZapiszClick() {
    salary.rok = year;

    SalaryAPIClient.SaveSalary(salary, (json) => {
      const tempSalary = { ...salary, id: json.id };
      console.log(tempSalary);
      setSalary(tempSalary);
      setID(json.id);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");

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
      miesiac: miesiacTemp.id,
      idFormyOpodatkowania: formaOpodatkowaniaTemp.id,
      formaOpodatkowania: formaOpodatkowaniaTemp,
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

    console.log(newSalary);
    setSalary(newSalary);
  }

  function onDeleteCLick() {
    SalaryAPIClient.DeleteSalary(salary.id, () =>
      navigate(generatePath(PATHS.salariesPath, { year: year }))
    );
  }

  function onEvaluateClick() {
    SalaryAPIClient.Evaluate(salary, (json) => {
      setSalary(json);
    });
  }

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
        <button type="submit" onClick={onZapiszClick}>
          Zapisz
        </button>
        <button type="submit" onClick={onEvaluateClick}>
          Oblicz
        </button>
        {id && (
          <button type="submit" onClick={onDeleteCLick}>
            Usuń
          </button>
        )}
      </form>
    </>
  );
}

export default TakeSalary;

/*
TODO:
+przerobić wszystkie onChange, żeby wartości się przepisywały przy submit, onSubmit bedzie dla evalute i dla save, bo wykonuje sie przed onClick, onSave, onEvaluate zostanie

- wynieść default salary gdzieś wyżej i przekazywać jako parametr, żeby nie było pobierane za każdym razem
*/
