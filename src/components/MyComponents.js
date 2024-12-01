import { DEF_DICT } from "../Const";

export function Edit({ caption, value, name, readonly = false, onChange = null, password = false }) {
  return (
    <div>
      <label>{caption}</label>
      <input
        type={password ? "password" : "text"}
        readOnly={readonly}
        name={name}
        defaultValue={value ? value : undefined}
        onChange={onChange}
      />
    </div>
  );
}

export function Combo({ caption, value, name, dictionary, readonly = false, onChange = null }) {
  const dictPosition = dictionary.find((obj) => obj.id === value);
  return (
    <div style={{ flexDirection: "row" }}>
      <label>{caption}</label>
      <select
        name={name}
        disabled={readonly}
        onChange={onChange}
        value={dictPosition?.value || DEF_DICT}
      >
        {dictionary.map((slownik) => (
          <option>{slownik.value}</option>
        ))}
      </select>
    </div>
  );
}
