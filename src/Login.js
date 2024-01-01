import React, { useState } from "react";
import SalaryAPIClient from "./SalaryAPICLient";
import { Edit } from "./MyComponents";

function Login(){
    const [login, setLogin] = useState("");
    const [haslo, setHaslo] = useState("");
    const [authorized, setAuthorized] = useState(false);

    return(
        <>    
          <Edit caption="Login" value={login} name="login" whenUndefined = "" onChange={e => setLogin(e.target.value)}/>
          <Edit caption="Hasło" value={haslo} name="haslo" whenUndefined = "" onChange={e => setHaslo(e.target.value)}/> 
          <button onClick={() => {
            const requestOptions = {
              method: "POST",
              body: JSON.stringify({username: login, password: haslo})
            };        
            setAuthorized(false);
            SalaryAPIClient.Login(requestOptions, () => setAuthorized(true))
          }}>Zaloguj</button> 
          {(authorized === true) ? <div><label>Zalogowano</label></div> : <></>}    
        </>
    )
}

export default Login;