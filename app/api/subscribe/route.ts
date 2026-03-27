import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'E-postadress krävs' },
        { status: 400 }
      );
    }

    console.log('[v0] Newsletter subscription attempt for:', email);
    console.log('[v0] Using API key:', process.env.NEWSLETTER_API_KEY ? 'SET' : 'NOT SET');
    console.log('[v0] Using list ID:', process.env.NEWSLETTER_LIST_ID);

    // Anropa Get a Newsletter API
    const response = await fetch('https://api.getanewsletter.com/v3/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEWSLETTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        list_ids: [process.env.NEWSLETTER_LIST_ID], 
        status: 'active'
      }),
    });

    console.log('[v0] GetANewsletter API response status:', response.status);

    // Hantera rate limiting (429 Too Many Requests)
    if (response.status === 429) {
      const waitSeconds = response.headers.get('X-Throttle-wait-Seconds') || '60';
      return NextResponse.json(
        { error: `För många förfrågningar. Försök igen om ${waitSeconds} sekunder.` },
        { status: 429 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      // Fånga upp specifika API-fel
      console.log('[v0] GetANewsletter API error:', data);
      return NextResponse.json(
        { error: data.detail || data.message || 'Kunde inte prenumerera' },
        { status: response.status }
      );
    }

    console.log('[v0] Newsletter subscription successful for:', email);
    return NextResponse.json(
      { message: 'Välkommen ombord!', data },
      { status: 200 }
    );

  } catch (error) {
    console.error('[v0] Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Internt serverfel. Vi har blivit notifierade.' },
      { status: 500 }
    );
  }
}
