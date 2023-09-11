import { Navigate } from 'react-router-dom';
import axios from '../http';

const RouteGuard = ({ children }) => {
  const hasJWT = () => {
    let flag = false;
    try {
      const auth = sessionStorage.getItem('auth');
      axios.get('/auth/verify',
      {
        headers: {
          authorization: auth,
        },
      })
      flag = true;
    } catch (error) {
      flag = false;
    }
    return flag;
  }

  if (hasJWT()) {
    return children;
  }

  return <Navigate to={`/login`} replace={true} />
}

export default RouteGuard;
