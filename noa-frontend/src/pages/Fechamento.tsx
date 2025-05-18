import { useAvaliacao } from '../hooks/useAvaliacao'

export default function Fechamento() {
  const { dados, resetar } = useAvaliacao()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-100 via-rose-50 to-amber-100 text-gray-800">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h2 className="text-2xl font-semibold text-rose-700">
          Fechamento Consensual
        </h2>

        <p className="text-gray-600 text-base leading-relaxed">
          A seguir, revisamos os pontos principais da sua escuta clínica inicial:
        </p>

        <div className="text-left space-y-4 text-gray-700 text-base">
          {dados.nome && <p>Nome simbólico ou civil: <strong>{dados.nome}</strong></p>}

          {dados.queixas && (
            <p>
              Queixas referidas: {dados.queixas.join(', ')}. Queixa principal: <strong>{dados.queixaPrincipal}</strong>.
            </p>
          )}

          {dados.desenvolvimento && (
            <p>
              A queixa foi descrita como <strong>{dados.desenvolvimento.como}</strong>, sentida em{' '}
              <strong>{dados.desenvolvimento.onde}</strong> desde <strong>{dados.desenvolvimento.quando}</strong>. Relata também{' '}
              <strong>{dados.desenvolvimento.oqueMais}</strong>. Melhora com{' '}
              <strong>{dados.desenvolvimento.melhora}</strong> e piora com <strong>{dados.desenvolvimento.piora}</strong>.
            </p>
          )}

          {dados.pregressa && (
            <p>História patológica pregressa: {dados.pregressa.join(', ')}.</p>
          )}

          {dados.familiar && (
            <p>
              Por parte materna: {dados.familiar.mae.join(', ') || 'sem dados'}.<br />
              Por parte paterna: {dados.familiar.pai.join(', ') || 'sem dados'}.
            </p>
          )}

          {dados.habitos && (
            <p>Hábitos de vida mencionados: {dados.habitos.join(', ')}.</p>
          )}

          {(dados.alergias || dados.regulares || dados.esporadicas) && (
            <p>
              Alergias: <strong>{dados.alergias}</strong>.<br />
              Medicações de uso regular: <strong>{dados.regulares}</strong>.<br />
              Medicações esporádicas: <strong>{dados.esporadicas}</strong>.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-green-700 font-medium pt-6">
            ✅ Avaliação inicial concluída.
          </p>
          <p className="text-gray-700 text-sm">
            Recomendo agora a marcação de uma consulta com o Dr. Ricardo Valença:
            <br />
            <a
              href="https://www.consultoriodosvalenca.com.br"
              className="text-rose-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              consultoriodosvalenca.com.br
            </a>
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={resetar}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-xl shadow-md transition-all"
          >
            Limpar Avaliação e Reiniciar
          </button>
        </div>
      </div>
    </div>
  )
}
