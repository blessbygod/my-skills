let express = require('express');
let fs = require('fs')

const Bot = require('./app/Bot')
let app = express()

app.get('/', function (req, res) {
    let cookie = req.headers.cookie;
    let dCookie = '<script>document.write(document.cookie);</script>'
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true  });
    res.send('<style>body{font-size: 60px;}</style>Cookie: ' + cookie + '<br>客户端Cookie：' +  dCookie)
});

// 探活请求
app.head('/', (req, res) => {
    res.sendStatus(204);
});

app.post('/', (req, res) => {
    req.rawBody = '';

    req.setEncoding('utf8');
    req.on('data', chunk => {
        req.rawBody += chunk;
    });

    req.on('end', () => {
        let b = new Bot(JSON.parse(req.rawBody));
        // 开启签名认证
        // 本地运行可以先注释
        b.initCertificate(req.headers, req.rawBody).enableVerifyRequestSign();

        b.run().then(result => {
            console.log(result)
            res.send(result);
        });
    });
}).listen(8016);

console.log('listen 8016');
