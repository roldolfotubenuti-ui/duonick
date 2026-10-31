const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = Number(process.env.PORT) || 3080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function createAppServer() {
  return http.createServer((req, res) => {
    const cleanUrl = (req.url || '/').split('?')[0];
    const relativePath = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
    const filePath = path.join(__dirname, relativePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 - Arquivo não encontrado');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Erro interno do servidor: ${err.code}`);
        }
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
  });
}

function startServer(port) {
  const server = createAppServer();

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.log(`Porta ${port} já está em uso. Tentando porta ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Erro ao iniciar o servidor:', err);
      process.exit(1);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`  Servidor rodando em: http://localhost:${port}/`);
    console.log(`==================================================\n`);
  });
}

startServer(DEFAULT_PORT);
