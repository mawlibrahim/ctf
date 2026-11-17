const express = require('express');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const redisClient = createClient();

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 1 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later."
});

// Apply the rate limiter to all requests
app.use(limiter);

// Middleware to check server capacity
const MAX_CAPACITY = 100; // Define your server capacity

app.use(async (req, res, next) => {
    const currentUsers = await redisClient.llen('waiting_queue'); // Get current queue length

    if (currentUsers >= MAX_CAPACITY) {
        // If the server is full, add user to the waiting queue
        const userId = req.ip; // Use IP as a unique identifier
        await redisClient.rpush('waiting_queue', userId); // Add user to the queue
        return res.redirect('/waiting'); // Redirect to waiting room
    }
    next(); // Proceed to the main page if not full
});

// Main route
app.get('/', (req, res) => {
    res.send('Welcome to the main server!');
});

// Waiting room route
app.get('/waiting', async (req, res) => {
    const currentUsers = await redisClient.llen('waiting_queue');
    const estimatedWaitTime = currentUsers * 5; // Example: 5 seconds per user
    res.send(`
        <h1>You are in the waiting room.</h1>
        <p>Estimated wait time: ${estimatedWaitTime} seconds.</p>
        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();
            socket.on('update', (data) => {
                document.querySelector('p').innerText = 'Estimated wait time: ' + data.waitTime + ' seconds.';
            });
        </script>
    `);
});

// Serve user from the queue
app.get('/serve_user', async (req, res) => {
    const userId = await redisClient.lpop('waiting_queue'); // Remove user from the queue
    if (userId) {
        return res.redirect('/'); // Redirect to main page if served
    }
    res.send('No users in the queue.');
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');

    setInterval(async () => {
        const currentUsers = await redisClient.llen('waiting_queue');
        const estimatedWaitTime = currentUsers * 5; // Example: 5 seconds per user
        socket.emit('update', { waitTime: estimatedWaitTime });
    }, 5000); // Update every 5 seconds
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
