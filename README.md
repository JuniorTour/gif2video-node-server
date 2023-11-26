# gif2video-node-server

基于 Node.js && Express 的GIF图片转视频文件服务器应用项目。

# 本地开发环境运行

``` shell
npm install
npm run start
```

本地开发环境启动后，访问 http://localhost:3088/upload-page 就可以在HTML页面中测试GIF图片转视频接口（ http://localhost:3088/gif2video ）的功能逻辑。

转化生成的视频文件，会保存在`${projectRoot}/masterials/${fileID}/${fileName}.${'mp4' | 'webm'}`路径下。

接口对应的逻辑就会生成视频文件到：
- `node-gif2video-server\materials\${fileId}\dynamic.mp4`
- `node-gif2video-server\materials\${fileId}\dynamic.webm`

> [《现代前端工程体验优化》](https://github.com/JuniorTour/blog/issues/12) 一书配套项目

欢迎 Issue && PR~
