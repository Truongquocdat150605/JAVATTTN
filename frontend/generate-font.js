const fs = require('fs');
const https = require('https');

// Create directory if not exists
if (!fs.existsSync('src/utils')) {
  fs.mkdirSync('src/utils', { recursive: true });
}

https.get('https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf', (res) => {
  const file = fs.createWriteStream('Roboto-Regular.ttf');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    const buf = fs.readFileSync('Roboto-Regular.ttf');
    const b64 = buf.toString('base64');
    const scriptContent = `export const addCustomFont = (doc) => {
  doc.addFileToVFS('Roboto-Regular.ttf', '${b64}');
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
};`;
    fs.writeFileSync('src/utils/pdfFont.js', scriptContent);
    console.log('Font generated at src/utils/pdfFont.js');
    fs.unlinkSync('Roboto-Regular.ttf'); // cleanup
  });
}).on('error', (err) => {
  console.error('Error downloading font:', err);
});
