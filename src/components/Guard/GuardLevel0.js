import { useEffect, useState } from 'react';
import axios from '../../http';

const GuardLevel0 = ({ children }) => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const hasJWT = async () => {
      try {
        const auth = sessionStorage.getItem('auth');
        const { data } = await axios.get('http://localhost:3001/auth/verify',
        {
          headers: {
            authorization: auth,
          },
        });
        console.log(data);
        data.payload.accessLevel === 1 ? setFlag(true) : setFlag(false);
      } catch (error) {
        return false
      }
      return flag;
    }
    hasJWT();
  }, [flag]);

  return flag ? children : null;
}

export default GuardLevel0;
