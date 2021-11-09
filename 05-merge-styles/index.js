const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const srcFilePath = path.join(__dirname, 'styles');
const distFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
const fileExt = '.css';

let arrStyles = [];
let writeableStream = fs.createWriteStream(distFilePath);

const getStyleFiles = async () => {
  let files = await readdir(srcFilePath);
  let cssFiles = files.filter((file) => path.extname(file) === fileExt);

  return cssFiles;
};

const readStyleFiles = async (file) => {
  let styles = '';
  let promise = new Promise((resolve) => {
    let readableStream = fs.createReadStream(path.resolve(srcFilePath, file));
    readableStream.addListener('data', (data) => {
      styles += data;
    });
    readableStream.addListener('end', (error) => {
      if (error) throw error;
      resolve(styles);
    });
  });

  return promise;
};

const writeStylesFile = async () => {
  arrStyles.forEach(
    async (style) =>
      await style.then((data) => {
        writeableStream.write(data);
      }),
  );
};

const createBundle = async () => {
  const cssFiles = await getStyleFiles();
  cssFiles.forEach((cssFile) => {
    arrStyles.push(readStyleFiles(cssFile));
  });

  writeStylesFile();
};

createBundle();

console.log('Create bundle is done!');
