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
      .input(imagePath)
      // On dit : "Prends l'image, boucle-la (-loop 1), et affiche-la à 25 images/seconde (-framerate 25)"
      .inputOptions(['-framerate', '25', '-loop', '1']) 
      .input(audioPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-r', '30',            // On convertit en 30fps pour l'export (lisse)
        '-pix_fmt', 'yuv420p',
        '-shortest'           // On coupe quand l'audio est fini
      ])
      .output(outputPath)
      .on('end', () => resolve(`/videos/${outputFileName}`))
      .on('error', (err) => reject(err))
      .run();
  });
}