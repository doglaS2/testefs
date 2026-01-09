import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, deleteDocument } from '@/lib/rag';

export async function GET() {
  try {
    const documents = await getDocuments();
    return NextResponse.json({ documents });
  } catch (error: any) {
    console.error('Erro ao listar documentos:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao listar documentos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do documento não fornecido' },
        { status: 400 }
      );
    }

    const result = await deleteDocument(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao deletar documento' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Documento deletado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao deletar documento:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar documento' },
      { status: 500 }
    );
  }
}
