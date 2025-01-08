import React, { useEffect, useState } from "react";
import { Edit } from "./MyComponents";
import { hashSync } from "bcryptjs";
import { useCookies } from "react-cookie";
import { useAuthorize } from "../useAuthorize";
import { useGlobalContext } from "../GlobalContext";

export default function Login() {
  const [cookies] = useCookies();
  const { setError } = useGlobalContext();
  const [authorized, setAuthorized] = useState(cookies.sessionId);
  const { authorize, logout } = useAuthorize(setError);

  async function AuthorizateUser(login, haslo) {
    const hashedPassword = hashSync(haslo, "$2a$10$birC1iSgCy1pF17Oa7HXl.");
    setAuthorized(false);
    authorize(login, hashedPassword);
  }

  useEffect(() => {
    setAuthorized(cookies.sessionId);
  }, [cookies.sessionId]);

  async function Logout() {
    await logout();
  }

  function AuthorizeOrLogout(formData, authorized) {
    const login = formData.get("login");
    const haslo = formData.get("haslo");

    authorized ? Logout() : AuthorizateUser(login, haslo);
  }

  return (
    <form action={(e) => AuthorizeOrLogout(e, authorized)}>
      <Edit caption="Login" name="login" required={!authorized} />
      <Edit caption="Hasło" name="haslo" type="password" />
      <button type="submit">{authorized ? "Wyloguj" : "Zaloguj"}</button>
      {authorized && (
        <div>
          <label>Zalogowano</label>
        </div>
      )}
    </form>
  );
}
