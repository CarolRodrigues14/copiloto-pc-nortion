import { useEffect, useState } from 'react';
import { fetchConversations, fetchConversationHistory, fetchConversationSummary, sendChatMessage } from './services/api';
import { Conversation, ConversationSummary, Message } from './types';
import { ConversationsSidebar } from './components/ConversationsSidebar';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { SummaryModal } from './components/SummaryModal';
import { text } from './content/text';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const loadConversations = async () => {
    setLoadingConversations(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setConversations(data);
      if (data.length > 0 && !currentConversation) {
        setCurrentConversation(data[0]);
      }
    } catch (err) {
      setError(text.errors.loadConversations);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    setError(null);
    try {
      const data = await fetchConversationHistory(conversationId);
      setMessages(data);
    } catch (err) {
      setError(text.errors.loadMessages);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConversationClick = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    setSendingMessage(true);
    setError(null);

    try {
      const response = await sendChatMessage({ conversation_id: currentConversation?.id, mensagem: message });
      const updatedConversation: Conversation = {
        id: response.conversation_id,
        title: currentConversation?.title ?? text.defaultConversationTitle,
        atualizado_em: new Date().toISOString(),
      };

      setCurrentConversation(updatedConversation);
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, author: 'user', conteudo: message, criado_em: new Date().toISOString(), agente_responsavel: 'Usuário' },
        { id: `assistant-${Date.now()}`, author: 'assistant', conteudo: response.resposta, criado_em: new Date().toISOString(), agente_responsavel: response.agente_responsavel },
      ]);

      if (!conversations.some((item) => item.id === response.conversation_id)) {
        setConversations((prev) => [updatedConversation, ...prev]);
      }
    } catch (err) {
      setError(text.errors.sendMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleOpenSummary = async () => {
    if (!currentConversation) return;
    setIsSummaryOpen(true);
    setLoadingSummary(true);
    setError(null);
    try {
      const data = await fetchConversationSummary(currentConversation.id);
      setSummary(data);
    } catch (err) {
      setError(text.errors.loadSummary);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation]);

  return (
    <div className="app-shell">
      <ConversationsSidebar
        conversations={conversations}
        loading={loadingConversations}
        selectedConversationId={currentConversation?.id}
        onConversationSelect={handleConversationClick}
      />

      <main className="chat-panel">
        <header className="chat-panel__header">
          <div>
            <h1>{text.chat.title}</h1>
            <p>{text.chat.description}</p>
          </div>
          <button className="summary-button" onClick={handleOpenSummary} disabled={!currentConversation || loadingSummary}>
            {text.chat.openSummary}
          </button>
        </header>

        {error && <div className="toast-error">{error}</div>}

        <ChatHistory messages={messages} loading={loadingMessages || sendingMessage} />

        <ChatInput onSend={handleSendMessage} disabled={sendingMessage} />
      </main>

      <SummaryModal
        open={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        summary={summary}
        loading={loadingSummary}
      />
    </div>
  );
}

export default App;
