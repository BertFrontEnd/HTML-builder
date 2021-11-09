const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const filePath = path.join(__dirname, './', 'text.txt');

const readableStream = fs.createReadStream(filePath, 'utf8');

readableStream.on('data', (fileContent) => {
  const prettyText = chalk.blue(fileContent);
  console.log(prettyText);
});
