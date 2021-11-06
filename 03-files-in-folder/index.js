const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const filePath = path.join(__dirname, 'secret-folder');

const getFileInfo = (directory) => {
  fs.readdir(directory, (error, files) => {
    if (error) throw error;

    for (let file of files) {
      fs.stat(directory + '/' + file, (error, stats) => {
        if (error) throw error;
        if (stats.isFile()) {
          let fullNameFile = file;
          let fileExt =
            path.parse(file).ext === ''
              ? path.parse(file).name.slice(1)
              : path.parse(file).ext.slice(1);
          let nameFile =
            path.parse(file).ext === '' ? 'null' : path.parse(file).name;
          let fileSize = Number((stats.size / 1024).toFixed(3)) + 'kb';
          console.log(
            chalk.cyan(fullNameFile),
            '->',
            chalk.yellow(nameFile),
            '-',
            chalk.green(fileExt),
            '-',
            chalk.magenta(fileSize),
          );
        } else {
          getFileInfo(directory + '/' + file);
        }
      });
    }
  });
};

getFileInfo(filePath);
