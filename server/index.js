const express = require('express')
const history = require('connect-history-api-fallback')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 8088
const distDir = path.join(__dirname, '../dist')

app.use(history())

if (fs.existsSync(distDir)) {
    app.use(express.static(path.join(__dirname, '../dist')))
} else {
    console.error('静态文件不存在')
}

app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`)
})
