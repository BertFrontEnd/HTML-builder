const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './', 'text.txt');

const readableStream = fs.createReadStream(filePath, 'utf8');

readableStream.on('data', (fileContent) => {
  console.log(fileContent);
});
