export const YEARS = [{ year: 2022 }, { year: 2023 }, { year: 2024 }];
export const DEF_YEAR = YEARS[1].year;

export default function YearSelector({ currentYear, onYearChange }) {
  return (
    <select class="select" align="center" defaultValue={currentYear} onChange={(e) => onYearChange(e.target.value)}>
      {YEARS.map((obj) => (
        <option>{obj.year}</option>
      ))}
    </select>
  );
}
