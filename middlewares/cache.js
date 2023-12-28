const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedData = cache.get(key);

        if (cachedData) {
            console.log('Cache hit!');
            return res.render('game', { title: cachedData.name, data: cachedData });
        }

        res.origSend = res.send;
        res.send = (body) => {
            // Armazena os dados em cache por um período de tempo (duration)
            cache.put(key, body, duration);
            res.origSend(body);
        };

        next();
    };
};

module.exports = cacheMiddleware;
