import { useState } from 'react';

interface Props {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    await onSend(value.trim());
    setValue('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Digite sua pergunta aqui..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Enviar
      </button>
    </form>
  );
}
