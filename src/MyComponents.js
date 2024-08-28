export function Edit({
  caption,
  value,
  name,
  readonly = false,
  onChange = null,
  password = false,
}) {
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

export function Combo({
  caption,
  name,
  dictionary,
  readonly = false,
  onChange = null,
}) {
  return (
    <div style={{ flexDirection: "row" }}>
      <label>{caption}</label>
      <select name={name} readOnly={readonly} onChange={onChange}>
        {dictionary.map((slownik) => (
          <option>{slownik.value}</option>
        ))}
      </select>
    </div>
  );
}
