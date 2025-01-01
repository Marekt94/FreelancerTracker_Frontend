import { useNavigate, useRouteError } from "react-router-dom";
import { UNHANDLED_ERROR_CODE } from "../Const";
import { useGlobalContext } from "../GlobalContext";
import "../css/index.css";
import { FRONTEND_PATHS } from "../Endpoints";

function Error() {
  const { error: errorContext, setError } = useGlobalContext();
  const errorRouter = useRouteError();
  const navigate = useNavigate();
  const error = {};

  if (!errorRouter){
    error.statusText = errorContext?.statusText;
    error.code = UNHANDLED_ERROR_CODE;
  }
  else
  {
    error.statusText = errorRouter.data;
    error.code = errorRouter.status;
  }

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
