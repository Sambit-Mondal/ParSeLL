import { NextRequest, NextResponse } from 'next/server';
import FastText from 'fasttext';
import path from 'path';

const fastText = new FastText.Classifier();
await fastText.loadModel(path.resolve('../../../ml-models/lid.176.bin'));

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();
        const result = await fastText.predict(text, 1);

        const detectedLanguage = result[0].label.replace('__label__', '');

        return NextResponse.json({ success: true, language: detectedLanguage });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}