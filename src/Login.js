import React, { useState } from "react";
import SalaryAPIClient from "./SalaryAPICLient";
import { Edit } from "./MyComponents";
import { hashSync } from "bcryptjs";
import { useCookies } from 'react-cookie';

function Login(){
    const [cookies] = useCookies();
    const [login, setLogin] = useState("");
    const [haslo, setHaslo] = useState("");
    const [authorized, setAuthorized] = useState(cookies.sessionId !== undefined);

    return(
        <>    
          <Edit caption="Login" value={login} name="login" whenUndefined = "" onChange={e => setLogin(e.target.value)}/>
          <Edit caption="Hasło" value={haslo} name="haslo" whenUndefined = "" onChange={e => setHaslo(e.target.value)} password="true"/> 
          <button onClick={() => {
            let hashedPassword = hashSync(haslo, '$2a$10$birC1iSgCy1pF17Oa7HXl.');
            const requestOptions = {
              method: "POST",
              body: JSON.stringify({username: login, password: hashedPassword})
            };        
            setAuthorized(false);
            SalaryAPIClient.Login(requestOptions, () => setAuthorized(true))
          }}>Zaloguj</button> 
          <button onClick={() =>{
            const requestOptions = {
              method: "DELETE"
            };
            SalaryAPIClient.Logout(requestOptions, () => setAuthorized(false));  
          }}>Wyloguj</button>
          {(authorized === true) ? <div><label>Zalogowano</label></div> : <></>}    
        </>
    )
}

export default Login;