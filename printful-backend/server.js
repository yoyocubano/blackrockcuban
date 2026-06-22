require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const stripe    = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app  = express();
const PORT = process.env.PORT || 3000;

const PRINTIFY_TOKEN   = process.env.PRINTIFY_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID || '26750273';
const PRINTIFY_API     = 'https://api.printify.com/v1';

// ── SIZE → VARIANT ID MAP (Black only, per garment blueprint) ──
const SIZE_VARIANTS = {
  hoodie:     { S: 32918, M: 32919, L: 32920, XL: 32921, '2XL': 32922 },
  crewneck:   { S: 25397, M: 25428, L: 25459, XL: 25490 },
  sweatpants: { S: 103932, M: 103933, L: 103934, XL: 103935 },
  shorts:     { '2XL': 125494, L: 125496, M: 125498, S: 125500, XL: 125502, XS: 125504 },
  tee:        { S: 12122, M: 12123, L: 12124, XL: 12125 },
};

// ── PRINTIFY PRODUCT CATALOG ──────────────────────────────────
// product_id → { printify_id, price_cents, garment_type, image_url }
const CATALOG = {
  // ── SIGNATURE ────────────────────────────────────────────────
  'BRC Signature Tee':        { id: '6a393096170435f0cb0557df', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a393096170435f0cb0557df/12124/92570/brc-signature-tee.jpg?camera_label=front' },
  'BRC Signature Shorts':     { id: '6a3930cb7b55aee853001c2c', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930cb7b55aee853001c2c/125496/112022/brc-signature-shorts.jpg?camera_label=front' },
  'BRC BRC Hoodie':           { id: '6a39342676c7a1ac0207d200', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a39342676c7a1ac0207d200/32920/98424/brc-brc-hoodie.jpg?camera_label=front' },
  'BRC BRC Crewneck':         { id: '6a39343654ae9d32500c5303', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a39343654ae9d32500c5303/25459/98502/brc-brc-crewneck.jpg?camera_label=front' },
  'BRC BRC Shorts':           { id: '6a3934467b55aee853002053', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3934467b55aee853002053/125496/112022/brc-brc-shorts.jpg?camera_label=front' },
  'BRC BRC Sweatpants':       { id: '6a39345467e671ee94075c9b', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a39345467e671ee94075c9b/103934/126668/brc-brc-sweatpants.jpg?camera_label=front' },
  // ── IRON WOLF ────────────────────────────────────────────────
  'BRC Iron Wolf Tee':        { id: '6a39309b170435f0cb0557e2', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a39309b170435f0cb0557e2/12124/92570/brc-iron-wolf-tee.jpg?camera_label=front' },
  'BRC Iron Wolf Hoodie':     { id: '6a393468170435f0cb055bca', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a393468170435f0cb055bca/32920/98424/brc-iron-wolf-hoodie.jpg?camera_label=front' },
  'BRC Iron Wolf Crewneck':   { id: '6a393475cbc1623ff404cf62', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a393475cbc1623ff404cf62/25459/98502/brc-iron-wolf-crewneck.jpg?camera_label=front' },
  'BRC Iron Wolf Shorts':     { id: '6a3930cec1b0872222023326', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930cec1b0872222023326/125496/112022/brc-iron-wolf-shorts.jpg?camera_label=front' },
  'BRC Iron Wolf Sweatpants': { id: '6a39348f54ae9d32500c5396', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a39348f54ae9d32500c5396/103934/126668/brc-iron-wolf-sweatpants.jpg?camera_label=front' },
  // ── IRON BULL ────────────────────────────────────────────────
  'BRC Iron Bull Tee':        { id: '6a3930a2cbc1623ff404cb47', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a3930a2cbc1623ff404cb47/12124/92570/brc-iron-bull-tee.jpg?camera_label=front' },
  'BRC Iron Bull Hoodie':     { id: '6a393499170435f0cb055c33', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a393499170435f0cb055c33/32920/98424/brc-iron-bull-hoodie.jpg?camera_label=front' },
  'BRC Iron Bull Crewneck':   { id: '6a3934a67b55aee8530020e6', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a3934a67b55aee8530020e6/25459/98502/brc-iron-bull-crewneck.jpg?camera_label=front' },
  'BRC Iron Bull Shorts':     { id: '6a3930d27b55aee853001c34', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930d27b55aee853001c34/125496/112022/brc-iron-bull-shorts.jpg?camera_label=front' },
  'BRC Iron Bull Sweatpants': { id: '6a3934c276c7a1ac0207d2c8', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a3934c276c7a1ac0207d2c8/103934/126668/brc-iron-bull-sweatpants.jpg?camera_label=front' },
  // ── IRON EAGLE ───────────────────────────────────────────────
  'BRC Iron Eagle Tee':        { id: '6a3930aacbc1623ff404cb49', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a3930aacbc1623ff404cb49/12124/92570/brc-iron-eagle-tee.jpg?camera_label=front' },
  'BRC Iron Eagle Hoodie':     { id: '6a3934ca35ee8c84970e50ab', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a3934ca35ee8c84970e50ab/32920/98424/brc-iron-eagle-hoodie.jpg?camera_label=front' },
  'BRC Iron Eagle Crewneck':   { id: '6a3934d867e671ee94075d27', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a3934d867e671ee94075d27/25459/98502/brc-iron-eagle-crewneck.jpg?camera_label=front' },
  'BRC Iron Eagle Shorts':     { id: '6a3930d8070a25b081095d9a', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930d8070a25b081095d9a/125496/112022/brc-iron-eagle-shorts.jpg?camera_label=front' },
  'BRC Iron Eagle Sweatpants': { id: '6a3934f935ee8c84970e50cd', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a3934f935ee8c84970e50cd/103934/126668/brc-iron-eagle-sweatpants.jpg?camera_label=front' },
  // ── BLACK PANTHER ────────────────────────────────────────────
  'BRC Black Panther Tee':        { id: '6a3930b0170435f0cb0557ee', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a3930b0170435f0cb0557ee/12124/92570/brc-black-panther-tee.jpg?camera_label=front' },
  'BRC Black Panther Hoodie':     { id: '6a393503070a25b081096239', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a393503070a25b081096239/32920/98424/brc-black-panther-hoodie.jpg?camera_label=front' },
  'BRC Black Panther Crewneck':   { id: '6a393511cbc1623ff404d019', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a393511cbc1623ff404d019/25459/98502/brc-black-panther-crewneck.jpg?camera_label=front' },
  'BRC Black Panther Shorts':     { id: '6a3930db67e671ee940758c8', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930db67e671ee940758c8/125496/112022/brc-black-panther-shorts.jpg?camera_label=front' },
  'BRC Black Panther Sweatpants': { id: '6a393525170435f0cb055cac', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a393525170435f0cb055cac/103934/126668/brc-black-panther-sweatpants.jpg?camera_label=front' },
  // ── IRON LION ────────────────────────────────────────────────
  'BRC Iron Lion Tee':        { id: '6a3930b735ee8c84970e4c35', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a3930b735ee8c84970e4c35/12124/92570/brc-iron-lion-tee.jpg?camera_label=front' },
  'BRC Iron Lion Hoodie':     { id: '6a39352d170435f0cb055cb7', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a39352d170435f0cb055cb7/32920/98424/brc-iron-lion-hoodie.jpg?camera_label=front' },
  'BRC Iron Lion Crewneck':   { id: '6a393539170435f0cb055cbb', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a393539170435f0cb055cbb/25459/98502/brc-iron-lion-crewneck.jpg?camera_label=front' },
  'BRC Iron Lion Shorts':     { id: '6a3930df76c7a1ac0207ce92', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930df76c7a1ac0207ce92/125496/112022/brc-iron-lion-shorts.jpg?camera_label=front' },
  'BRC Iron Lion Sweatpants': { id: '6a39355876c7a1ac0207d353', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a39355876c7a1ac0207d353/103934/126668/brc-iron-lion-sweatpants.jpg?camera_label=front' },
  // ── SILVERBACK ───────────────────────────────────────────────
  'BRC Silverback Tee':        { id: '6a3930becbc1623ff404cb60', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a3930becbc1623ff404cb60/12124/92570/brc-silverback-tee.jpg?camera_label=front' },
  'BRC Silverback Hoodie':     { id: '6a393561170435f0cb055ce9', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a393561170435f0cb055ce9/32920/98424/brc-silverback-hoodie.jpg?camera_label=front' },
  'BRC Silverback Crewneck':   { id: '6a39356b070a25b0810962c7', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a39356b070a25b0810962c7/25459/98502/brc-silverback-crewneck.jpg?camera_label=front' },
  'BRC Silverback Shorts':     { id: '6a3930e367e671ee940758d8', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930e367e671ee940758d8/125496/112022/brc-silverback-shorts.jpg?camera_label=front' },
  'BRC Silverback Sweatpants': { id: '6a393588c1b087222202388f', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a393588c1b087222202388f/103934/126668/brc-silverback-sweatpants.jpg?camera_label=front' },
  // ── GRIZZLY ──────────────────────────────────────────────────
  'BRC Grizzly Tee':        { id: '6a3930c4cbc1623ff404cb66', price: 4200, type: 'tee',        img: 'https://images-api.printify.com/mockup/6a3930c4cbc1623ff404cb66/12124/92570/brc-grizzly-tee.jpg?camera_label=front' },
  'BRC Grizzly Hoodie':     { id: '6a3935937b55aee8530021bf', price: 6500, type: 'hoodie',     img: 'https://images-api.printify.com/mockup/6a3935937b55aee8530021bf/32920/98424/brc-grizzly-hoodie.jpg?camera_label=front' },
  'BRC Grizzly Crewneck':   { id: '6a39359c67e671ee94075dde', price: 5500, type: 'crewneck',   img: 'https://images-api.printify.com/mockup/6a39359c67e671ee94075dde/25459/98502/brc-grizzly-crewneck.jpg?camera_label=front' },
  'BRC Grizzly Shorts':     { id: '6a3930e7cbc1623ff404cbad', price: 4200, type: 'shorts',     img: 'https://images-api.printify.com/mockup/6a3930e7cbc1623ff404cbad/125496/112022/brc-grizzly-shorts.jpg?camera_label=front' },
  'BRC Grizzly Sweatpants': { id: '6a3935ae070a25b081096368', price: 5800, type: 'sweatpants', img: 'https://images-api.printify.com/mockup/6a3935ae070a25b081096368/103934/126668/brc-grizzly-sweatpants.jpg?camera_label=front' },
};

// ── Security ────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 60, message: { error: 'Too many requests' } }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yoyocubano.github.io', 'http://yoyocubano.github.io',
       'https://blackrockcuban.weluxevents.store', process.env.FRONTEND_URL].filter(Boolean)
    : true
}));

// ── Stripe Webhook (raw body before json middleware) ─────────
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Webhook] Sig failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object;
    const metadata = JSON.parse(session.metadata?.order_items || '[]');
    const shipping = session.shipping_details;
    console.log(`[Webhook] Payment confirmed — ${session.id}`);
    try {
      await createPrintifyOrder(session, metadata, shipping);
    } catch (err) {
      console.error('[Webhook] Printify order failed:', err.message);
    }
  }
  res.json({ received: true });
});

app.use(express.json({ limit: '1mb' }));

// ── Printify: create fulfillment order ──────────────────────
async function createPrintifyOrder(session, items, shipping) {
  if (!PRINTIFY_TOKEN) { console.warn('[Printify] Token not set'); return; }
  const { default: fetch } = await import('node-fetch');
  const addr = shipping?.address || {};

  const line_items = items.map(item => {
    const product = CATALOG[item.name];
    if (!product) { console.warn(`[Printify] Unknown product: ${item.name}`); return null; }
    const sizeMap = SIZE_VARIANTS[product.type] || {};
    const variant_id = sizeMap[item.size] || sizeMap['M'] || Object.values(sizeMap)[0];
    return { product_id: product.id, variant_id, quantity: item.quantity || 1 };
  }).filter(Boolean);

  if (!line_items.length) return;

  const body = {
    external_id: session.id,
    label:       `BRC-${session.id.slice(-8).toUpperCase()}`,
    line_items,
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name:  (shipping?.name || 'Customer').split(' ')[0],
      last_name:   (shipping?.name || 'Customer').split(' ').slice(1).join(' ') || '-',
      email:       session.customer_details?.email || '',
      phone:       '',
      country:     addr.country || 'US',
      region:      addr.state   || '',
      address1:    addr.line1   || '',
      address2:    addr.line2   || '',
      city:        addr.city    || '',
      zip:         addr.postal_code || '',
    }
  };

  const r = await fetch(`${PRINTIFY_API}/shops/${PRINTIFY_SHOP_ID}/orders.json`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${PRINTIFY_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(data));
  console.log(`[Printify] Order created: ${data.id}`);

  // Auto-submit order to production
  await fetch(`${PRINTIFY_API}/shops/${PRINTIFY_SHOP_ID}/orders/${data.id}/send_to_production.json`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${PRINTIFY_TOKEN}`, 'Content-Type': 'application/json' }
  });
  return data;
}

// ── GET /api/catalog — expose catalog to frontend ────────────
app.get('/api/catalog', (req, res) => {
  const catalog = Object.entries(CATALOG).map(([name, p]) => ({
    name,
    price:   p.price,
    priceUSD: (p.price / 100).toFixed(2),
    type:    p.type,
    image:   p.img,
    sizes:   Object.keys(SIZE_VARIANTS[p.type] || {}),
  }));
  res.json({ catalog });
});

// ── POST /api/create-checkout-session ───────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not configured');

    const { items, success_url, cancel_url } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res.status(400).json({ error: 'items array required' });

    const lineItems = [];
    for (const item of items) {
      const product = CATALOG[item.name];
      if (!product) return res.status(400).json({ error: `Unknown product: ${item.name}` });
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `${item.name} — Size ${item.size || 'M'}`, ...(item.image ? { images: [item.image] } : {}) },
          unit_amount: product.price,
        },
        quantity: Math.max(1, Math.min(10, parseInt(item.quantity) || 1)),
      });
    }

    const origin = process.env.FRONTEND_URL || 'https://blackrockcuban.weluxevents.store';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'ES', 'FR', 'DE', 'LU', 'BE', 'NL', 'AU', 'MX'],
      },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 599, currency: 'usd' },
          display_name: 'Standard Shipping (5-10 business days)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      }],
      line_items: lineItems,
      mode: 'payment',
      success_url: success_url || `${origin}/?status=success`,
      cancel_url:  cancel_url  || `${origin}/?status=cancelled`,
      metadata: {
        source:      'BlackRockCuban',
        order_items: JSON.stringify(items.map(i => ({ name: i.name, size: i.size || 'M', quantity: i.quantity || 1 })))
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('[Checkout] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/health ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  status:   'ok',
  service:  'BlackRockCuban Gateway',
  stripe:   !!process.env.STRIPE_SECRET_KEY,
  printify: !!PRINTIFY_TOKEN,
  products: Object.keys(CATALOG).length
}));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`BlackRockCuban Gateway on port ${PORT}`);
  console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗'} | Printify: ${PRINTIFY_TOKEN ? '✓' : '✗'} | Products: ${Object.keys(CATALOG).length}`);
});
