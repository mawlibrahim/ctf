const express = require('express');
const rateLimit = require('express-rate-limit');
const { createClient } = require('redis'); // Correctly import createClient from redis
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const redisClient = createClient(); // Create a Redis client

// Connect to Redis
redisClient.connect().catch(console.error);

// Handle Redis connection errors
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Set up rate limiter: maximum of 10 requests per second
const limiter = rateLimit({
    windowMs: 1 * 1000, // 1 second
    max: 10, // Limit each IP to 10 requests per window
    message: "Too many requests from this IP, please try again later.",
    skip: (req, res) => {
        return req.path === '/waiting';
    }
});

// Apply the rate limiter to all requests
app.use(limiter);

// Middleware to check server capacity
const MAX_CAPACITY = 10; // Define your server capacity

app.use(async (req, res, next) => {
    try {
        const currentUsers = await redisClient.lLen('waiting_queue'); // Get current queue length

        if (currentUsers >= MAX_CAPACITY) {
            // If the server is full, add user to the waiting queue
            const userId = req.ip; // Use IP as a unique identifier
            await redisClient.rPush('waiting_queue', userId); // Add user to the queue
            return res.redirect('/waiting'); // Redirect to waiting room
        }
        next(); // Proceed to the main page if not full
    } catch (error) {
        console.error('Error checking queue:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Main route
app.get('/', (req, res) => {
    res.send('Welcome to the main server!');
});

// Waiting room route
app.get('/waiting', async (req, res) => {
    try {
        const currentUsers = await redisClient.lLen('waiting_queue');
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
    } catch (error) {
        console.error('Error retrieving waiting room data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve user from the queue
app.get('/serve_user', async (req, res) => {
    try {
        const userId = await redisClient.lPop('waiting_queue'); // Remove user from the queue
        if (userId) {
            return res.redirect('/'); // Redirect to main page if served
        }
        res.send('No users in the queue.');
    } catch (error) {
        console.error('Error serving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');

    setInterval(async () => {
        try {
            const currentUsers = await redisClient.lLen('waiting_queue');
            const estimatedWaitTime = currentUsers * 5; // Example: 5 seconds per user
            socket.emit('update', { waitTime: estimatedWaitTime });
        } catch (error) {
            console.error('Error fetching current users:', error);
        }
    }, 5000); // Update every 5 seconds
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
