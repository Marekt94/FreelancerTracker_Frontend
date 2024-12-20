export const YEARS = [{ year: 2022 }, { year: 2023 }, { year: 2024 }, { year: 2025 }];
export const DEF_YEAR = YEARS[2].year;

export default function YearSelector({ currentYear, onYearChange }) {
  return (
    <select class="select" align="center" defaultValue={currentYear} onChange={(e) => onYearChange(e.target.value)}>
      {YEARS.map((obj) => (
        <option>{obj.year}</option>
      ))}
    </select>
  );
}
