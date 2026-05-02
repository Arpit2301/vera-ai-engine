require('dotenv').config();

const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
global.fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

// 🕵️ THE UPGRADED (AND SAFE) SPY CAMERA
app.use((req, res, next) => {
    console.log(`\n🕵️ JUDGE INCOMING: ${req.method} request to -> ${req.originalUrl}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 PAYLOAD:`, JSON.stringify(req.body, null, 2));
    }
    next();
});

// --- THE SECRET V1 WARMUP ROUTE ---
app.get('/v1/healthz', (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Vera AI Engine is running smoothly!' 
    });
});

const apiRoutes = require('./src/api/routes');

app.use('/api', apiRoutes);
app.use('/v1', apiRoutes);

app.use((req, res) => {
    console.log(`❌ 404 ERROR: We don't have a route for ${req.originalUrl}`);
    res.status(404).json({ error: 'Not Found' });
});

// Export for Vercel serverless
module.exports = app;

// For local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;