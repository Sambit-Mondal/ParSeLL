import { NextRequest, NextResponse } from 'next/server';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import translateClient from '../../../lib/aws-config';

export async function POST(req: NextRequest) {
  const { text, sourceLang, targetLang } = await req.json();

  try {
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
    });

    const response = await translateClient.send(command);
    return NextResponse.json({ translatedText: response.TranslatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
