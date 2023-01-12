const http = require('http');
const mysql = require('mysql');

/**
 * Environment variables
 */
const port = process.env.GRAFANA_API_SERVER_MYSQL_PORT;
const q1_get_req_url = process.env.GRAFANA_API_SERVER_MYSQL_Q1_GET_REQ_URL;
const q1_get_sql_query = process.env.GRAFANA_API_SERVER_MYSQL_Q1_GET_SQL_QUERY;
const q1_post_req_url = process.env.GRAFANA_API_SERVER_MYSQL_Q1_POST_REQ_URL;
const q1_post_sql_query = process.env.GRAFANA_API_SERVER_MYSQL_Q1_POST_SQL_QUERY;
const q1_post_sql_query_values = process.env.GRAFANA_API_SERVER_MYSQL_Q1_POST_SQL_QUERY_VALUES.split(", ");

/**
 * Connect to Mysql
 */
const client = mysql.createPool({
  host: process.env.GRAFANA_API_SERVER_MYSQL_HOST,
  user: process.env.GRAFANA_API_SERVER_MYSQL_USER,
  password: process.env.GRAFANA_API_SERVER_MYSQL_PASSWORD,
  database: process.env.GRAFANA_API_SERVER_MYSQL_DB
});
// Check MySQL connection
client.getConnection(function (err, connection) {
  // When done with the connection, destroy it.
  connection.destroy();
  if (err) throw err;
  console.log('MySQL server connection is successful!');
});

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

  // print url
  console.log(req.url)

  /**
   * GET
   */
  if (req.method === 'GET') {
    /**
     * Get values from database
     */
    // q1 GET FEEDBACKS
    if (q1_get_req_url.indexOf(req.url)) {

      // define grafana username
      const req_url_username = req.url.split('?')[1];

      await client.query(
        q1_get_sql_query,
        [req_url_username],
        function (err, results) {

          if (err) {
            console.error('Error in q1_get_req_url sql query: ' + err.stack);
            return;
          }

          const values = results[0];

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(values));
          res.end();

          console.log('Requested', values);
          console.log('q1_get_req_url sql query completed successfully!');
          return;

        }
      );

    }
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
      // q1 POST FEEDBACKS
      if (req.url === q1_post_req_url) {
        await client.query(
          q1_post_sql_query,
          [
            values[q1_post_sql_query_values[0]],
            values[q1_post_sql_query_values[1]],
            values[q1_post_sql_query_values[2]],
            values[q1_post_sql_query_values[3]]
          ],
          function (err) {

            if (err) {
              console.error('Error in q1_post_req_url sql query: ' + err.stack);
              return;
            }

            console.log('q1_post_req_url sql query completed successfully!');
            return;

          }
        );
      }

    });
  }
});

/**
 * Listen on port
 */
server.listen(port);
console.log(`Server for Mysql is running on port ${port}...`);
