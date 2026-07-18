import { ConversationSummary } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  summary: ConversationSummary | null;
  loading: boolean;
}

export function SummaryModal({ open, onClose, summary, loading }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Resumo da Conversa</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="modal-loading">Carregando resumo...</div>
        ) : summary ? (
          <>
            <section className="modal-section">
              <h3>Resumo</h3>
              <p>{summary.resumo}</p>
            </section>
            <section className="modal-section">
              <h3>Recomendações</h3>
              <ul>
                {summary.recomendacoes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
            <div className="modal-footer">Agente responsável: {summary.agente_responsavel}</div>
          </>
        ) : (
          <div className="modal-empty">Nenhum resumo disponível.</div>
        )}
      </div>
    </div>
  );
}
