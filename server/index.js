const express = require('express')
const history = require('connect-history-api-fallback')
const path = require('path')
const os = require('os')
const fs = require('fs')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()
const port = 8088
const distDir = path.join(__dirname, '../dist')

const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    ws: true
})

app.use(
    '/idm-platform-java',
    apiProxy
)

const getIPAdress = function () {
    const ips = []
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
        const iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i]
            if (['IPv4', 'IPv6'].includes(alias.family) && alias.address !== '127.0.0.1' && !alias.internal && alias.address.indexOf('::') === -1) {
                ips.push(alias.address)
            }
        }
    }
    return ips
}

app.use(history())

if (fs.existsSync(distDir)) {
    app.use(express.static(path.join(__dirname, '../dist')))
} else {
    console.error('静态文件不存在')
}

app.listen(port, () => {
    const ips = getIPAdress()
    let ipsAddr = ''
    ips.forEach((ip) => {
        ipsAddr += `\r\n➜  Network: http://${ip}:${port}/`
    })
    console.log(`server is running \r\n➜  Local:   http://localhost:${port}/ ${ipsAddr}`)
})
