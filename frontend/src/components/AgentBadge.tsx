interface Props {
  agent: string;
}

export function AgentBadge({ agent }: Props) {
  return <span className="agent-badge">{agent}</span>;
}
