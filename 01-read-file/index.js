const fs = require('fs');
fs.readFile('./text.txt', 'utf8', function (error, fileContent) {
  if (error) throw error;
  console.log(fileContent);
});
