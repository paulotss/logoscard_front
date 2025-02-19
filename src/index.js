import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import RouteGuard from './components/RouteGuard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ClientsListPage from './pages/ClientsListPage';
import ClientPage from './pages/ClientPage';
import NewClientForm from './pages/NewClientForm';
import BenefitsPage from './pages/BenefitsPage';
import InvoicePage from './pages/InvoicePage';
import AddPlanPage from './pages/AddPlanPage';
import DependentPage from './pages/DependentPage';
import DependentsListPage from './pages/DependentsListPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CashFlowPage from './pages/CashFlowPage';
import NewCardForm from './pages/NewCardForm';

const router = createBrowserRouter([
  {
    path:"/",
    element: <RouteGuard><HomePage /></RouteGuard>
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/clients",
    element: <RouteGuard><ClientsListPage /></RouteGuard>
  },
  {
    path: "/client/:id",
    element: <RouteGuard><ClientPage /></RouteGuard>
  },
  {
    path: "/client/create",
    element: <RouteGuard><NewClientForm /></RouteGuard>
  },
  {
    path: "/client/benefit/:id",
    element: <RouteGuard><BenefitsPage /></RouteGuard>
  },
  {
    path: "/invoice/:id",
    element: <RouteGuard><InvoicePage /></RouteGuard>
  },
  {
    path: "/plan/add/:userId",
    element: <RouteGuard><AddPlanPage /></RouteGuard>
  },
  {
    path: "/dependent/:id",
    element: <RouteGuard><DependentPage /></RouteGuard>
  },
  {
    path: "/dependents",
    element: <RouteGuard><DependentsListPage /></RouteGuard>
  },
  {
    path: "/cashflow",
    element: <RouteGuard><CashFlowPage /></RouteGuard>
  },
  {
    path: "/card/create",
    element: <RouteGuard><NewCardForm /></RouteGuard>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
