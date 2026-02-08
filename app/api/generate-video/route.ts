import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, niche } = await req.json();

    if (!topic) return NextResponse.json({ error: 'Sujet manquant' }, { status: 400 });

    // 1. Appel réel à l'IA OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Tu peux utiliser "gpt-4o-mini" pour économiser de l'argent
      messages: [
        { role: "system", content: "Tu es un expert TikTok. Écris un script viral de 15 secondes maximum." },
        { role: "user", content: `Sujet : ${topic}` }
      ],
      max_tokens: 100,
    });

    const script = completion.choices[0].message.content || "Erreur de génération";

    // 2. Enregistrement dans Supabase (On utilise l'ID temporaire car pas encore de login)
    const { error } = await supabase
      .from('videos')
      .insert([
        { 
          user_id: '00000000-0000-0000-0000-000000000000',
          title: topic,
          niche: niche || 'General',
          status: 'done',
          views: 0
        }
      ]);

    if (error) console.error("Erreur BDD:", error);

    return NextResponse.json({ success: true, script });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}