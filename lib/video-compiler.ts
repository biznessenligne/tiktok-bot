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
      .input(audioPath)
      .outputOptions([
        '-map 0:v', // Image
        '-map 1:a', // Audio
        '-c:v libx264',
        '-tune stillimage',
        '-c:a aac',
        '-b:a 192k',
        '-pix_fmt yuv420p',
        '-shortest' 
      ])
      .output(outputPath)
      .on('end', () => resolve(`/videos/${outputFileName}`))
      .on('error', (err) => reject(err))
      .run();
  });
}