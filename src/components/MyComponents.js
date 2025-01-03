import { DEF_DICT } from "../Const";

export function Edit({ caption, value, name, type="text", readonly = false, onChange = null, required = false, autoComplete = "on" }) {
  return (
    <div>
      <label>{caption}</label>
      <input
        type={type}
        readOnly={readonly}
        name={name}
        defaultValue={value ? value : undefined}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export function Combo({ caption, value, name, dictionary, readonly = false, onChange = null, required=false }) {
  const dictPosition = dictionary.find((obj) => obj.id === value);
  return (
    <div style={{ flexDirection: "row" }}>
      <label>{caption}</label>
      <select
        name={name}
        disabled={readonly}
        onChange={onChange}
        defaultValue={dictPosition?.value || DEF_DICT}
        required={required}
      >
        {dictionary.map((slownik) => (
          <option>{slownik.value}</option>
        ))}
      </select>
    </div>
  );
}
