import { Message } from '../types';
import { AgentBadge } from './AgentBadge';

interface Props {
  messages: Message[];
  loading: boolean;
}

export function ChatHistory({ messages, loading }: Props) {
  return (
    <section className="chat-history">
      {loading ? (
        <div className="chat-history__loading">O agente está digitando...</div>
      ) : messages.length === 0 ? (
        <div className="chat-history__empty">Nenhuma mensagem ainda. Envie sua primeira pergunta.</div>
      ) : (
        <div className="chat-history__list">
          {messages.map((message) => (
            <div key={message.id} className={`chat-message chat-message--${message.author}`}>
              <div className="chat-message__bubble">
                <p>{message.conteudo}</p>
              </div>
              <div className="chat-message__meta">
                <span>{new Date(message.criado_em).toLocaleTimeString()}</span>
                <AgentBadge agent={message.agente_responsavel} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
