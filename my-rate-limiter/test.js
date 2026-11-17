const { createClient } = require('redis');

// Create a Redis client
const redisClient = createClient();

// Connect to Redis
redisClient.connect()
    .then(() => {
        console.log('Connected to Redis');
    })
    .catch(err => {
        console.error('Redis connection error:', err);
    });
