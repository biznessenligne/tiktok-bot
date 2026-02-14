import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

// On n'utilise plus @ffmpeg-installer/ffmpeg.
// On suppose que 'ffmpeg' est installé sur le système (apt install ffmpeg).
// fluent-ffmpeg trouvera la commande tout seul.

export async function compileVideo(imagePath: string, audioPath: string): Promise<string> {
  const outputFileName = `video-${Date.now()}.mp4`;
  const outputPath = path.join(process.cwd(), 'public', 'videos', outputFileName);

  // Créer le dossier 'videos' s'il n'existe pas
  const videosDir = path.join(process.cwd(), 'public', 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

          return new Promise((resolve, reject) => {
    ffmpeg()
      .input(imagePath, { loop: 1 }) // <--- NOUVELLE SYNTAXE : Boucle en objet
      .input(audioPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-r 30',            // Force 30 FPS
        '-pix_fmt yuv420p', // Compatibilité
        '-shortest'         // Coupe quand l'audio finit
      ])
      .output(outputPath)
      .on('end', () => resolve(`/videos/${outputFileName}`))
      .on('error', (err) => reject(err))
      .run();
  });
}