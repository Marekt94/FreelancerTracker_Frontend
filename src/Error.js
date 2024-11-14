import { useGlobalContext } from "./GlobalContext";

function Error({ children }) {
  const { setError } = useGlobalContext();
  return (
    <>
      <div>
        Error {children.code}: {children.statusText}
      </div>
      <button onClick={() => setError(false)}>Return</button>
    </>
  );
}

export default Error;
