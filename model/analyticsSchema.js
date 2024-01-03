const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    name: String,
    views: Number,
    date: { type: Date, default: Date.now }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
