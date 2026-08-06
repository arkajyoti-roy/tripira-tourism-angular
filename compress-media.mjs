import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

// Set the path to the statically linked ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegStatic);

const dir = 'public';

async function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-c:v libx264',
        '-crf 18',        // CRF 18 is considered visually lossless
        '-preset slow',   // Slower preset means better compression without losing quality
        '-c:a aac',       // Re-encode audio to aac if needed
        '-b:a 128k'
      ])
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}

async function processDirectory(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.isFile()) {
        const ext = path.extname(file.name);
        const tempPath = fullPath + '.tmp' + ext;
        
        if (/\.(png|jpe?g|webp)$/i.test(file.name)) {
          console.log(`Compressing image: ${fullPath}...`);
          try {
            if (file.name.toLowerCase().endsWith('.png')) {
              await sharp(fullPath).png({ quality: 80, compressionLevel: 9, effort: 10 }).toFile(tempPath);
            } else if (file.name.toLowerCase().endsWith('.webp')) {
              await sharp(fullPath).webp({ quality: 80 }).toFile(tempPath);
            } else {
              await sharp(fullPath).jpeg({ quality: 80, mozjpeg: true }).toFile(tempPath);
            }
            await fs.rename(tempPath, fullPath);
            console.log(`Done compressing: ${fullPath}`);
          } catch (err) {
            console.error(`Error compressing image ${fullPath}:`, err);
          }
        } else if (/\.(mp4|webm|mkv|mov|avi)$/i.test(file.name)) {
          console.log(`Compressing video: ${fullPath}... (This might take a while)`);
          try {
            await compressVideo(fullPath, tempPath);
            await fs.rename(tempPath, fullPath);
            console.log(`Done compressing: ${fullPath}`);
          } catch (err) {
            console.error(`Error compressing video ${fullPath}:`, err);
          }
        }
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Directory "${directory}" not found. Create it or update the "dir" variable.`);
    } else {
      console.error(`Error reading directory ${directory}:`, err);
    }
  }
}

console.log('Starting media compression...');
processDirectory(dir).then(() => {
  console.log('Finished compressing all media in the public directory!');
}).catch(console.error);
