import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Imports de Componentes
import RouteGuard from './components/RouteGuard';

// Imports de Páginas
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
import CashFlowPage from './pages/CashFlowPage';
import NewCardForm from './pages/NewCardForm';
import NotFoundPage from './pages/NotFoundPage';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Layout protegido que usa RouteGuard
const ProtectedLayout = () => (
  <RouteGuard>
    <Outlet />
  </RouteGuard>
);

const router = createBrowserRouter([
  // Rotas Públicas
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/card/create/:id/:selectedPlanId",
    element: <NewCardForm />
  },
  // Rota de "Não Encontrado"
  {
    path: "*",
    element: <NotFoundPage />
  },

  // Rotas Protegidas
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/clients", element: <ClientsListPage /> },
      { path: "/client/:id", element: <ClientPage /> },
      { path: "/client/create", element: <NewClientForm /> },
      { path: "/client/benefit/:id", element: <BenefitsPage /> },
      { path: "/invoice/:id", element: <InvoicePage /> },
      { path: "/plan/add/:userId", element: <AddPlanPage /> },
      { path: "/dependent/:id", element: <DependentPage /> },
      { path: "/dependents", element: <DependentsListPage /> },
      { path: "/cashflow", element: <RouteGuard level={0}><CashFlowPage /></RouteGuard>  },
      // Se você tiver uma rota que precise de um nível de acesso específico,
      // você pode fazer assim:
      // {
      //   path: "/admin",
      //   element: <RouteGuard level={0}><AdminPage /></RouteGuard>
      // }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>
);

reportWebVitals();