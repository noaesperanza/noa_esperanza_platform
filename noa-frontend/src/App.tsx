import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Jornada from './pages/Jornada';
import Avaliacao from './pages/Avaliacao';
import Queixa from './pages/Queixa';
import Desenvolvimento from './pages/Desenvolvimento';
import Pregressa from './pages/Pregressa';
import Familiar from './pages/Familiar';
import Habitos from './pages/Habitos';
import Alergias from './pages/Alergias';
import Fechamento from './pages/Fechamento';
import RelatorioAvaliacaoInicial from './pages/RelatorioAvaliacaoInicial';
import DashboardKPIs from './components/ui/DashboardKPIs';

// ✅ Novo painel figital
import NoaEsperanzaPage from './components/ui/NoaEsperanzaPage';

import './index.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jornada" element={<Jornada />} />
      <Route path="/avaliacao" element={<Avaliacao />} />
      <Route path="/queixa" element={<Queixa />} />
      <Route path="/desenvolvimento" element={<Desenvolvimento />} />
      <Route path="/pregressa" element={<Pregressa />} />
      <Route path="/familiar" element={<Familiar />} />
      <Route path="/habitos" element={<Habitos />} />
      <Route path="/alergias" element={<Alergias />} />
      <Route path="/fechamento" element={<Fechamento />} />
      <Route path="/relatorio" element={<RelatorioAvaliacaoInicial />} />
      <Route path="/painel" element={<DashboardKPIs />} />

      {/* ✅ Nova rota do painel figital */}
      <Route path="/figital" element={<NoaEsperanzaPage />} />
    </Routes>
  );
}
