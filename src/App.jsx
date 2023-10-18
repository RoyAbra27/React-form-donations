import Form from './components/Form/Form';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Form />} />
        <Route path='/update' element={<Form updateForm={true} />} />
      </Routes>
    </BrowserRouter>
  );
}
