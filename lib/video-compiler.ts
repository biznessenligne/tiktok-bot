import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg'; // Assure-toi que c'est installé
import path from 'path';
import fs from 'fs';

// On dit à fluent-ffmpeg où trouver le programme ffmpeg sur le serveur
ffmpeg.setFfmpegPath(ffmpegPath.path);

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
        '-map 0:v', // Utiliser la vidéo (image)
        '-map 1:a', // Utiliser l'audio
        '-c:v libx264',
        '-tune stillimage', // Optimisé pour image fixe
        '-c:a aac',
        '-b:a 192k',
        '-pix_fmt yuv420p', // Compatible avec les navigateurs
        '-shortest' // La vidéo dure le temps de l'audio
      ])
      .output(outputPath)
      .on('end', () => resolve(`/videos/${outputFileName}`))
      .on('error', (err) => reject(err))
      .run();
  });
}