const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const filePath = path.join(__dirname, './', 'text.txt');

fs.readFile(filePath, 'utf8', (error, fileContent) => {
  if (error) throw error;
  const prettyText = chalk.blue(fileContent);
  console.log(prettyText);
});
