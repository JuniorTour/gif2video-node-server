const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath.path);
const CONVERT_STATUS = {
  convertFinish: 'convertFinish',
  convertFailed: 'convertFailed',
  uploadFinish: 'uploadFinish',
  uploadFailed: 'uploadFailed',
};
const materialsPath = `../materials/`;
const gifExt = '.gif';

function getGifDir(fileId) {
  return path.resolve(__dirname, `${materialsPath}${fileId}`);
}

function createDir(dir) {
  if (fs.existsSync(dir)) {
    return;
  }
  fs.mkdirSync(dir);
}

async function saveFile(fileId, { buffer, originalname }) {
  // const blob = new Blob(chunks, {type: 'video/webm'})
  // const buffer = Buffer.from( await blob.arrayBuffer() );
  const fileDir = getGifDir(fileId);
  createDir(fileDir);
  console.log(`fileDir=${fileDir}`);
  fs.writeFileSync(path.resolve(fileDir, originalname), buffer);
}

async function convertGifFileToVideo({ name, absPath }, targetExtention) {
  const startTime = Date.now();

  const outputFilePath = absPath.replace(name, '');
  const outputFileName = name.replace(gifExt, '') + `.${targetExtention}`;
  console.log(
    JSON.stringify(
      {
        outputFilePath,
        outputFileName,
      },
      null,
      2
    )
  );

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(absPath)
      // .videoCodec('libx264')
      // .inputFPS(24)
      // .size('320x240')
      .on('stderr', function (stderrLine) {
        console.log('[FFmpeg] ' + stderrLine);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .on('end', () => {
        console.log(
          `[FFmpeg] Convert end. Time cost: ${Date.now() - startTime} ms`
        );
        resolve();
      })
      .save(path.resolve(outputFilePath, outputFileName));
  });
}

function getGifFilePath(fileId) {
  const dir = getGifDir(fileId);
  const files = fs.readdirSync(dir);
  console.log(`files=${JSON.stringify(files)}`);
  const gifFileName = files.find((name) => name.endsWith(gifExt));
  if (!gifFileName) {
    console.warn(`Not Found Gif File in ${dir}`);
    return;
  }
  return {
    name: gifFileName,
    absPath: path.resolve(dir, gifFileName),
  };
}

async function runConvertFile(fileId) {
  const gifData = getGifFilePath(fileId);
  console.log(`gifData=${JSON.stringify(gifData)}`);
  try {
    await convertGifFileToVideo(gifData, 'webm');
    await convertGifFileToVideo(gifData, 'mp4');
  } catch (error) {
    console.error(`runConvertFile ERROR:`, error);
    return false;
  }
  return true;
}

function afterConvertRenameDir(fileId, convertSuccess) {
  const gifDirPath = getGifDir(fileId);
  const newGifDirPath = gifDirPath.replace(
    fileId,
    `${
      convertSuccess
        ? CONVERT_STATUS.convertFinish
        : CONVERT_STATUS.convertFailed
    }_${fileId}`
  );
  console.log(`renameGifDir \nfrom:${gifDirPath}\nto  :${newGifDirPath}`);
  fs.renameSync(gifDirPath, newGifDirPath);
}

async function startGif2Video(fileId, file) {
  saveFile(fileId, file);
  const convertSuccess = await runConvertFile(fileId);
  afterConvertRenameDir(fileId, convertSuccess)
  // TODO upload to CDN File Server
}

module.exports = {
  startGif2Video,
};
