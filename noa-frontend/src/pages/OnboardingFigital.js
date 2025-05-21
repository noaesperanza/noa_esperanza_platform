import { useState } from 'react';
import { ethers } from 'ethers';

export default function OnboardingFigital() {
  const [carteira, setCarteira] = useState(null);
  const [autorizado, setAutorizado] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState(null);

  const conectarMetamask = async () => {
    if (!window.ethereum) {
      alert("Metamask não encontrada.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contas = await provider.send("eth_requestAccounts", []);
      const carteiraConectada = contas[0];
      setCarteira(carteiraConectada);
      verificarAcesso(carteiraConectada);
    } catch (e) {
      setErro("Erro ao conectar carteira.");
    }
  };

  const verificarAcesso = async (endereco) => {
    setVerificando(true);
    setErro(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/verificar-nft-onchain/${endereco}`);
      const dados = await res.json();
      setAutorizado(dados.possui_nft || false);
    } catch (e) {
      setErro("Erro ao verificar NFT.");
    } finally {
      setVerificando(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">🚪 Portal Figital – Nôa Esperanza</h2>

      {!carteira && (
        <button
          onClick={conectarMetamask}
          className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
        >
          Conectar Metamask
        </button>
      )}

      {carteira && (
        <div className="mt-4">
          <p className="text-gray-600">Carteira: {carteira}</p>
          {verificando ? (
            <p>Verificando acesso...</p>
          ) : autorizado ? (
            <p className="text-green-700 font-bold mt-2">✅ Acesso Liberado — NFT Validado</p>
          ) : (
            <p className="text-red-600 mt-2">
              ❌ NFT não encontrado. Você pode começar sua jornada pela escuta clínica agora.
            </p>
          )}
        </div>
      )}

      {erro && <p className="text-red-500 mt-2">{erro}</p>}
    </div>
  );
}
