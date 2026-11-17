const http = require('http');
const url = require('url');
const crypto = require('crypto');

const MAX_CAPACITY = 10;
const queue = [];
const activeUsers = new Map(); // IP: { timestamp, token }

function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

function processQueue(res) {
  if (activeUsers.size < MAX_CAPACITY && queue.length > 0) {
    const nextInQueue = queue.shift();
    const ip = nextInQueue.ip;
    const token = generateToken();
    activeUsers.set(ip, { timestamp: Date.now(), token: token });

    // Redirect to the website with a token
    nextInQueue.res.writeHead(302, { 'Location': `/?token=${token}` });
    nextInQueue.res.end();
  }
}

function checkUserActivity() {
  const now = Date.now();
  const inactivityTimeout = 60 * 1000; // 1 minute timeout

  for (const [ip, user] of activeUsers.entries()) {
    if (now - user.timestamp > inactivityTimeout) {
      activeUsers.delete(ip);
      console.log(`User ${ip} timed out and was removed.`);
      processQueue(); // Check if the queue can be processed after a user leaves.
    }
  }
}

setInterval(checkUserActivity, 10000); // Check every 10 seconds

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const parsedUrl = url.parse(req.url, true);
  const token = parsedUrl.query.token;

  if (parsedUrl.pathname === '/queue-status') { // Add a status endpoint
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ queueLength: queue.length, activeUsers: activeUsers.size }));
    return;
  }

  if (token) {
    // Check if the token is valid
    const user = Array.from(activeUsers.values()).find(u => u.token === token);

    if (user) {
      // Valid token, update timestamp
      activeUsers.set(ip, { timestamp: Date.now(), token: token });
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Welcome to the website!</h1>');
      return;
    } else {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Invalid token.');
      return;
    }
  }

  if (activeUsers.has(ip)) {
    // User is already active, update timestamp and serve the website.
    activeUsers.get(ip).timestamp = Date.now();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to the website!</h1>');
    return;
  }

  if (activeUsers.size < MAX_CAPACITY) {
    // User can enter directly
    const token = generateToken();
    activeUsers.set(ip, { timestamp: Date.now(), token: token });
    res.writeHead(302, { 'Location': `/?token=${token}` });
    res.end();
    return;
  }

  // Add to queue
  queue.push({ ip: ip, res: res });
  res.writeHead(202, { 'Content-Type': 'text/plain' });
  res.end('You are in the waiting queue.');

  processQueue(); // Try to process the queue after a new request
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});