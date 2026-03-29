import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { customerName, riskLevel, status, ocrRows, verificationResult } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || 'gpt-5.4';

    const prompt = `You are a compliance reviewer for a B2B KYC platform.
Return a concise reviewer note in plain English with exactly three short paragraphs:
1) overall case status
2) mismatch and fraud concerns
3) recommended next action

Customer: ${customerName}
Risk level: ${riskLevel}
Current status: ${status}
Face verification result: ${JSON.stringify(verificationResult)}
OCR comparison rows: ${JSON.stringify(ocrRows)}`;

    const response = await client.responses.create({
      model,
      input: prompt
    });

    const summary = response.output_text?.trim() || 'No summary returned.';

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'AI review failed.' },
      { status: 500 }
    );
  }
}
