require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY missing in server config');
        }

        const { items, success_url, cancel_url } = req.body;

        // Map cart items to Stripe line items
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    // images: [item.image], // Optional: can pass product mockups
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.quantity || 1,
        }));

        // Provide necessary URLs or rely on headers for local testing
        const hostUrl = req.headers.origin || 'https://yoyocubano.github.io';
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'ES', 'FR'], // Adjust based on your shipping capabilities
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 500, // $5 flat rate shipping
                            currency: 'usd',
                        },
                        display_name: 'Standard Shipping (Printful)',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 3 },
                            maximum: { unit: 'business_day', value: 7 },
                        },
                    },
                },
            ],
            line_items: lineItems,
            mode: 'payment',
            success_url: success_url || `${hostUrl}/blackrockcuban/?status=success`,
            cancel_url: cancel_url || `${hostUrl}/blackrockcuban/?status=cancelled`,
            metadata: {
                source: 'BlackRockCuban',
                // We'll store what the customer ordered here to tell Printful later
                order_items: JSON.stringify(items.map(i => i.name))
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Cuban Grizzly Gateway running on port ${PORT}`);
    console.log(`CORS enabled for: https://yoyocubano.github.io`);
});
