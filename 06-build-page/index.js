const { readdir, mkdir, rm, copyFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const srcFilePath = path.join(__dirname, 'styles');
const distFilePath = path.join(__dirname, 'project-dist');
const distFile = path.join(distFilePath, 'style.css');
const srcAssetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(distFilePath, 'assets');

const htmlComponentsPath = path.resolve(__dirname, 'components');
const htmlTemplatePath = path.resolve(__dirname, 'template.html');
const htmlMainPath = path.resolve(distFilePath, 'index.html');

const fileExt = '.css';

let arrStyles = [];
let writeableStream = '';

const readDir = async () => {
  await rm(distFilePath, { force: true, recursive: true });
  await mkdir(distFilePath, { recursive: true });

  writeableStream = fs.createWriteStream(distFile);
};

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

const getAssets = async (assetsFrom, assetsTo) => {
  await mkdir(assetsTo, { recursive: true });
  const dirArr = await readdir(assetsFrom, { withFileTypes: true });

  dirArr.forEach((elem) => {
    if (elem.isFile()) {
      const from = path.resolve(assetsFrom, elem.name);
      const to = path.resolve(assetsTo, elem.name);

      copyFile(from, to, null, (error) => {
        if (error) throw error;
      });
    } else if (elem.isDirectory()) {
      const nextAssetsFrom = path.resolve(assetsFrom, elem.name);
      const nextAssetsTo = path.resolve(assetsTo, elem.name);

      getAssets(nextAssetsFrom, nextAssetsTo);
    }
  });
};

const readHtmlTemplate = async () => {
  let htmlTemplate = '';
  const readableStream = fs.createReadStream(htmlTemplatePath);
  const promise = new Promise((res) => {
    readableStream.addListener('data', (data) => {
      htmlTemplate += data;
    });
    readableStream.addListener('end', () => {
      res(htmlTemplate);
    });
  });

  return promise;
};

const getHtmlTemplates = (template) => {
  return template.match(/\{\{.+\}\}/g);
};

const getHtmlComponentsName = async () => {
  const htmlComponentsName = (
    await readdir(htmlComponentsPath, {
      withFileTypes: true,
    })
  )
    .filter((file) => file.isFile() && path.extname(file.name) === '.html')
    .map((file) => path.basename(file.name, '.html'));

  return htmlComponentsName;
};

const replaceHtmlTemplate = async (template, matching) => {
  return Promise.all(
    matching.map(
      (match) =>
        new Promise((resolve) => {
          let componentHTML = '';
          const componentPath = path.resolve(
            __dirname,
            'components',
            `${match}.html`,
          );
          const reg = new RegExp(`\{\{${match}\}\}`);
          const readableTemplateStream = fs.createReadStream(componentPath);
          readableTemplateStream.addListener('data', (data) => {
            componentHTML += data;
          });
          readableTemplateStream.addListener('end', () => {
            template = template.replace(reg, componentHTML);
            resolve();
          });
        }),
    ),
  ).then(() => template);
};

const createHtmlLayout = async () => {
  const writeableHtmlStream = fs.createWriteStream(htmlMainPath);
  const htmlComponents = await getHtmlComponentsName();
  const htmlTemplate = await readHtmlTemplate();
  const htmlTemplates = getHtmlTemplates(htmlTemplate);
  const htmlMatching = htmlComponents.filter((component) =>
    htmlTemplates.includes(`{{${component}}}`),
  );
  const finishHtml = await replaceHtmlTemplate(htmlTemplate, htmlMatching);
  writeableHtmlStream.write(finishHtml);
};

const init = async () => {
  await readDir();
  await createBundle();
  await getAssets(srcAssetsPath, distAssetsPath);
  await createHtmlLayout();
};

init();

console.log(chalk.cyan('Create layout is done!'));
