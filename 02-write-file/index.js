const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const filePath = path.join(__dirname, './', 'text.txt');
const interfaceObject = {
  input: process.stdin,
  output: process.stdout,
};
const r1 = readline.createInterface(interfaceObject);

const writeToFile = (message) => {
  if (message === 'exit') {
    console.log('Good Buy, see you later!');
    process.exit();
  } else {
    writeableStream.write(`${message} \n`);
  }
};

let writeableStream = '';

r1.on('line', (message) => {
  if (!writeableStream && message !== 'exit') {
    writeableStream = fs.createWriteStream(filePath, (error) => {
      if (error) throw error;
    });
  }
  writeToFile(message);
});

console.log('File is created, enter your message:');

interfaceObject.input.on('keypress', (chunk, key) => {
  if (key && key.name === 'c' && key.ctrl) {
    console.log('Good Buy, see you later!');
    process.exit();
  }
});
