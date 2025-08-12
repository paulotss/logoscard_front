import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../http";

const RouteGuard = ({ children }) => {
  const LEVEL = 2;
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const hasJWT = async () => {
      setIsLoading(true);
      try {
        const auth = sessionStorage.getItem("auth");
        const { data } = await axios.get("/users/auth/verify", {
          headers: {
            authorization: auth,
          },
        });
        data.payload.accessLevel < LEVEL ? setFlag(true) : setFlag(false);
      } catch (error) {
        setFlag(false);
      }
      setIsLoading(false);
    };
    hasJWT();
  }, [flag]);

  return !isLoading ? (
    flag ? (
      children
    ) : (
      <Navigate to={`/login`} replace={true} />
    )
  ) : null;
};

export default RouteGuard;
