import React, { useState } from "react";
import SalaryAPIClient from "./SalaryAPICLient";
import { Edit } from "./MyComponents";
import { hashSync } from "bcryptjs";
import { useCookies } from "react-cookie";

function AuthorizateUser(login, haslo, onLogin) {
  const hashedPassword = hashSync(haslo, "$2a$10$birC1iSgCy1pF17Oa7HXl.");
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({ username: login, password: hashedPassword }),
  };

  onLogin(false);
  SalaryAPIClient.Login(requestOptions, () => onLogin(true));
}

function Logout(onLogout) {
  const requestOptions = {
    method: "DELETE",
  };
  SalaryAPIClient.Logout(requestOptions, () => onLogout(false));
}

function AuthorizeOrLogout(e, authorized, onSubmit) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const login = formData.get("login");
  const haslo = formData.get("haslo");

  authorized ? Logout(onSubmit) : AuthorizateUser(login, haslo, onSubmit);
}

export default function Login() {
  const [cookies] = useCookies();
  const [login, setLogin] = useState("");
  const [haslo, setHaslo] = useState("");
  const [authorized, setAuthorized] = useState(cookies.sessionId);

  return (
    <form onSubmit={(e) => AuthorizeOrLogout(e, authorized, setAuthorized)}>
      <Edit
        caption="Login"
        value={login}
        name="login"
        whenUndefined=""
        onChange={(e) => setLogin(e.target.value)}
      />
      <Edit
        caption="Hasło"
        value={haslo}
        name="haslo"
        whenUndefined=""
        onChange={(e) => setHaslo(e.target.value)}
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
