import React, { useState } from "react";
import { Edit } from "./MyComponents";
import { hashSync } from "bcryptjs";
import { useCookies } from "react-cookie";
import { useAuthorize } from "./useAuthorize";
import Loading from "./Loading";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  function handleLoadingChange(isLoading) {
    setIsLoading(isLoading);
  }
  const { authorize, logout } = useAuthorize(handleLoadingChange);
  const [cookies] = useCookies();
  const [authorized, setAuthorized] = useState(cookies.sessionId);

  async function AuthorizateUser(login, haslo) {
    const hashedPassword = hashSync(haslo, "$2a$10$birC1iSgCy1pF17Oa7HXl.");
    setAuthorized(false);
    const res = await authorize(login, hashedPassword);
    res && setAuthorized(true);
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

  return !isLoading ? (
    <form onSubmit={(e) => AuthorizeOrLogout(e, authorized)}>
      <Edit caption="Login" name="login" />
      <Edit caption="Hasło" name="haslo" password="true" />
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
