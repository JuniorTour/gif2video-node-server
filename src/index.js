const express = require('express');
const { startGif2Video } = require('./convert');
const multer = require('multer');
const { v4: uuid } = require('uuid');

const upload = multer();

const app = express();
const port = 3088;

app.get('/upload-page', (req, res) => {
  res.sendFile(__dirname + '/upload-page.html');
});

app.post('/gif2video', upload.single('file'), async (req, res) => {
  console.log(`/gif2video get formData`);
  const fileId = uuid();  // 生成 ID 用于到CDN上查找Gif图片转化后的视频文件

  // typeof req.file === 'object'
  // file data: https://github.com/expressjs/multer#file-information
  // req.body: name, type
  startGif2Video(req.file, fileId);

  res.send({
    msg: 'upload success',
    fileId,
  });
});

app.listen(port, () => {
  console.log(`Gif2Video Server listening on http://localhost:${port}`);
});
