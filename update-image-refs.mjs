import fs from 'fs/promises';
import path from 'path';

const srcDir = 'src';

async function processDirectory(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.isFile()) {
        if (/\.(html|ts|css|scss)$/i.test(file.name)) {
          let content = await fs.readFile(fullPath, 'utf-8');
          // Replace .png, .jpg, .jpeg with .webp (case insensitive)
          const newContent = content.replace(/\.(png|jpe?g)/gi, '.webp');
          
          if (content !== newContent) {
            console.log(`Updating references in: ${fullPath}`);
            await fs.writeFile(fullPath, newContent, 'utf-8');
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}:`, err);
  }
}

console.log('Starting image reference updates...');
processDirectory(srcDir).then(() => {
  console.log('Finished updating image references in src directory!');
}).catch(console.error);
