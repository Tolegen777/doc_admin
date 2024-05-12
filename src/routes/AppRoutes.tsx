import {Route, Routes, useNavigate} from 'react-router-dom';
import {useStateContext} from '../contexts';
import {routesList} from './routesList';
import {LoginPage} from "../pages/LoginPage/LoginPage.tsx";
import {useEffect} from "react";
import {tokenService} from "../services/tokenService.ts";
import ClientLayout from "../components/ClientLayout/ClientLayout.tsx";

export const AppRoutes = () => {
  const { state, dispatch } = useStateContext();
  const accessToken = tokenService.getLocalAccessToken()
    const navigate = useNavigate()

  useEffect(() => {
      if (!state.authUser && accessToken) {
          dispatch({
              type: 'SET_AUTH_STATUS',
              payload: true
          })
      }
  }, [accessToken])

    useEffect(() => {
        if (!state.authUser && !accessToken?.length) {
            navigate('/login')
        }
    }, [accessToken])

  if (!state.authUser) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <ClientLayout>
      <Routes>
        {routesList.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </ClientLayout>
  );
};
