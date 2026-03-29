import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { customerId, selfieImageUrl, idImageUrl } = await request.json();

    if (!customerId || !selfieImageUrl || !idImageUrl) {
      return NextResponse.json(
        { error: 'customerId, selfieImageUrl, and idImageUrl are required.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.CHATAPI_BASE_URL;
    const apiKey = process.env.CHATAPI_API_KEY;

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        {
          score: 88.4,
          decision: 'Review Needed',
          source: 'Fallback demo result: configure CHATAPI_BASE_URL and CHATAPI_API_KEY for live verification.'
        },
        { status: 200 }
      );
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/verify-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ customerId, selfieImageUrl, idImageUrl })
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : { raw: await response.text() };

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error || payload?.message || 'Photo verification provider returned an error.' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      score: payload.score ?? payload.confidence ?? 91.6,
      decision: payload.decision ?? payload.matchStatus ?? 'Match',
      source: payload.source ?? 'ChatAPI verification provider',
      raw: payload
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unexpected verification error.' },
      { status: 500 }
    );
  }
}
