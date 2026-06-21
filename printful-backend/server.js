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

// Server-side price catalog — never trust client amounts
const PRODUCT_PRICES = {
  'Grizzly Core Tee':  3900,
  'Iron Cage Hoodie':  5900,
  'Mat Pro Shorts':    4500,
  'Grizzly Rashguard': 4200,
};

// ── Security ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60, message: { error: 'Too many requests' } });
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yoyocubano.github.io', 'https://blackrockcuban.weluxevents.store', process.env.FRONTEND_URL].filter(Boolean)
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
    try {
      await createPrintfulOrder({ session, items, shipping });
    } catch (err) {
      console.error('[Webhook] Printful order failed:', err.message);
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
