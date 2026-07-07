-- ============================================
-- Migration inicial — Copiloto P&C Nortion Capital
-- Rodar no SQL Editor do Supabase
-- ============================================

-- Habilita a extensão pgvector (necessária para busca semântica)
create extension if not exists vector;

-- ============================================
-- Tabela: users
-- ============================================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  papel text not null,
  criado_em timestamptz default now()
);

-- Usuário fictício de P&C para acesso sem login (ver decisão de deploy)
insert into users (nome, papel) values ('Ana - Especialista de Performance', 'P&C');

-- ============================================
-- Tabela: conversations
-- ============================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  titulo text,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- ============================================
-- Tabela: messages
-- ============================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  autor text not null check (autor in ('usuario', 'agente')),
  agente_responsavel text,
  conteudo text not null,
  criado_em timestamptz default now()
);

-- ============================================
-- Tabela: conversation_summaries
-- ============================================
create table if not exists conversation_summaries (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  resumo text,
  recomendacoes text[],
  criado_em timestamptz default now()
);

-- ============================================
-- Tabela: knowledge_documents (com suporte a embeddings)
-- ============================================
create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('politicas', 'metricas', 'compliance', 'onboarding')),
  titulo text not null,
  conteudo text not null,
  embedding vector(1536), -- ajuste a dimensão conforme o modelo de embedding usado
  criado_em timestamptz default now()
);

-- Índice para busca vetorial eficiente (ivfflat)
create index if not exists knowledge_documents_embedding_idx
  on knowledge_documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ============================================
-- Função de busca semântica (usada pela tool MCP buscarDocumento)
-- ============================================
create or replace function buscar_documento_similar(
  query_embedding vector(1536),
  categoria_filtro text default null,
  match_count int default 3
)
returns table (
  id uuid,
  titulo text,
  conteudo text,
  categoria text,
  similarity float
)
language sql stable
as $$
  select
    id,
    titulo,
    conteudo,
    categoria,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_documents
  where categoria_filtro is null or categoria = categoria_filtro
  order by embedding <=> query_embedding
  limit match_count;
$$;