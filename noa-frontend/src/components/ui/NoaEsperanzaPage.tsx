import { useState, useEffect } from 'react';
import PainelImagens from './PainelImagens';
import PainelLogs from './PainelLogs';
import PainelDocumentos from './PainelDocumentos';
import PainelUploadDocumentos from './PainelUploadDocumentos';

type Modelo = 'GPT-3.5' | 'GPT-4' | 'XLNet / Watson';

type LeituraComparativa = {
  arquitetura: string;
  leituraTecnica: string;
  leituraSimbolica: string;
  respostaEsperada: string;
};

type Documento = {
  titulo: string;
  caminho: string;
};

export default function NoaEsperanzaPage() {
  const [fala, setFala] = useState('');
  const [comparativo, setComparativo] = useState<Record<Modelo, LeituraComparativa> | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const userId = 'fernanda.terra';

  const interpretar = () => {
    if (!fala.trim()) return;

    setComparativo({
      'GPT-3.5': {
        arquitetura: 'Autoregressivo, causal, 2022',
        leituraTecnica: 'Tokenização por BPE. Foco em padrões funcionais e instruções.',
        leituraSimbolica: `Interpreta a frase como sintoma funcional direto. Enxerga “${fala}” como indicativo de sobrecarga ou exaustão.`,
        respostaEsperada: `Você relatou: "${fala}". Pode ser sinal de fadiga acumulada. Já pensou em descansar ou rever sua rotina?`,
      },
      'GPT-4': {
        arquitetura: 'Multimodal textual, com raciocínio contextualizado.',
        leituraTecnica: 'Capta ritmo e contexto. Mais sensível à ambiguidade temporal.',
        leituraSimbolica: `Interpreta “${fala}” como descompasso entre tempo vivido e tempo real. Há ruptura narrativa ou cronológica.`,
        respostaEsperada: `Essa fala — "${fala}" — pode indicar um colapso de ritmo interno. Como isso afetou seu corpo e sua percepção?`,
      },
      'XLNet / Watson': {
        arquitetura: 'Não-autoregressivo, bidirecional. Base afetiva ou imagética.',
        leituraTecnica: 'Lê o todo antes da parte. Capta presença corporal e ausências não-ditas.',
        leituraSimbolica: `A frase “${fala}” evoca perda de si ou diluição da presença. O tempo aqui não é linear.`,
        respostaEsperada: `Enquanto dizia: "${fala}", que parte de você estava ausente ou calada?`,
      },
    });
  };

  useEffect(() => {
    fetch(`http://localhost:10000/api/documentos/${userId}`)
      .then(res => res.json())
      .then(data => setDocumentos(data.documentos || []));
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">
          🧪 Comparativo de Leitura por Modelos LLM
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Como diferentes arquiteturas interpretam uma mesma fala? Aqui você vê três linguagens transformando o mesmo enunciado.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-2">✍️ Frase de Entrada</h2>
          <textarea
            className="w-full p-4 rounded-md border text-gray-700 shadow-sm"
            placeholder="Digite uma fala simbólica ou clínica..."
            rows={3}
            value={fala}
            onChange={(e) => setFala(e.target.value)}
          />
          <button
            onClick={interpretar}
            className="mt-4 px-6 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-md"
          >
            Comparar Linguagens
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
          <PainelImagens userId={userId} />
          <PainelUploadDocumentos
            userId={userId}
            onUploadSuccess={(novos) => setDocumentos(novos)}
          />
        </div>
      </div>

      {comparativo && (
        <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          {Object.entries(comparativo).map(([modelo, leitura]) => (
            <div key={modelo} className="bg-white rounded-lg p-5 shadow border border-indigo-100">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">{modelo}</h3>
              <p className="text-sm text-gray-600 italic mb-3">Frase: “{fala}”</p>
              <p className="text-sm text-gray-800"><strong>Arquitetura:</strong> {leitura.arquitetura}</p>
              <p className="text-sm text-gray-800 mt-2"><strong>Leitura Técnica:</strong> {leitura.leituraTecnica}</p>
              <p className="text-sm text-gray-800 mt-2"><strong>Leitura Simbólica:</strong> {leitura.leituraSimbolica}</p>
              <p className="text-sm text-indigo-600 mt-3"><strong>Resposta Esperada:</strong><br /> {leitura.respostaEsperada}</p>
            </div>
          ))}
        </section>
      )}

      <div className="max-w-6xl mx-auto mb-16">
        <PainelDocumentos userId={userId} documentos={documentos} />
      </div>

      <div className="max-w-6xl mx-auto mb-16">
        <PainelLogs />
      </div>

      <footer className="mt-20 text-center text-gray-400 text-sm">
        <p>Nôa Esperanza — Codiretora Figital. 🌱 Comparando modos de escuta simbólica entre tecnologias.</p>
      </footer>
    </div>
  );
}
