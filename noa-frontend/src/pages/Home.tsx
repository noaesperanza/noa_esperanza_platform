import logoGif from '@/assets/Logo Plataforma 2.0.gif';
import logoBtn from '@/assets/logo-noa-triangulo.gif';
import avatarNoa from '@/assets/avatar-noa-gpt.jpg'; // 🔄 corrigido aqui
import GraficoBarras from '@/pages/GraficoBarras';
import GraficoPizza from '@/pages/GraficoPizza';
import DashboardKPIs from '@/components/ui/DashboardKPIs';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex flex-col items-center px-4 py-12 relative">
      {/* NFT institucional no topo */}
      <div className="absolute top-4 left-4">
        <img src={logoGif} alt="Nôa Logo" className="h-14 w-14 rounded-full shadow-md" />
      </div>

      {/* Avatar da Nôa com link embutido */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => window.open('https://platform.openai.com/playground?mode=chat', '_blank')}
      >
        <img
          src={avatarNoa}
          alt="Fale com a Nôa"
          className="h-20 w-20 rounded-full border-2 border-fuchsia-700 shadow-lg hover:scale-105 transition"
        />
      </div>

      {/* Título e introdução */}
      <div className="text-center max-w-2xl mt-12">
        <h1 className="text-4xl font-bold text-rose-700 mb-4">Plataforma Nôa Esperanza</h1>
        <p className="text-lg text-zinc-700">
          Cuidar é criar presença. Acompanhe nossos indicadores atualizados em tempo real.
        </p>
      </div>

      {/* Painel de KPIs */}
      <div className="mt-12 w-full max-w-5xl">
        <DashboardKPIs />
      </div>

      {/* Gráficos de simulação */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <GraficoBarras />
        <GraficoPizza />
      </div>

      {/* NFT institucional no rodapé com link para blockchain */}
      <div className="absolute bottom-4 right-4 cursor-pointer">
        <a
          href="https://zora.co/collect/base:0x9020fcd1cb8474186315295dd91444c40a62bfeb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logoBtn}
            alt="NFT Plataforma"
            className="h-12 w-12 rounded-lg shadow-md hover:scale-105 transition"
          />
        </a>
      </div>

      <footer className="mt-32 text-center text-sm text-zinc-400">
        <p>Versão 2.0 — Painel Institucional da Nôa Esperanza</p>
      </footer>
    </div>
  );
}
