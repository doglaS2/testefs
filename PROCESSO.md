# Processo de Desenvolvimento - Chat RAG Inteligente

Este documento detalha o processo de construção do desafio técnico, focando na arquitetura, decisões técnicas e superação de obstáculos.

## 🛠️ Stack Tecnológica Utilizada
- **Frontend**: Next.js 14 (App Router), TypeScript e Tailwind CSS.
- **Backend**: Next.js API Routes e Vercel AI SDK.
- **IA**: Google Gemini 1.5 Flash (via OpenRouter/Google SDK).
- **Banco de Dados**: Supabase (PostgreSQL + pgvector) para armazenamento de documentos e busca vetorial.
- **Gerenciamento de Estado**: React Hooks e LocalStorage para persistência de histórico e configurações.

## ✅ Requisitos Implementados
1. **Painel de Configurações**: Interface para edição de System Prompt com persistência em `localStorage`.
2. **Sistema de RAG**: Pipeline completo de upload de PDF/TXT, extração de texto e indexação vetorial no Supabase.
3. **Histórico de Conversas**: Persistência de diálogo no lado do cliente para manter o contexto durante a navegação.
4. **Interface de Teste**: Chat com suporte a streaming de resposta em tempo real.

## 🚀 Desafios e Soluções (Diário de Bordo)

### 1. Sincronização de Persona (System Prompt)
**Problema**: O modelo não estava assumindo a personalidade (ex: pirata) configurada na tela de ajustes.
**Solução**: Sincronizei a chave do `localStorage` entre a `SettingsPage` e a `ChatPage`. Agora, o prompt é capturado no momento do envio e injetado na instrução de `system` da API.

### 2. Persistência do Histórico
**Problema**: Ao navegar para as configurações, o estado do React era limpo e a conversa sumia.
**Solução**: Implementei um `useEffect` que salva o array de mensagens no `chat-history` do navegador e o recupera ao montar o componente.

### 3. Segurança e Versionamento (Git)
**Problema**: Bloqueio de Push pelo GitHub devido à detecção de segredos no histórico de commits (`.env.local`).
**Solução**: Realizei um expurgo no histórico do Git utilizando `git filter-branch` para remover dados sensíveis de todos os commits passados, garantindo a conformidade com as políticas de segurança.

## 📦 Padrão de Commits
Seguindo as regras do teste, o desenvolvimento foi documentado com:
- `[AI]`: Commits para códigos gerados por IA (incluindo o prompt na descrição).
- `[MANUAL]`: Ajustes finos de lógica e interface.
- `[REFACTOR]`: Limpeza de código e remoção de arquivos sensíveis.

---
**Desenvolvido por Douglas Siqueira**
**Data**: 09/01/2026