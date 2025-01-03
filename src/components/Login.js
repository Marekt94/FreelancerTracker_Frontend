import React, { useEffect, useState } from "react";
import { Edit } from "./MyComponents";
import { hashSync } from "bcryptjs";
import { useCookies } from "react-cookie";
import { useAuthorize } from "../useAuthorize";
import Loading from "./Loading";
import { useGlobalContext } from "../GlobalContext";

export default function Login() {
  const [cookies] = useCookies();
  const { isLoading, setError } = useGlobalContext();
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

  function AuthorizeOrLogout(e, authorized) {
    const formData = new FormData(e.target);
    const login = formData.get("login");
    const haslo = formData.get("haslo");

    authorized ? Logout() : AuthorizateUser(login, haslo);
  }

  return !isLoading ? (
    <form action={(e) => AuthorizeOrLogout(e, authorized)}>
      <Edit caption="Login" name="login" required="true" />
      <Edit caption="Hasło" name="haslo" type="password" />
      <button type="submit">{authorized ? "Wyloguj" : "Zaloguj"}</button>
      {authorized && (
        <div>
          <label>Zalogowano</label>
        </div>
      )}
    </form>
  ) : (
    <>
      <Loading />
    </>
  );
}
