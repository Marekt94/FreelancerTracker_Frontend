export const DEF_ERROR = { code: 0, statusText: "" };
export const DEF_SALARY = {
  id: null,
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
  rok: 0,
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
export const MONTHS = [
  { id: 1, value: "styczeń" },
  { id: 2, value: "luty" },
  { id: 3, value: "marzec" },
  { id: 4, value: "kwiecień" },
  { id: 5, value: "maj" },
  { id: 6, value: "czerwiec" },
  { id: 7, value: "lipiec" },
  { id: 8, value: "sierpień" },
  { id: 9, value: "wrzesień" },
  { id: 10, value: "październik" },
  { id: 11, value: "listopad" },
  { id: 12, value: "grudzień" },
];

export const DEF_DICT = [{ id: 0, value: "" }];

export const UNHANDLED_ERROR_CODE = "unhandled";
export const FATAL_ERROR_CODE = "FATAL ERROR";
