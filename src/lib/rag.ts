import { supabase } from './supabase';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export interface Document {
  id: string;
  filename: string;
  created_at: string;
}

/**
 * Adiciona um documento ao banco de dados com embedding
 */
export async function addDocument(
  content: string,
  filename: string
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Conteúdo vazio' };
    }

    if (!filename || filename.trim().length === 0) {
      return { success: false, error: 'Nome do arquivo inválido' };
    }

    // Gera embedding do conteúdo usando Google Gemini
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: content,
    });

    // Salva no Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert({
        content,
        filename,
        embedding,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar documento:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Erro ao adicionar documento:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

/**
 * Busca contexto relevante baseado em uma query
 */
export async function getContext(
  query: string,
  matchThreshold = 0.7,
  matchCount = 5
): Promise<{ context: string; sources: string[] }> {
  try {
    if (!query || query.trim().length === 0) {
      return { context: '', sources: [] };
    }

    // Gera embedding da query usando Google Gemini
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: query,
    });

    // Busca documentos similares usando RPC do Supabase
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) {
      console.error('Erro ao buscar contexto:', error);
      return { context: '', sources: [] };
    }

    if (!data || data.length === 0) {
      return { context: '', sources: [] };
    }

    // Combina os resultados em contexto
    const context = data
      .map((doc: any) => `[${doc.filename}]\n${doc.content}`)
      .join('\n\n---\n\n');

    const sources = data.map((doc: any) => doc.filename);

    return { context, sources };
  } catch (error) {
    console.error('Erro ao obter contexto:', error);
    return { context: '', sources: [] };
  }
}

/**
 * Lista todos os documentos
 */
export async function getDocuments(): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, content, filename, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar documentos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao obter documentos:', error);
    return [];
  }
}

/**
 * Remove um documento
 */
export async function deleteDocument(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('documents').delete().eq('id', id);

    if (error) {
      console.error('Erro ao deletar documento:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao deletar documento:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}
