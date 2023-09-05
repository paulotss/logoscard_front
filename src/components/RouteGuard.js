import { Navigate } from "react-router-dom";

const RouteGuard = ({ children }) => {
  const hasJWT = () => {
    let flag = false;
    const auth = sessionStorage.getItem('auth');
    auth ? flag = true : flag = false;
    return flag;
  }

  if (hasJWT()) {
    return children;
  }

  return <Navigate to={`/login`} replace={true} />
}

export default RouteGuard;
