require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your github pages domain (and local dev)
app.use(cors({
    origin: ['https://yoyocubano.github.io', 'http://127.0.0.1:5500', 'http://localhost:5500']
}));
app.use(express.json());

// Printful API Setup
const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_TOKEN = process.env.PRINTFUL_TOKEN;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID;

// Helper function to make Printful API requests
async function fetchFromPrintful(endpoint, options = {}) {
    const fetch = (await import('node-fetch')).default;
    const url = `${PRINTFUL_API_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Authorization': `Bearer ${PRINTFUL_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Printful API Error:', data);
            throw new Error(data.error?.message || 'Printful API connection failed');
        }
        
        return data.result;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'active', message: 'BlackRockCuban - Printful Gateway Operational' });
});

// Test Printful Connection Route
app.get('/api/printful/test', async (req, res) => {
    try {
        if (!PRINTFUL_STORE_ID) {
            throw new Error('Store ID missing in server configuration');
        }
        
        // Testing connection by fetching specific store info
        const storeInfo = await fetchFromPrintful(`/stores/${PRINTFUL_STORE_ID}`);
        res.json({
            success: true,
            message: 'Connected to Printful securely!',
            store: storeInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to connect to Printful',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Cuban Grizzly Gateway running on port ${PORT}`);
    console.log(`CORS enabled for: https://yoyocubano.github.io`);
});
