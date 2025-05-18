import { useState } from "react";

interface Documento {
  titulo: string;
  caminho: string;
}

interface Props {
  userId: string;
  onUploadSuccess: (documentos: Documento[]) => void;
}

export default function PainelUploadDocumentos({ userId, onUploadSuccess }: Props) {
  const [titulo, setTitulo] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const enviar = async () => {
    if (!titulo.trim() || !arquivo) {
      setErro("Preencha o título e selecione um arquivo.");
      return;
    }

    setErro(null);
    setEnviando(true);

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("titulo", titulo);
    formData.append("arquivo", arquivo);

    try {
      const res = await fetch("http://localhost:10000/api/upload-documento/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.documentos) {
        onUploadSuccess(data.documentos);
        setTitulo("");
        setArquivo(null);
      } else {
        setErro(data.erro || "Erro ao salvar documento.");
      }
    } catch (e: any) {
      setErro("Falha na comunicação com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <h2 className="text-lg font-semibold text-indigo-800">📤 Enviar Documento</h2>

      <input
        type="text"
        placeholder="Título do documento"
        className="w-full border rounded p-2"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <input
        type="file"
        className="w-full border rounded p-2"
        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
      />

      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <button
        onClick={enviar}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
