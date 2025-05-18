import { useState, useEffect } from 'react';

type PainelImagensProps = {
  userId: string;
};

export default function PainelImagens({ userId }: PainelImagensProps) {
  const [imagem, setImagem] = useState<string | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    fetch(`/api/imagens/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.imagens && data.imagens.length > 0) {
          setImagem(data.imagens[0]);
        }
      });
  }, [userId]);

  const enviarImagem = async () => {
    if (!arquivo) return;

    const formData = new FormData();
    formData.append('imagem', arquivo);

    const res = await fetch(`/upload-imagem/?user_id=${userId}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setImagem(data.path);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Painel de Imagens</h2>

      {imagem && (
        <img src={imagem} alt="Imagem do usuário" className="rounded shadow" />
      )}

      <input
        type="file"
        onChange={e => setArquivo(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={enviarImagem}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enviar nova imagem
      </button>
    </div>
  );
}
