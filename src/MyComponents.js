export function Edit({caption, value, name, readonly = false, onChange = null, whenUndefined = 0}){
    return(
      <div>
          <label>{caption}</label>
          <input readonly={readonly} name={name} value={value === undefined ? whenUndefined : value} defaultValue={value} onChange={onChange}/>   
      </div>
    );
}

export function Combo({caption, value, name, dictionary, defaultValue = null, readonly = false, onChange = null}){
    let dictPosition = dictionary.find(x => x.id === value); 
    if (dictPosition === undefined){
      dictPosition = {id : -1, value : defaultValue}
    }
    return(
      <div style={{flexDirection : "row"}}>
          <label>{caption}</label>
          <select value={dictPosition.value} name={name} readonly={readonly} onChange={onChange}>
            {dictionary.map((slownik) => <option>{slownik.value}</option>)}
          </select>
      </div>    
    );
  }