import fs from 'fs/promises';
import path from 'path';

const dir = 'src';

async function processDirectory(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await processDirectory(fullPath);
      } else if (file.isFile() && file.name.endsWith('.html')) {
        let content = await fs.readFile(fullPath, 'utf8');
        let originalContent = content;
        
        // Add loading="lazy" to <img> and <iframe> if not already present
        const imgIframeRegex = /<(img|iframe)\b(?![^>]*\bloading=["']lazy["'])/gi;
        content = content.replace(imgIframeRegex, '<$1 loading="lazy"');
        
        // Add preload="none" to <video> if not already present
        const videoRegex = /<video\b(?![^>]*\bpreload=["']none["'])/gi;
        content = content.replace(videoRegex, '<video preload="none"');
        
        if (content !== originalContent) {
          await fs.writeFile(fullPath, content, 'utf8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}:`, err);
  }
}

console.log('Adding lazy loading and preload="none" to media tags...');
processDirectory(dir).then(() => {
  console.log('Finished updating HTML files!');
}).catch(console.error);
