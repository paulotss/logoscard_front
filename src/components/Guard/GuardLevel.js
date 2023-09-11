import { useEffect, useState } from 'react';
import axios from '../../http';

const GuardLevel = ({ children, level }) => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const hasJWT = async () => {
      try {
        const auth = sessionStorage.getItem('auth');
        const { data } = await axios.get('/auth/verify',
        {
          headers: {
            authorization: auth,
          },
        });
        data.payload.accessLevel === level ? setFlag(true) : setFlag(false);
      } catch (error) {
        return false
      }
    }
    hasJWT();
  }, [flag, level]);

  return flag ? children : null;
}

export default GuardLevel;
