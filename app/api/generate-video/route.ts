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

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    // 1. Génération du Script
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Plus rapide et moins cher
      messages: [{ role: "system", content: "Écris un script court." }, { role: "user", content: topic }],
      max_tokens: 100,
    });
    const script = completion.choices[0].message.content || "";

        // 2. Télécharger une image de fond
    const imageUrl = "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    const imagePath = path.join(process.cwd(), 'public', `temp-${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imagePath);
    const response = await axios({ url: imageUrl, responseType: 'stream' });
    response.data.pipe(writer);

    // Attendre que l'image soit téléchargée (Version explicite)
    await new Promise<void>((resolve) => {
        writer.on('finish', resolve);
    });

    // 3. Utiliser le fichier audio de test (demo.mp3)
    // NOTE: Pour l'instant, on utilise ton fichier local. 
    const audioPath = path.join(process.cwd(), 'public', 'demo.mp3');

    // Vérification que le fichier audio existe
    if (!fs.existsSync(audioPath)) {
      throw new Error("Fichier demo.mp3 introuvable dans le dossier public.");
    }

    // 4. Compilation Vidéo (Le montage FFmpeg)
    const videoUrl = await compileVideo(imagePath, audioPath);

    // 5. Nettoyage (Supprimer l'image temporaire pour ne pas encombrer)
    fs.unlinkSync(imagePath);

    // 6. Enregistrement BDD
    await supabase.from('videos').insert([
      { user_id: '00000000-0000-0000-0000-000000000000', title: topic, niche: 'Test', status: 'done', views: 0 }
    ]);

    return NextResponse.json({ 
      success: true, 
      script, 
      videoUrl: videoUrl // Lien vers la vidéo générée
    });

  } catch (error: any) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}