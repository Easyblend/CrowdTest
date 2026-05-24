// /app/api/ai/improve-project/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

interface ImproveProjectRequest {
  url?: string;
}

interface ImprovedProject {
  name: string;
  description: string;
}

const SYSTEM_PROMPT = `
You are an assistant that analyzes websites and generates concise project metadata.

Rules:
- Generate a short, professional project title.
- Generate a concise description (2-4 sentences).
- Describe what the product or web app actually does.
- Do not hallucinate features not present in the content.
- Avoid marketing language and hype.
- Keep descriptions clear and factual.
- If the site content is unclear, do your best with available context.
- Respond with STRICT JSON only.

Format:
{
  "name": string,
  "description": string
}
`;

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI not configured' },
      { status: 503 }
    );
  }

  let body: ImproveProjectRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const url = body.url?.trim();

  function isValidUrl(url: string) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return !!parsed.hostname;
    } catch {
      return false;
    }
  }

  if (!url || !isValidUrl(url)) {
    console.log('Invalid URL:', url);
    return NextResponse.json(
      {
        error: 'Invalid URL. Please enter a valid website (e.g. https://example.com)'
      },
      { status: 400 }
    );
  }


  try {

    //normalize URL (add http if missing)
    const normalizedUrl = url.startsWith('http')
      ? url
      : `https://${url}`;

    // Fetch website markdown/content
    const jinaRes = await fetch(
      `https://r.jina.ai/http://${normalizedUrl.replace(/^https?:\/\//, '')}`
    );

    if (!jinaRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch website content' },
        { status: 502 }
      );
    }

    const markdown = await jinaRes.text();

    // Avoid massive payloads
    const trimmedMarkdown = markdown.slice(0, 12000);

    const aiRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:
            process.env.GROQ_MODEL ||
            'llama-3.3-70b-versatile',

          temperature: 0.3,

          response_format: {
            type: 'json_object',
          },

          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: `
Website URL:
${url}

Website markdown/content:
${trimmedMarkdown}
              `,
            },
          ],
        }),
      }
    );

    if (!aiRes.ok) {
      const err = await aiRes.json().catch(() => null);

      console.error('Groq error:', err);

      return NextResponse.json(
        { error: err?.error?.message || 'AI failed' },
        { status: 502 }
      );
    }

    const data = await aiRes.json();

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'Empty AI response' },
        { status: 502 }
      );
    }

    let parsed: ImprovedProject;

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: 'AI returned invalid JSON' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      name: parsed.name?.trim().slice(0, 120),
      description: parsed.description
        ?.trim()
        .slice(0, 2000),
    });
  } catch (error) {
    console.error('Improve project error:', error);

    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}