import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Sujet manquant' }, { status: 400 });
    }

    // --- SIMULATION DE L'IA (Sans frais) ---
    // On attend 1.5 seconde pour faire comme si l'IA réfléchissait
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const script = `[SIMULATION] Voici un script génial sur : ${topic}. C'est une démo car ton crédit OpenAI est épuisé, mais le système fonctionne parfaitement !`;

    // --- SIMULATION ENREGISTREMENT BDD ---
    // (On ne touche pas à la BDD pour l'instant pour éviter les erreurs d'ID utilisateur)
    const video_id = Math.floor(Math.random() * 10000);

    return NextResponse.json({ 
      success: true, 
      script: script,
      video_id: video_id
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}