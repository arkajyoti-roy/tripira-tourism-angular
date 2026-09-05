const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'index.html');
let content = fs.readFileSync(file, 'utf8');

const startStr = '<!-- Global Editorial Loader -->';
const endStr = '/* Google Translate Widget Styling */';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex > -1 && endIndex > -1) {
  const styleIndex = content.lastIndexOf('<style>', endIndex);
  if (styleIndex > startIndex) {
    const prefix = content.substring(0, startIndex);
    const suffix = content.substring(styleIndex);
    const newLoader = `<!-- Global Editorial Loader (Static Background) -->\n  <div id="global-loader" style="position: fixed; inset: 0; z-index: 99999; background-color: #111;"></div>\n\n  `;
    fs.writeFileSync(file, prefix + newLoader + suffix);
    console.log('Success');
  } else {
    console.log('Failed to find <style>');
  }
} else {
  console.log('Failed to find boundaries in node script');
}
