const http = require('http');

/**
 * Server Port
 */
const port = 5002;

/**
 * Delay map for apinum
 */
const delays = {
  1: 1000,
  2: 2000,
  3: 3000,
  4: 4000,
  5: 5000,
};

/**
 * Create Server
 */
const server = http.createServer(function (req, res) {
  /**
   * Set CORS headers
   */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  /**
   * Get delay for apinum
   */
  function getDelay(apinum) {
    if (apinum < 1 || apinum > 10) {
      return null;
    }
    return apinum * 1000;
  }

  /**
   * Parse URL
   */
  const urlObject = new URL(`http://localhost${req.url}`);

  /**
   * Handle GET requests to /boom/:apinum
   */
  if (req.method === 'GET' && urlObject.pathname.startsWith('/boom/')) {
    const parts = urlObject.pathname.split('/');
    const apinum = parts[2]; // boom/:apinum

    console.log('response typeof ', typeof apinum);
    const delay = getDelay(apinum);

    console.log(`📩 Request apinum=${apinum}, will respond in ${delay / 1000}s`);

    setTimeout(() => {
      const response = {
        apinum,
        value: `Response for apinum ${apinum}`,
        delayMs: delay,
        timestamp: new Date().toISOString(),
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(response));
      res.end();

      console.log(`✅ Responded for apinum=${apinum}`);
    }, delay);

    return;
  }

  /**
   * Default response for unknown routes
   */
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ error: 'Not found' }));
  res.end();
});

/**
 * Listen on port 5002
 */
server.listen(port);
console.log(`Server is running on port ${port}...`);
