import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Editor />} />
    </Routes>
  );
}

export default App;
