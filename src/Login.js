import React, { useEffect } from "react";
import SalaryAPIClient from "./SalaryAPICLient";

function Login(){
    useEffect(()=>{
        console.log('useEffect w Login');
        const requestOptions = {
            method: "POST",
            // mode: "no-cors",
            body: JSON.stringify({username: "admin", password: "admin"})
          };        
        SalaryAPIClient.Login(requestOptions, obj => alert("successfull"))
      },[]);
    return(
        <>    
          <ol>Login</ol>       
        </>
    )
}

export default Login;