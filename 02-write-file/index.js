const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');
const process = require('process');

const filePath = path.join(__dirname, './', 'text.txt');
const interfaceObject = {
  input: process.stdin,
  output: process.stdout,
};
const r1 = readline.createInterface(interfaceObject);

const prettyTextToExit = chalk.bgGreen('Good Buy, see you later!');

const writeToFile = (message) => {
  if (message === 'exit') {
    console.log(prettyTextToExit);
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

const prettyTextStart = chalk.bgMagenta('File is created, enter your message:');
console.log(prettyTextStart);

interfaceObject.input.on('keypress', (chunk, key) => {
  if (key && key.name === 'c' && key.ctrl) {
    console.log(prettyTextToExit);
    process.exit();
  }
});
