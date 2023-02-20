const http = require('http');
const httpProxy = require('http-proxy');
const basicAuth = require('basic-auth');
const net = require('net');
const fs = require('fs');

let logger = fs.createWriteStream('./logs.txt');

const PORT = 8080;

const inBlacklist = require('./src/blacklist.js');
const CREDENTIALS = require('./src/credentials.js');

const server = http.createServer((req, res) => {
  try{
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (BLACKLIST.includes(url.hostname)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found.');
    } else {
        // Authenticate the user
        const auth = basicAuth.parse(req.headers['proxy-authorization']);
        if (auth) {
            console.log(auth);
        }
        if (!auth || !CREDENTIALS.some(cred => cred.username === auth.name && cred.password === auth.pass)) {
            res.writeHead(407, { 'Proxy-Authenticate': 'Basic realm="Proxy Authentication"' });
            res.end('Access denied');
        } else {
            logger.write(`URL: ${req.url}, USER: ${auth.name}\n`)
            console.log(`\x1b[31m\x1b[1mURL:\x1b[0m \x1b[33m${req.url}\x1b[0m, \x1b[31mUSER: \x1b[32m${auth.name}\x1b[0m`);

            const proxy = httpProxy.createProxyServer({ secure: false });
            proxy.web(req, res, { target: url.toString() }, err => {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not found.');
            });
        }
    }
  } catch(err){}
});

server.listen(PORT, () => {
    console.log(`Proxy server running at \x1b[36m\x1b[4mhttp://144.126.213.174:${PORT}\x1b[0m`);
});
server.on('clientError', (err, socket) => {
    socket.end('HTTP/2 400 Bad Request\n');
    console.log('client error\n', err);
});

server.on('connect', (req, clientSocket) => {
    try {
        const url = new URL(`https://${req.url}`);


        if (inBlacklist(url.hostname)) {
            clientSocket.write('HTTP/1.1 404 Not Found\r\n\r\nNot found.');
            clientSocket.end();
        } else {
            const auth = basicAuth.parse(req.headers['proxy-authorization']);

            if (auth) {
                // console.log(auth);
            }

            if (!auth || !CREDENTIALS.some(cred => cred.username === auth.name && cred.password === auth.pass)) {
                clientSocket.write('HTTP/1.1 407 Unauthorized\r\nProxy-Authenticate: Basic realm="Proxy Authentication"\r\n\r\nAccess denied');
                clientSocket.end();
            } else {
                logger.write(`URL: ${url}, USER: ${auth.name}\n`);
                console.log(`\x1b[31m\x1b[1mURL:\x1b[0m \x1b[33m${req.url}\x1b[0m, \x1b[31mUSER: \x1b[32m${auth.name}\x1b[0m`);

                const serverSocket = net.connect(url.port || 443, url.hostname, () => {
                    clientSocket.write('HTTP/1.1 200 Connection Established\r\nProxy-Agent: Node.js\r\n\r\n');
                    serverSocket.pipe(clientSocket);
                    clientSocket.pipe(serverSocket);
                });
            
                serverSocket.on('error', err => {
                    console.error(`Server socket error: ${err}`);
                    clientSocket.end();
                });
            }
        }
    } catch(err){}
});

process.on('uncaughtException', err => {});

process.on('exit',() => {
    logger.end();
})