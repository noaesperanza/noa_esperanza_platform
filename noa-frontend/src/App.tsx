import { Routes, Route } from 'react-router-dom';
import Home from './components/ui/Home';
import HomeKPI from './components/ui/HomeKPI';
import NoaChat from './pages/NoaChat';
import PainelPorEixo from './pages/PainelPorEixo';
import NFTViewer from './pages/NFTViewer'; // ✅ Importando o NFTViewer

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-yellow-50 p-6">
            <div className="grid grid-cols-3 items-center justify-center gap-8 w-full max-w-7xl">
              {/* Coluna da Home */}
              <div className="flex justify-center">
                <Home />
              </div>

              {/* Coluna do Painel */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md">
                  <h2 className="text-xl font-semibold text-center text-rose-900 mb-4">
                    Indicadores da Jornada de Escuta
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <HomeKPI />
                  </div>
                </div>
              </div>

              {/* Coluna do NFT */}
              <div className="flex justify-center">
                <a
                  href="https://zora.co/collect/nft"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/gif_logo.gif"
                    alt="NFT Logo"
                    className="w-32 h-32 rounded-xl shadow-md hover:scale-110 transition"
                  />
                </a>
              </div>
            </div>
          </div>
        }
      />

      {/* Rota para o chat com Nôa */}
      <Route path="/chat" element={<NoaChat />} />

      {/* Rota para o painel temático */}
      <Route path="/painel-entrevistas" element={<PainelPorEixo />} />

      {/* ✅ Rota adicionada para o visualizador de NFT */}
      <Route path="/NFTViewer" element={<NFTViewer />} />
    </Routes>
  );
}
