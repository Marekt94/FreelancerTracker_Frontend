import { useNavigate } from "react-router-dom";
import { UNHANDLED_ERROR_CODE } from "../Const";
import { useGlobalContext } from "../GlobalContext";
import "../css/index.css";
import { FRONTEND_PATHS } from "../Endpoints";

function Error({ children }) {
  const { setError } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <div className="content">
      <div>
        Error {children.code}: {children.statusText}
      </div>
      <button
        onClick={() => {
          setError(false);
          if (children.code === UNHANDLED_ERROR_CODE || (children.code > 400 && children.code < 404)) {
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
