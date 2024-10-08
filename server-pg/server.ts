const http = require('http');
const fs = require('fs');
const { Client } = require('pg');
const multiparty = require('multiparty');

/**
 * Server Port
 */
const port = 3001;

/**
 * Connect to Postgres
 */
const client = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
client.connect();

/**
 * Create Server
 */
const server = http.createServer(async function (req, res) {
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
    /**
     * Get values from database
     */
    const query = await client.query('select * from feedbacks where name=$1;', [req.url.replace('/', '')]);
    const values = query.rows.length ? query.rows[0] : [];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(values));
    res.end();

    console.log('Requested', values);

    return;
  }

  /**
   * Upload File
   */
  if (req.url === '/upload' && req.method === 'POST') {
    const form = new multiparty.Form({ autoFiles: true });

    form.parse(req, async function (err, fields, files) {
      if (!files) {
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write('Incorrect request');
        res.end();
        return;
      }

      const filesArray = Object.values(files).reduce((acc, files) => acc.concat(files), []);

      /**
       * Insert files to database
       */
      await Promise.all(
        filesArray.map(async (file) => {
          const base64 = await fs.readFileSync(file.path, { encoding: 'base64' });
          await client.query('INSERT INTO files(name, file) VALUES($1, $2)', [file.originalFilename, base64]);
        })
      );

      res.writeHead(200, { 'content-type': 'text/plain' });
      res.write('Files uploaded');
      res.end();
    });

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

      const values = JSON.parse(body);
      console.log('Updated', values);

      /**
       * Update the database
       */
      await client.query(
        'INSERT INTO feedbacks(created, name, email, description, type) VALUES(NOW(), $1, $2, $3, $4)',
        [values['name'], values['email'], values['description'], values['type']]
      );
    });

    return;
  }
});

/**
 * Listen on port 3001
 */
server.listen(port);
console.log(`Server for Postgres is running on port ${port}...`);
