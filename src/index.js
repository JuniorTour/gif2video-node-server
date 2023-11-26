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
  const fileId = uuid();
  
  // https://www.npmjs.com/package/multer#file-information
  startGif2Video(fileId, req.file);

  res.send({
    msg: 'FormData数据已接收',
    fileId,
  });
});

app.listen(port, () => {
  console.log(`Gif2Video Server listening on http://localhost:${port}`);
});
