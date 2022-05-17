const http = require('http');
const { Client } = require('pg');

/**
 * Server Port
 */
const port = 3001;

/**
  * Connect to Postgres
*/
const client = new Client({ user: '', password: '' });
client.connect();
 
/**
 * Parameters
 */
let parameters = { name: 'Name', amount: 30, updated: false, step: 4 };

/**
 * Create Server
 */
const server = http.createServer(async function (req, res) {
  // Set CORS headers
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
    /**
     * Get values from database
     */
    // const query = await client.query('Select count(1) from images');
    // console.log('SELECT Result', res.rows);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(parameters));
    res.end();

    console.log('Requested', parameters);

    return;
  }

  /**
   * POST, PUT or PATCH
   */
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });

    req.on('end', async function () {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(`${req.method}: Success!`);
      res.end();

      parameters = JSON.parse(body);
      console.log('Updated', parameters);

      /**
       * Update the database
       */
      //await client.query('INSERT INTO images VALUES($1, $2)', ['image-panel', '123']);
    });

    return;
  }
});

/**
 * Listen on port 3001
 */
server.listen(port);
console.log(`Server is running on port ${port}...`);
