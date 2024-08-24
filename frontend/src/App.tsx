import Create from './pages/Create';
import Edit from './pages/Edit';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create' element={<Create/>}/>
        <Route path='/edit/:userId' element={<Edit/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
