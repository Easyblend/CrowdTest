import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createSupabaseServer } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

interface ImproveRequest {
    title?: string;
    description?: string;
}

interface ImprovedBug {
    title: string;
    description: string;
}

const SYSTEM_PROMPT = `You are an assistant that rewrites bug reports written by crowd-testers so they are clearer, more professional, and easier to triage.

Rules:
- Keep the user's original meaning. Do NOT invent facts, error messages, stack traces, or steps that are not implied.
- Title: short (max ~80 chars), specific, in the form "<Component/Area>: <what is broken>". No trailing period.
- Description: 2-6 short sentences or bullet points. If possible, structure it as: what happened, expected behavior, and (only if the user mentioned them) steps to reproduce.
- Use plain, neutral English. No marketing language, no emojis, no apologies.
- If the input is empty or nonsensical, return it back cleaned up minimally.
- Respond with STRICT JSON only, matching: {"title": string, "description": string}. No markdown, no commentary.`;

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: 'AI is not configured on the server.' },
            { status: 503 }
        );
    }

    let body: ImproveRequest;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const title = (body.title ?? '').toString().trim().slice(0, 500);
    const description = (body.description ?? '').toString().trim().slice(0, 4000);

    if (!title && !description) {
        return NextResponse.json(
            { error: 'Provide a title or description to improve.' },
            { status: 400 }
        );
    }

    const userPrompt = `Original title: ${title || '(empty)'}\nOriginal description: ${description || '(empty)'}`;

    try {
        const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                temperature: 0.3,
                response_format: { type: 'json_object' },
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt },
                ],
            }),
        });

        if (!aiRes.ok) {
            const errText = await aiRes.text();
            console.error('Groq error:', aiRes.status, errText);
            return NextResponse.json(
                { error: 'AI provider request failed.' },
                { status: 502 }
            );
        }

        const data = await aiRes.json();
        const content: string | undefined = data?.choices?.[0]?.message?.content;
        if (!content) {
            return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
        }

        let parsed: ImprovedBug;
        try {
            parsed = JSON.parse(content);
        } catch {
            return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 502 });
        }

        const improved: ImprovedBug = {
            title: (parsed.title ?? title).toString().trim().slice(0, 200),
            description: (parsed.description ?? description).toString().trim().slice(0, 4000),
        };

        return NextResponse.json(improved);
    } catch (err) {
        console.error('improve-bug error:', err);
        return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
    }
}
