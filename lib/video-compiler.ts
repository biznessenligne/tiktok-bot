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
      .input(imagePath)       // L'image source
      .loop()                  // On force l'image à boucler (très important pour la durée)
      .input(audioPath)       // L'audio source
      .videoCodec('libx264')  // Codec vidéo standard
      .audioCodec('aac')      // Codec audio standard
      .outputOptions([
        '-r 30',             // Force la cadence à 30 images/seconde (corrige le bug 0:00)
        '-pix_fmt yuv420p',  // Format compatible navigateur
        '-shortest'          // La vidéo s'arrête quand l'audio se termine
      ])
      .output(outputPath)
      .on('end', () => resolve(`/videos/${outputFileName}`))
      .on('error', (err) => reject(err))
      .run();
  });
}