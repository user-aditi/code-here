const { createClient }  = require('redis');

const redisUrl = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/"/g, '').trim();
const host = redisUrl.replace(/^https?:\/\//, '');
const password = (process.env.UPSTASH_REDIS_REST_TOKEN || '').replace(/"/g, '').trim();

const redisClient = createClient({
    username: 'default',
    password: password,
    socket: {
        host: host,
        port: 6379,
        tls: true
    }
});

module.exports = redisClient;