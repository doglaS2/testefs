'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Carrega o system prompt do localStorage
    const savedPrompt = localStorage.getItem('systemPrompt');
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    } else {
      setSystemPrompt(
        'Você é um assistente prestativo e amigável. Use o contexto fornecido para responder às perguntas de forma precisa.'
      );
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('systemPrompt', systemPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultPrompt =
      'Você é um assistente prestativo e amigável. Use o contexto fornecido para responder às perguntas de forma precisa.';
    setSystemPrompt(defaultPrompt);
    localStorage.setItem('systemPrompt', defaultPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Voltar ao Chat
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label
              htmlFor="systemPrompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              System Prompt
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Configure o comportamento do assistente de IA. Este prompt será usado
              em todas as conversas.
            </p>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o system prompt..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Salvar
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
            >
              Restaurar Padrão
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✓ Configurações salvas com sucesso!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
