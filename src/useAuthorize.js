import { SERVER_ADRESS } from "./Constants";

export function useAuthorize(){
    async function authorize(login, password){
        console.log(`login ${login} haslo ${password}`);
        const URL = SERVER_ADRESS + "login";
    
        const requestOptions = {
          method: "POST",
          body: JSON.stringify({ username: login, password: password }),
        };
    
        const res = await fetch(URL);
        const data = await res.json();
        return data;
      }
    
      async function logout(){
        const URL = SERVER_ADRESS + "logout";
    
        const requestOptions = {
          method: "DELETE",
        };
    
        const res = await fetch(URL);
        const data = await res.json();
        return data;
      }
    
    return {authorize, logout};
}