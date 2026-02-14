import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export async function compileVideo(imagePath: string, audioPath: string): Promise<string> {
  const outputFileName = `video-${Date.now()}.mp4`;
  const outputPath = path.join(process.cwd(), 'public', 'videos', outputFileName);

  const videosDir = path.join(process.cwd(), 'public', 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(imagePath)
      .inputOptions([
        '-loop 1'        // 🔥 boucle l’image correctement
      ])
      .input(audioPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-shortest'])      // 🔥 force le nobre de seconde secondes de vidéo
      .outputOptions([
        '-r', '30',                // 30 FPS
        '-pix_fmt', 'yuv420p',     // Compatibilité
        '-fflags', '+genpts',      // <--- Génère les timestamps
        '-movflags', '+faststart'  // <--- Place les métadonnées au début
      ])
      .output(outputPath)
      .on('end', () => resolve(`/videos/${outputFileName}`))
      .on('error', (err) => reject(err))
      .run();
  });
}
