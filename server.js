const http = require('http')

const server = http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/palin; charset=utf-8') //防止乱码
  console.log(req.url)
  if (req.url === '/test')
    res.end('ajax ok！')
})

server.listen(8888)
