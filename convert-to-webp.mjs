import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dir = 'public';

async function processDirectory(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.isFile()) {
        if (/\.(png|jpe?g)$/i.test(file.name)) {
          const ext = path.extname(file.name);
          const webpPath = fullPath.substring(0, fullPath.lastIndexOf(ext)) + '.webp';
          
          console.log(`Converting image: ${fullPath} to ${webpPath}...`);
          try {
            await sharp(fullPath).webp({ quality: 90, effort: 6 }).toFile(webpPath);
            await fs.unlink(fullPath); // Delete the original file
            console.log(`Done converting and deleted original: ${fullPath}`);
          } catch (err) {
            console.error(`Error converting image ${fullPath}:`, err);
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

console.log('Starting WebP conversion...');
processDirectory(dir).then(() => {
  console.log('Finished converting all images to WebP in the public directory!');
}).catch(console.error);
