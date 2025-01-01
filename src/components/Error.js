import { useNavigate } from "react-router-dom";
import { UNHANDLED_ERROR_CODE } from "../Const";
import { useGlobalContext } from "../GlobalContext";
import "../css/index.css";
import { FRONTEND_PATHS } from "../Endpoints";

function Error() {
  const { error, setError } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className="content">
      <div>
        Error {error.code}: {error.statusText}
      </div>
      <button
        onClick={() => {
          setError(false);
          if (error.code === UNHANDLED_ERROR_CODE || (error.code >= 400 && error.code <= 404)) {
            navigate(FRONTEND_PATHS.login);
          }
        }}
      >
        Return
      </button>
    </div>
  );
}

export default Error;
