import { NextRequest, NextResponse } from 'next/server';
import { addDocument } from '@/lib/rag';
const PDFParser = require("pdf2json");

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

    console.log(`[UPLOAD_SERVICE][${requestId}] Processing: ${file.name}`);

    const extension = file.name.split('.').pop()?.toLowerCase();
    let content = '';

    if (extension === 'pdf') {
      const buffer = Buffer.from(await file.arrayBuffer());
      content = await new Promise((resolve, reject) => {
        const parser = new PDFParser(null, 1);
        parser.on("pdfParser_dataError", (err: any) => reject(err));
        parser.on("pdfParser_dataReady", () => {
          const raw = parser.getRawTextContent();
          resolve(decodeURIComponent(raw).replace(/\\r\\n/g, '\n').replace(/\s+/g, ' ').trim());
        });
        parser.parseBuffer(buffer);
      });
      console.log(`[UPLOAD_SERVICE][${requestId}] PDF text extraction successful.`);
    } else {
      content = await file.text();
    }

    // Persistência no Banco
    const result = await addDocument(content.substring(0, 50000), file.name);
    
    if (result.success) {
      console.log(`[UPLOAD_SERVICE][${requestId}] Document indexed successfully in Supabase.`);
      return NextResponse.json({ success: true });
    } else {
      throw new Error(result.error);
    }

  } catch (error: any) {
    console.error(`[UPLOAD_ERROR][${requestId}]:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}