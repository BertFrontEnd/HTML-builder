const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const srcFilePath = path.join(__dirname, 'files');
const distFilePath = path.join(__dirname, 'files-copy');

const readDir = async () => {
  await rm(distFilePath, { force: true, recursive: true });
  await mkdir(distFilePath, { recursive: true });
};

const copyFiles = async (fileName) => {
  const fileFrom = path.resolve(srcFilePath, fileName);
  console.log(fileFrom);
  const fileTo = path.resolve(distFilePath, fileName);
  console.log(fileTo);

  await copyFile(fileFrom, fileTo, (error) => {
    if (error) throw error;
  });
};

const getFiles = async () => {
  const dirArr = await readdir(srcFilePath, { withFileTypes: true });
  const dirFiles = dirArr.filter((elem) => elem.isFile());

  dirFiles.forEach((file) => copyFiles(file.name));
};

const copy = async () => {
  await readDir();
  await getFiles();
};

copy();

console.log(chalk.cyan('Copy is done!'));
