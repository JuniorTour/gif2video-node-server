const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');

ffmpeg.setFfmpegPath(ffmpegPath.path);

const outputFilePath = `../output`;

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function gifStream2Video({ inputStream, inputFileName, outputExt = '.webm' }) {
  const startTime = Date.now();

  // const inputExtname = path.extname(inputFileName)
  const outputFileName = inputFileName?.split('.')?.[0] + outputExt;
  const outputDir = path.resolve(__dirname, outputFilePath)
  createDir(outputDir)
  console.log(
    `Convert ${JSON.stringify(
      {
        inputFileName,
        // inputFilePath,
        outputDir,
        outputFileName,
      },
      null,
      2
    )}`
  );

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputStream)
      // gif 专用输入格式：https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/1013
      .inputFormat('gif_pipe')
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
      .save(path.resolve(outputDir, outputFileName));
  });
}

async function convertGifToVideo(stream, fileName) {
  debugger;
  gifStream2Video({
    inputStream: stream,
    inputFileName: fileName,
    outputExt: '.webm',
  });
}

async function startGif2Video(fileData, fileId) {
  const fileDataStream = Readable.from(fileData.buffer);
  convertGifToVideo(fileDataStream, fileData.originalname)
  .then(() => {
    // TODO upload to CDN File Server
    // uploadToCDN(fileId)
  });
}

module.exports = {
  startGif2Video,
};
