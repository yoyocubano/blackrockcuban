require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const stripe     = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app  = express();
const PORT = process.env.PORT || 3000;

const PRINTFUL_API_URL  = 'https://api.printful.com';
const PRINTFUL_TOKEN    = process.env.PRINTFUL_TOKEN;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID;

const GELATO_API_URL = 'https://order.gelatoapis.com';
const GELATO_API_KEY = process.env.GELATO_API_KEY;

// Server-side price catalog — never trust client amounts
const PRODUCT_PRICES = {
  // ── Original BRC (Printful) ──
  'Grizzly Core Tee':       3900,
  'Iron Cage Hoodie':       5900,
  'Mat Pro Shorts':         4500,
  'Grizzly Rashguard':      4200,
  // ── DTG Custom (Printful) ──
  'Pro Combat Jersey':      4500,
  'Grizzly Elite Hoodie':   6500,
  'Tactical Snapback':      2500,
  'Combat Rash Guard':      4200,
  'Grizzly Grappling Shorts': 3900,
  'Strategic Duffel':       5500,
  // ── White Label (Gelato) ──
  'BRC Premium Tee':        4200,
  'Cuban Grizzly Hoodie':   7200,
  'BRC Bomber Jacket':      9500,
  'BRC Grappling Shorts':   5500,
  'BRC Performance Tank':   3500,
  'BRC Coach Jacket':       8800,
};

// Products fulfilled by Gelato vs Printful
const GELATO_PRODUCTS = new Set([
  'BRC Premium Tee', 'Cuban Grizzly Hoodie', 'BRC Bomber Jacket',
  'BRC Grappling Shorts', 'BRC Performance Tank', 'BRC Coach Jacket',
]);

// ── Security ──────────────────────────────────────────────
app.set('trust proxy', 1); // Railway runs behind a proxy
app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60, message: { error: 'Too many requests' } });
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://yoyocubano.github.io',
        'http://yoyocubano.github.io',
        'https://blackrockcuban.weluxevents.store',
        'http://blackrockcuban.weluxevents.store',   // until GitHub Pages SSL cert propagates
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : true
}));

// ── Stripe Webhook (raw body — before json middleware) ────
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Webhook] Signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const items   = JSON.parse(session.metadata?.order_items || '[]');
    const shipping = session.shipping_details;

    console.log(`[Webhook] Payment confirmed — session ${session.id}`);
    const gelatoItems   = items.filter(n => GELATO_PRODUCTS.has(n));
    const printfulItems = items.filter(n => !GELATO_PRODUCTS.has(n));
    if (gelatoItems.length) {
      try { await createGelatoOrder({ session, items: gelatoItems, shipping }); }
      catch (err) { console.error('[Webhook] Gelato order failed:', err.message); }
    }
    if (printfulItems.length) {
      try { await createPrintfulOrder({ session, items: printfulItems, shipping }); }
      catch (err) { console.error('[Webhook] Printful order failed:', err.message); }
    }
  }

  res.json({ received: true });
});

app.use(express.json({ limit: '1mb' }));

// ── Printful helper ───────────────────────────────────────
async function fetchFromPrintful(endpoint, options = {}) {
  const { default: fetch } = await import('node-fetch');
  const res = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PRINTFUL_TOKEN}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': PRINTFUL_STORE_ID,
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Printful API error');
  return data.result;
}

async function createPrintfulOrder({ session, items, shipping }) {
  if (!PRINTFUL_TOKEN || !PRINTFUL_STORE_ID) return;
  const addr = shipping?.address || {};
  const body = {
    external_id: session.id,
    recipient: {
      name:         shipping?.name || 'Customer',
      address1:     addr.line1 || '',
      city:         addr.city  || '',
      state_code:   addr.state || '',
      country_code: addr.country || 'US',
      zip:          addr.postal_code || '',
      email:        session.customer_details?.email || ''
    },
    items: items.map(name => ({
      name,
      quantity:     1,
      retail_price: ((PRODUCT_PRICES[name] || 3900) / 100).toFixed(2)
    }))
  };
  return fetchFromPrintful('/orders', { method: 'POST', body: JSON.stringify(body) });
}

// ── Health ────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  status:   'ok',
  service:  'BlackRockCuban Gateway',
  stripe:   !!process.env.STRIPE_SECRET_KEY,
  printful: !!PRINTFUL_TOKEN,
}));

// ── Create Stripe Checkout Session ────────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const { items, success_url, cancel_url } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'items array required' });

    const lineItems = [];
    for (const item of items) {
      const serverPrice = PRODUCT_PRICES[item.name];
      if (!serverPrice) return res.status(400).json({ error: `Unknown product: ${item.name}` });
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name, ...(item.image ? { images: [item.image] } : {}) },
          unit_amount: serverPrice,
        },
        quantity: Math.max(1, Math.min(10, parseInt(item.quantity) || 1)),
      });
    }

    const origin = process.env.FRONTEND_URL || 'https://yoyocubano.github.io';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'ES', 'FR', 'DE', 'LU', 'BE', 'NL'],
      },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 500, currency: 'usd' },
          display_name: 'Standard Shipping (Printful)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      }],
      line_items:  lineItems,
      mode:        'payment',
      success_url: success_url || `${origin}/blackrockcuban/?status=success`,
      cancel_url:  cancel_url  || `${origin}/blackrockcuban/?status=cancelled`,
      metadata: {
        source:      'BlackRockCuban',
        order_items: JSON.stringify(items.map(i => i.name))
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('[Checkout] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Gelato helper ─────────────────────────────────────────
async function createGelatoOrder({ session, items, shipping }) {
  if (!GELATO_API_KEY) {
    console.warn('[Gelato] GELATO_API_KEY not set — order not created');
    return;
  }
  const { default: fetch } = await import('node-fetch');
  const addr = shipping?.address || {};
  const body = {
    orderReferenceId: session.id,
    customerReferenceId: session.customer_details?.email || session.id,
    currency: 'USD',
    items: items.map((name, i) => ({
      itemReferenceId: `item-${i}`,
      productUid: gelatoProductUid(name),
      quantity: 1,
      fileUrl: process.env.GELATO_DESIGN_URL || 'https://yoyocubano.github.io/blackrockcuban/assets/BRC_Ready_to_Print_Preview.png',
    })),
    shippingAddress: {
      firstName: (shipping?.name || 'Customer').split(' ')[0],
      lastName:  (shipping?.name || 'Customer').split(' ').slice(1).join(' ') || '-',
      addressLine1: addr.line1 || '',
      city:        addr.city  || '',
      postCode:    addr.postal_code || '',
      country:     addr.country || 'US',
      email:       session.customer_details?.email || '',
    },
  };
  const res = await fetch(`${GELATO_API_URL}/v4/orders`, {
    method: 'POST',
    headers: { 'X-API-KEY': GELATO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gelato API error');
  console.log(`[Gelato] Order created: ${data.id}`);
  return data;
}

function gelatoProductUid(name) {
  const map = {
    'BRC Premium Tee':      'apparel_product_gca_t-shirt_gsc_unisex-t-shirt_gcu_white_gqa_xs-4xl',
    'Cuban Grizzly Hoodie': 'apparel_product_gca_hoodie_gsc_unisex-heavy-blend-hooded-sweatshirt_gcu_black_gqa_xs-3xl',
    'BRC Bomber Jacket':    'apparel_product_gca_jacket_gsc_unisex-lightweight-bomber-jacket_gcu_black_gqa_xs-3xl',
    'BRC Grappling Shorts': 'apparel_product_gca_shorts_gsc_unisex-training-shorts_gcu_black_gqa_xs-3xl',
    'BRC Performance Tank': 'apparel_product_gca_tank-top_gsc_unisex-performance-tank_gcu_black_gqa_xs-2xl',
    'BRC Coach Jacket':     'apparel_product_gca_jacket_gsc_unisex-coach-jacket_gcu_black_gqa_xs-3xl',
  };
  return map[name] || 'apparel_product_gca_t-shirt_gsc_unisex-t-shirt_gcu_white_gqa_xs-4xl';
}

// ── Printful store test ───────────────────────────────────
app.get('/api/printful/test', async (req, res) => {
  try {
    const store = await fetchFromPrintful(`/stores/${PRINTFUL_STORE_ID}`);
    res.json({ success: true, store });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`BlackRockCuban Gateway on port ${PORT}`);
  console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗'} | Printful: ${PRINTFUL_TOKEN ? '✓' : '✗'}`);
});
