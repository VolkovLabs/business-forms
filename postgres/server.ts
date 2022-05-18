const http = require('http');
const { Client } = require('pg');

/**
 * Server Port
 */
const port = 3001;

/**
  * Connect to Postgres
*/
const client = new Client({ host:'host.docker.internal', user: 'postgres', password: 'postgres' });
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
    const query = await client.query('select * from test_table where test_name=$1;', [req.url.replace('/','')]);
    console.log('SELECT', query.rows[0]);
    parameters = query.rows[0];

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
      await client.query('INSERT INTO test_table VALUES($1, $2)', [parameters['test_name'], parameters['test_age']]);
    });

    return;
  }
});

/**
 * Listen on port 3001
 */
server.listen(port);
console.log(`Server for Postgres is running on port ${port}...`);
