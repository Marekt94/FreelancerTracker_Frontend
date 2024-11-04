import React, { useReducer, useState } from "react";
import { Edit } from "./MyComponents";
import { hashSync } from "bcryptjs";
import { useCookies } from "react-cookie";
import { useAuthorize } from "./useAuthorize";

export default function Login() {
  const {authorize, logout} = useAuthorize();
  const [cookies] = useCookies();
  const [authorized, setAuthorized] = useState(cookies.sessionId)

  async function AuthorizateUser(login, haslo) {
    const hashedPassword = hashSync(haslo, "$2a$10$birC1iSgCy1pF17Oa7HXl.");
    setAuthorized(false);
    await authorize(login, hashedPassword);
    setAuthorized(true);
  }
  
  async function Logout() {
    await logout();
    setAuthorized(false);
  }
  
  function AuthorizeOrLogout(e, authorized) {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const login = formData.get("login");
    const haslo = formData.get("haslo");
  
    authorized ? Logout() : AuthorizateUser(login, haslo);
  }

  return (
    <form onSubmit={(e) => AuthorizeOrLogout(e, authorized)}>
      <Edit
        caption="Login"
        name="login"
        whenUndefined=""
      />
      <Edit
        caption="Hasło"
        name="haslo"
        //TODO - whenUndefined? zastanowić się, czy potrzebne
        whenUndefined=""
        password="true"
      />
      <button type="submit">{authorized ? "Wyloguj" : "Zaloguj"}</button>
      {authorized && (
        <div>
          <label>Zalogowano</label>
        </div>
      )}
    </form>
  );
}
