import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';
import { compileVideo } from '@/lib/video-compiler';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- NOUVELLE FONCTION : Générer l'audio avec ElevenLabs ---
async function generateAudio(text: string): Promise<string> {
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Exemple : Voice "Rachel". Remplace par ton ID si tu veux.
  const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs Error: ${response.statusText}`);
  }

  // Convertir le stream en fichier
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const audioPath = path.join(process.cwd(), 'public', `audio-${Date.now()}.mp3`);
  fs.writeFileSync(audioPath, buffer);

  return audioPath;
}

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    // 1. Génération du Script
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "Écris un script très court (10-15 secondes)." }, { role: "user", content: topic }],
      max_tokens: 100,
    });
    const script = completion.choices[0].message.content || "";

    // 2. Télécharger l'image de fond
    const imageUrl = "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    const imagePath = path.join(process.cwd(), 'public', `temp-${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imagePath);
    const response = await axios({ url: imageUrl, responseType: 'stream' });
    response.data.pipe(writer);
    await new Promise<void>((resolve) => {
    writer.on('finish', resolve);
});

    // 3. Générer l'audio avec ElevenLabs (NOUVEAU)
    const audioPath = await generateAudio(script);

    // 4. Compilation Vidéo (Image + Audio Généré)
    const videoUrl = await compileVideo(imagePath, audioPath);

    // 5. Nettoyage
    fs.unlinkSync(imagePath);
    fs.unlinkSync(audioPath); // On supprime l'audio temporaire

    // 6. Enregistrement BDD
    await supabase.from('videos').insert([
      { user_id: '00000000-0000-0000-0000-000000000000', title: topic, niche: 'Test', status: 'done', views: 0 }
    ]);

    return NextResponse.json({ 
      success: true, 
      script, 
      videoUrl: videoUrl 
    });

  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}