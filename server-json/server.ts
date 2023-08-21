const http = require('http');

/**
 * Server Port
 */
const port = 3001;

/**
 * Values
 */
let values = { name: 'Name', amount: 30, updated: false, step: 4 };

/**
 * Create Server
 */
const server = http.createServer(function (req, res) {
  /**
   * Set CORS headers
   */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();

    return;
  }

  /**
   * GET
   */
  if (req.method === 'GET') {
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(values));
      res.end();

      console.log('Requested', values);
    }, 2000);

    return;
  }

  /**
   * POST, PUT or PATCH
   */
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    setTimeout(() => {
      let body = '';
      req.on('data', function (chunk) {
        body += chunk;
      });

      req.on('end', function () {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(`${req.method}: Success!`);
        res.end();

        values = JSON.parse(body);
        console.log('Updated', values);
      });
    }, 2000);

    return;
  }
});

/**
 * Listen on port 3001
 */
server.listen(port);
console.log(`Server is running on port ${port}...`);
