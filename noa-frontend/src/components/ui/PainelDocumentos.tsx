import { useEffect, useState } from 'react';

type Documento = {
  titulo: string;
  caminho: string;
};

interface Props {
  userId: string;
  documentos?: Documento[];
}

export default function PainelDocumentos({ userId, documentos }: Props) {
  const [lista, setLista] = useState<Documento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Se documentos vierem por props (ex: após upload), prioriza
    if (documentos && documentos.length >= 0) {
      setLista(documentos);
      setCarregando(false);
      return;
    }

    // Caso contrário, buscar da API
    setCarregando(true);
    fetch(`/api/documentos/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar documentos');
        return res.json();
      })
      .then(data => {
        setLista(data.documentos || []);
        setErro(null);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [userId, documentos]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">📂 Documentos Enviados</h2>

      {carregando && <p className="text-gray-500">Carregando documentos...</p>}
      {erro && <p className="text-red-500">Erro: {erro}</p>}

      {!carregando && lista.length === 0 && (
        <p className="text-gray-600">Nenhum documento enviado ainda.</p>
      )}

      <div className="space-y-2">
        {lista.map((doc, index) => (
          <div key={index} className="bg-white p-3 rounded shadow border border-gray-100">
            <p className="font-medium text-gray-700">{doc.titulo}</p>

            {doc.caminho.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={doc.caminho}
                alt={doc.titulo}
                className="mt-2 rounded max-w-full h-auto border"
              />
            ) : (
              <a
                href={doc.caminho}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline text-sm mt-2 inline-block"
              >
                📎 Ver documento
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
