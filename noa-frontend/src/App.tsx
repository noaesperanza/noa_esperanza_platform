import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NoaChat from './pages/NoaChat';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<NoaChat />} />
    </Routes>
  );
}
