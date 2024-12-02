import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = lazy(() => import('./pages/loginPage/loginPage'));
const MainPage = lazy(() => import('./pages/mainPage/mainPage'));

export const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
};
