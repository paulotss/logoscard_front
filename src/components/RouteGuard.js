import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from '../http';

// O 'level' agora é opcional. Se não for passado, ele só verifica o login.
const RouteGuard = ({ children, level }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAccess = async () => {
      const token = sessionStorage.getItem('auth');

      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('/api/users/verify', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        // Se 'level' foi fornecido, verifica o nível de acesso.
        // Se não, só o fato do token ser válido já autoriza.
        if (level === undefined || (data.user && data.user.accessLevel === level)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Falha na autenticação:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [location.pathname, level]); // Roda a verificação quando a rota ou o nível mudam

  if (isLoading) {
    return null; // Ou um spinner de carregamento
  }

  // Se autorizado, mostra a página. Se não, redireciona para o login.
  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default RouteGuard;