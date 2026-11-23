// SADECE DENEME İÇİN: gerçek backend hazır değilken frontend'i denemek için minik bir sahte backend.
// Hiçbir paket gerektirmez:  npm run mock-backend   (port değiştirmek için: PORT=9090)
// Her path'e 200 ile cevap verir ve gelen isteği geri döner.

import http from 'node:http';
import { text } from 'node:stream/consumers';

const port = Number(process.env.PORT) || 8080;

const server = http.createServer(async (req, res) => {
  // CORS: tarayıcı, başka bir adresten (localhost:3000) gelen isteğe ancak backend izin verirse cevabı gösterir.
  // Gerçek backend'in de benzer bir izin vermesi gerekir (bkz. README).
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  const body = await text(req);
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(
    JSON.stringify({
      message: 'Merhaba, ben mock backend!',
      received: { method: req.method, path: req.url, body: body || null }
    })
  );
});

server.listen(port, () => console.log(`Mock backend http://localhost:${port} adresinde dinliyor`));
