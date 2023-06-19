import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientsListPage from './pages/ClientsListPage';
import ClientPage from './pages/ClientPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/clients' element={<ClientsListPage />} />
        <Route path='/client/:id' element={<ClientPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
