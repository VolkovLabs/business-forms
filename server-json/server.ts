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
const server = http.createServer(function (req: any, res: any) {
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
   * Get form
   */
  const urlObject = new URL(`http://localhost${req.url}`);
  if (urlObject.pathname === '/form') {
    const device = urlObject.searchParams.get('device') || '';
    const formElements: unknown[] = [
      {
        uid: 'device',
        id: 'device',
        title: 'Device',
        type: 'select',
        value: device,
        options: [
          {
            id: 'device1',
            label: 'device1',
            type: 'string',
            value: 'device1',
          },
          {
            id: 'device2',
            label: 'device2',
            type: 'string',
            value: 'device2',
          },
        ],
        optionsSource: 'Custom',
      },
    ];

    /**
     * Add device1 elements
     */
    if (device === 'device1') {
      formElements.push({
        uid: 'device1Field',
        id: 'device1Field',
        title: 'Device 1 Field',
        type: 'number',
        value: 0,
        min: 0,
        max: 10,
      });
    }

    /**
     * Add device2 elements
     */
    if (device === 'device2') {
      formElements.push({
        uid: 'device2Field',
        id: 'device2Field',
        title: 'Device 2 Field',
        type: 'number',
        value: 0,
        min: 0,
        max: 10,
      });
    }

    /**
     * Add common elements
     */
    formElements.push({
      uid: 'comment',
      id: 'comment',
      title: 'Comment',
      type: 'textarea',
      value: '',
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(formElements));
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
      req.on('data', function (chunk: any) {
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
