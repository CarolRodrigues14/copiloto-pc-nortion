-- ============================================
-- Ajuste: busca full-text em vez de embeddings/pgvector
-- Rodar no SQL Editor do Supabase ANTES de inserir os documentos
-- ============================================

-- Remove a função antiga baseada em embeddings (não será mais usada)
drop function if exists buscar_documento_similar(vector, text, int);

-- Adiciona uma coluna de busca full-text (gerada automaticamente a partir de titulo + conteudo)
alter table knowledge_documents
  add column if not exists busca tsvector
  generated always as (to_tsvector('portuguese', coalesce(titulo, '') || ' ' || coalesce(conteudo, ''))) stored;

-- Índice para acelerar a busca full-text
create index if not exists knowledge_documents_busca_idx
  on knowledge_documents using gin (busca);

-- Função de busca (usada pela tool MCP buscarDocumento)
create or replace function buscar_documento_texto(
  termo_busca text,
  categoria_filtro text default null,
  match_count int default 3
)
returns table (
  id uuid,
  titulo text,
  conteudo text,
  categoria text,
  relevancia float4
)
language sql stable
as $$
  select
    id,
    titulo,
    conteudo,
    categoria,
    ts_rank(busca, websearch_to_tsquery('portuguese', termo_busca)) as relevancia
  from knowledge_documents
  where
    (categoria_filtro is null or categoria = categoria_filtro)
    and busca @@ websearch_to_tsquery('portuguese', termo_busca)
  order by relevancia desc
  limit match_count;
$$;

-- A coluna "embedding" (vector) pode ficar sem uso, ou remova se quiser deixar o schema mais limpo:
-- alter table knowledge_documents drop column if exists embedding;