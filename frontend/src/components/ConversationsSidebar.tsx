import { Conversation } from '../types';

interface Props {
  conversations: Conversation[];
  selectedConversationId?: string;
  loading: boolean;
  onConversationSelect: (conversation: Conversation) => void;
}

export function ConversationsSidebar({ conversations, selectedConversationId, loading, onConversationSelect }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <strong>Conversas</strong>
      </div>

      {loading ? (
        <div className="sidebar__loading">Carregando histórico...</div>
      ) : (
        <ul className="sidebar__list">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`sidebar__item ${conversation.id === selectedConversationId ? 'sidebar__item--active' : ''}`}
              onClick={() => onConversationSelect(conversation)}
            >
              <div className="sidebar__title">{conversation.title}</div>
              <div className="sidebar__meta">{new Date(conversation.atualizado_em).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
