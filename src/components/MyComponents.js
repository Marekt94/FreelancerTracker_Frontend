import { DEF_DICT } from "../Const";

export function Edit({
  caption,
  value,
  defaultValue,
  name,
  onChange = undefined,
  type = "text",
  readonly = false,
  required = false,
  autoComplete = "on",
  roundNumberDigit = 0,
}) {
  function round(value) {
    if (type === "number" && roundNumberDigit !== 0) {
      return Number(value).toFixed(roundNumberDigit);
    } else {
      return Number(value);
    }
  }
  return (
    <div>
      <label>{caption}</label>
      <input
        step="any"
        type={type}
        readOnly={readonly}
        name={name}
        value={value ? round(value) : undefined}
        defaultValue={defaultValue ? round(defaultValue) : undefined}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export function Combo({
  caption,
  value,
  defaultValue,
  name,
  dictionary,
  withEmptyOption = true,
  onChange = undefined,
  readonly = false,
  required = false,
}) {
  return (
    <div style={{ flexDirection: "row" }}>
      <label>{caption}</label>
      <select
        name={name}
        disabled={readonly}
        onChange={onChange}
        required={required}
        value={value || undefined}
        defaultValue={defaultValue || undefined}
      >
        {withEmptyOption ? <option key={undefined}></option> : <></>}
        {dictionary.map((slownik) => (
          <option key={slownik?.id} value={slownik?.id}>
            {slownik?.value}
          </option>
        ))}
      </select>
    </div>
  );
}
