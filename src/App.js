import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientsListPage from './pages/ClientsListPage';
import ClientPage from './pages/ClientPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import InvoicePage from './pages/InvoicePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/clients' element={<ClientsListPage />} />
        <Route path='/client/:id' element={<ClientPage />} />
        <Route path='/invoice/:id' element={<InvoicePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
