import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getContext } from '@/lib/rag';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // DEBUG: Se o pirata estiver configurado, ele DEVE aparecer aqui no terminal!
    console.log('--- [DEBUG] SYSTEM PROMPT RECEBIDO ---');
    console.log(systemPrompt || 'AVISO: Prompt não enviado ou vazio');
    console.log('---------------------------------------');

    // Recuperação de dados via RAG
    const { context } = await getContext(lastMessage.content, 0.3);
    
    console.log('--- [RAG_OBSERVABILITY] ---');
    console.log(context ? `Contexto Recuperado: ${context.substring(0, 100)}...` : 'Sem contexto encontrado.');
    console.log('---------------------------');

    const result = await streamText({
      model: google('gemini-flash-latest'), 
      messages: [
        { 
          role: 'system', 
          content: `${systemPrompt || 'Você é um assistente prestativo.'}\n\nUSE O CONTEXTO ABAIXO:\n${context}` 
        },
        ...messages
      ],
    });

    return result.toTextStreamResponse(); 

  } catch (error: any) {
    console.error('[CHAT_ERROR]:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}