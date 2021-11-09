const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const path = require('path');

const srcFilePath = path.join(__dirname, 'files');
const distFilePath = path.join(__dirname, 'files-copy');

const readDir = async () => {
  await rm(distFilePath, { force: true, recursive: true });
  await mkdir(distFilePath, { recursive: true });
};

const copyFiles = async (fileName) => {
  const fileFrom = path.resolve(srcFilePath, fileName);
  const fileTo = path.resolve(distFilePath, fileName);

  await copyFile(fileFrom, fileTo, null, (error) => {
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

console.log('Copy is done!');
