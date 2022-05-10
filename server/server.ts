const http = require('http');
const fs = require('fs');

/**
 * Server Port
 */
const port = 3001;

/**
 * Parameters
 */
const parameters = { name: 'Name', amount: 30, updated: false };

/**
 * Create Server
 */
const server = http.createServer(function (req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(parameters));
    res.end();

    console.log('Requested', parameters);

    return;
  }

  /**
   * POST
   */
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });

    req.on('end', function () {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('Success!');
      res.end();

      console.log('Updated', body);
    });

    return;
  }
});

/**
 * Listen on port 3001
 */
server.listen(port);
console.log(`Server is running on port ${port}...`);
