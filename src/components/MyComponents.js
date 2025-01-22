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
}) {
  return (
    <div>
      <label>{caption}</label>
      <input
        step="any"
        type={type}
        readOnly={readonly}
        name={name}
        value={value}
        defaultValue={defaultValue}
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
        key={crypto.randomUUID()}
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
