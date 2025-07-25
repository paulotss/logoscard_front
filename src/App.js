import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientsListPage from './pages/ClientsListPage';
import ClientPage from './pages/ClientPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import InvoicePage from './pages/InvoicePage';
import NotFoundPage from './pages/NotFoundPage';
import NewClientForm from './pages/NewClientForm';
import BenefitsPage from './pages/BenefitsPage';
import NewCardForm from './pages/NewCardForm';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/clients' element={<ClientsListPage />} />
        <Route path='/client/:id' element={<ClientPage />} />
        <Route path='/client/create' element={<NewClientForm />} />
        <Route path='/client/benefit/:id' element={<BenefitsPage />} />
        <Route path='/invoice/:id' element={<InvoicePage />} />
        <Route path='/404' element={<NotFoundPage />} />
        <Route path='/card/create/:id/:selectedPlanId' element={<NewCardForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
