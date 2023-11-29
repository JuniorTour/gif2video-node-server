const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

async function reportGauge({ name, help, labels = {}, value, sampleRate = 1 }) {
  if (Math.random() > sampleRate) {
    return;
  }
  try {
    await fetch('http://localhost:4001/gauge-metric', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        help,
        labels,
        value,
      }),
    });
  } catch (error) {
    console.error(`reportGauge ERROR:`, error);
  }
}

async function reportSizeRatio(type, value) {
  value = Math.round(value * 1000) / 1000;
  reportGauge({
    name: `Gif2VideoSizeRatio_${type}`,
    help: `file size ratio of ${type}/GIF`,
    value,
    // sampleRate: 0.01,
  });
}

function getFileSize(type, files, targetDir) {
  const fileName = files.find((fileNmae) => fileNmae.includes(`.${type}`));
  return fs.statSync(path.resolve(targetDir, fileName)).size; // unit: byte
}

function getFilesStatus(targetDir) {
  console.log(`Run getFilesStatus for targetDir=${targetDir}`);
  if (!targetDir) {
    console.warn(`getFilesStatus targetDir=${targetDir} is falsy.`);
    return;
  }
  let files = fs.readdirSync(targetDir);
  if (!files?.length) {
    console.warn(`getFilesStatus files=${JSON.stringify(files)} is falsy.`);
    return;
  }
  const gifFileSize = getFileSize('gif', files, targetDir);
  const webmFileSize = getFileSize('webm', files, targetDir);
  const mp4FileSize = getFileSize('mp4', files, targetDir);
  console.log(
    JSON.stringify(
      {
        gifFileSize,
        webmFileSize,
        mp4FileSize,
      },
      null,
      2
    )
  );

  reportSizeRatio('Webm', webmFileSize / gifFileSize);
  reportSizeRatio('MP4', mp4FileSize / gifFileSize);
}

module.exports = {
  getFilesStatus,
};
