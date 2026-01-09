-- Habilita a extensão de vetores
create extension if not exists vector;

-- Cria a tabela de documentos
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  filename text not null,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);

-- Cria a função de busca por similaridade
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  filename text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.filename,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- Cria índice para performance
create index if not exists documents_embedding_idx on documents 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Habilita RLS (Row Level Security) - opcional, ajuste conforme necessário
alter table documents enable row level security;

-- Política para permitir inserção (ajuste conforme seu caso de uso)
create policy "Enable insert for all users" on documents
  for insert with check (true);

-- Política para permitir leitura (ajuste conforme seu caso de uso)
create policy "Enable read for all users" on documents
  for select using (true);

-- Política para permitir delete (ajuste conforme seu caso de uso)
create policy "Enable delete for all users" on documents
  for delete using (true);
