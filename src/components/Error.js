import { useNavigate, useRouteError } from "react-router-dom";
import { DEF_ERROR, UNHANDLED_ERROR_CODE, FATAL_ERROR_CODE } from "../Const";
import { useGlobalContext } from "../GlobalContext";
import "../css/index.css";
import { FRONTEND_PATHS } from "../Endpoints";

function Error() {
  const { error: errorContext, setError } = useGlobalContext();
  const errorRouter = useRouteError();
  const navigate = useNavigate();
  let error = {};

  if (errorContext && (errorContext !== DEF_ERROR)){
    error = errorContext;
  }
  else if (errorRouter){
    error = {statusText: errorRouter.data, code: UNHANDLED_ERROR_CODE} 
  }
  else{
    error = {statusText: "Error is not catch neither by error mechanism nor errorElement", code: FATAL_ERROR_CODE} 
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
