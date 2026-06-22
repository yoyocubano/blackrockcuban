// printful-client.js — BRC Printify Store · Studio 360° Edition
const GATEWAY = 'https://blackrockcuban-gateway-production.up.railway.app';

const CATALOG = [
  { name:'BRC Signature Tee',         price:42, type:'tee',        animal:'BRC',           img:'https://images-api.printify.com/mockup/6a393096170435f0cb0557df/12124/92570/brc-signature-tee.jpg?camera_label=front',         sizes:['S','M','L','XL'] },
  { name:'BRC BRC Hoodie',             price:65, type:'hoodie',     animal:'BRC',           img:'https://images-api.printify.com/mockup/6a39342676c7a1ac0207d200/32920/98424/brc-brc-hoodie.jpg?camera_label=front',             sizes:['S','M','L','XL','2XL'] },
  { name:'BRC BRC Crewneck',           price:55, type:'crewneck',   animal:'BRC',           img:'https://images-api.printify.com/mockup/6a39343654ae9d32500c5303/25459/98502/brc-brc-crewneck.jpg?camera_label=front',           sizes:['S','M','L','XL'] },
  { name:'BRC BRC Shorts',             price:42, type:'shorts',     animal:'BRC',           img:'https://images-api.printify.com/mockup/6a3934467b55aee853002053/125496/112022/brc-brc-shorts.jpg?camera_label=front',             sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC BRC Sweatpants',         price:58, type:'sweatpants', animal:'BRC',           img:'https://images-api.printify.com/mockup/6a39345467e671ee94075c9b/103934/126668/brc-brc-sweatpants.jpg?camera_label=front',         sizes:['S','M','L','XL'] },
  { name:'BRC Iron Wolf Tee',          price:42, type:'tee',        animal:'Iron Wolf',     img:'https://images-api.printify.com/mockup/6a39309b170435f0cb0557e2/12124/92570/brc-iron-wolf-tee.jpg?camera_label=front',          sizes:['S','M','L','XL'] },
  { name:'BRC Iron Wolf Hoodie',       price:65, type:'hoodie',     animal:'Iron Wolf',     img:'https://images-api.printify.com/mockup/6a393468170435f0cb055bca/32920/98424/brc-iron-wolf-hoodie.jpg?camera_label=front',       sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Iron Wolf Crewneck',     price:55, type:'crewneck',   animal:'Iron Wolf',     img:'https://images-api.printify.com/mockup/6a393475cbc1623ff404cf62/25459/98502/brc-iron-wolf-crewneck.jpg?camera_label=front',     sizes:['S','M','L','XL'] },
  { name:'BRC Iron Wolf Shorts',       price:42, type:'shorts',     animal:'Iron Wolf',     img:'https://images-api.printify.com/mockup/6a3930cec1b0872222023326/125496/112022/brc-iron-wolf-shorts.jpg?camera_label=front',       sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Iron Wolf Sweatpants',   price:58, type:'sweatpants', animal:'Iron Wolf',     img:'https://images-api.printify.com/mockup/6a39348f54ae9d32500c5396/103934/126668/brc-iron-wolf-sweatpants.jpg?camera_label=front',   sizes:['S','M','L','XL'] },
  { name:'BRC Iron Bull Tee',          price:42, type:'tee',        animal:'Iron Bull',     img:'https://images-api.printify.com/mockup/6a3930a2cbc1623ff404cb47/12124/92570/brc-iron-bull-tee.jpg?camera_label=front',          sizes:['S','M','L','XL'] },
  { name:'BRC Iron Bull Hoodie',       price:65, type:'hoodie',     animal:'Iron Bull',     img:'https://images-api.printify.com/mockup/6a393499170435f0cb055c33/32920/98424/brc-iron-bull-hoodie.jpg?camera_label=front',       sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Iron Bull Crewneck',     price:55, type:'crewneck',   animal:'Iron Bull',     img:'https://images-api.printify.com/mockup/6a3934a67b55aee8530020e6/25459/98502/brc-iron-bull-crewneck.jpg?camera_label=front',     sizes:['S','M','L','XL'] },
  { name:'BRC Iron Bull Shorts',       price:42, type:'shorts',     animal:'Iron Bull',     img:'https://images-api.printify.com/mockup/6a3930d27b55aee853001c34/125496/112022/brc-iron-bull-shorts.jpg?camera_label=front',       sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Iron Bull Sweatpants',   price:58, type:'sweatpants', animal:'Iron Bull',     img:'https://images-api.printify.com/mockup/6a3934c276c7a1ac0207d2c8/103934/126668/brc-iron-bull-sweatpants.jpg?camera_label=front',   sizes:['S','M','L','XL'] },
  { name:'BRC Iron Eagle Tee',         price:42, type:'tee',        animal:'Iron Eagle',    img:'https://images-api.printify.com/mockup/6a3930aacbc1623ff404cb49/12124/92570/brc-iron-eagle-tee.jpg?camera_label=front',         sizes:['S','M','L','XL'] },
  { name:'BRC Iron Eagle Hoodie',      price:65, type:'hoodie',     animal:'Iron Eagle',    img:'https://images-api.printify.com/mockup/6a3934ca35ee8c84970e50ab/32920/98424/brc-iron-eagle-hoodie.jpg?camera_label=front',      sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Iron Eagle Crewneck',    price:55, type:'crewneck',   animal:'Iron Eagle',    img:'https://images-api.printify.com/mockup/6a3934d867e671ee94075d27/25459/98502/brc-iron-eagle-crewneck.jpg?camera_label=front',    sizes:['S','M','L','XL'] },
  { name:'BRC Iron Eagle Shorts',      price:42, type:'shorts',     animal:'Iron Eagle',    img:'https://images-api.printify.com/mockup/6a3930d8070a25b081095d9a/125496/112022/brc-iron-eagle-shorts.jpg?camera_label=front',      sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Iron Eagle Sweatpants',  price:58, type:'sweatpants', animal:'Iron Eagle',    img:'https://images-api.printify.com/mockup/6a3934f935ee8c84970e50cd/103934/126668/brc-iron-eagle-sweatpants.jpg?camera_label=front',  sizes:['S','M','L','XL'] },
  { name:'BRC Black Panther Tee',        price:42, type:'tee',        animal:'Black Panther', img:'https://images-api.printify.com/mockup/6a3930b0170435f0cb0557ee/12124/92570/brc-black-panther-tee.jpg?camera_label=front',        sizes:['S','M','L','XL'] },
  { name:'BRC Black Panther Hoodie',     price:65, type:'hoodie',     animal:'Black Panther', img:'https://images-api.printify.com/mockup/6a393503070a25b081096239/32920/98424/brc-black-panther-hoodie.jpg?camera_label=front',     sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Black Panther Crewneck',   price:55, type:'crewneck',   animal:'Black Panther', img:'https://images-api.printify.com/mockup/6a393511cbc1623ff404d019/25459/98502/brc-black-panther-crewneck.jpg?camera_label=front',   sizes:['S','M','L','XL'] },
  { name:'BRC Black Panther Shorts',     price:42, type:'shorts',     animal:'Black Panther', img:'https://images-api.printify.com/mockup/6a3930db67e671ee940758c8/125496/112022/brc-black-panther-shorts.jpg?camera_label=front',     sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Black Panther Sweatpants', price:58, type:'sweatpants', animal:'Black Panther', img:'https://images-api.printify.com/mockup/6a393525170435f0cb055cac/103934/126668/brc-black-panther-sweatpants.jpg?camera_label=front', sizes:['S','M','L','XL'] },
  { name:'BRC Iron Lion Tee',          price:42, type:'tee',        animal:'Iron Lion',     img:'https://images-api.printify.com/mockup/6a3930b735ee8c84970e4c35/12124/92570/brc-iron-lion-tee.jpg?camera_label=front',          sizes:['S','M','L','XL'] },
  { name:'BRC Iron Lion Hoodie',       price:65, type:'hoodie',     animal:'Iron Lion',     img:'https://images-api.printify.com/mockup/6a39352d170435f0cb055cb7/32920/98424/brc-iron-lion-hoodie.jpg?camera_label=front',       sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Iron Lion Crewneck',     price:55, type:'crewneck',   animal:'Iron Lion',     img:'https://images-api.printify.com/mockup/6a393539170435f0cb055cbb/25459/98502/brc-iron-lion-crewneck.jpg?camera_label=front',     sizes:['S','M','L','XL'] },
  { name:'BRC Iron Lion Shorts',       price:42, type:'shorts',     animal:'Iron Lion',     img:'https://images-api.printify.com/mockup/6a3930df76c7a1ac0207ce92/125496/112022/brc-iron-lion-shorts.jpg?camera_label=front',       sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Iron Lion Sweatpants',   price:58, type:'sweatpants', animal:'Iron Lion',     img:'https://images-api.printify.com/mockup/6a39355876c7a1ac0207d353/103934/126668/brc-iron-lion-sweatpants.jpg?camera_label=front',   sizes:['S','M','L','XL'] },
  { name:'BRC Silverback Tee',         price:42, type:'tee',        animal:'Silverback',    img:'https://images-api.printify.com/mockup/6a3930becbc1623ff404cb60/12124/92570/brc-silverback-tee.jpg?camera_label=front',         sizes:['S','M','L','XL'] },
  { name:'BRC Silverback Hoodie',      price:65, type:'hoodie',     animal:'Silverback',    img:'https://images-api.printify.com/mockup/6a393561170435f0cb055ce9/32920/98424/brc-silverback-hoodie.jpg?camera_label=front',      sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Silverback Crewneck',    price:55, type:'crewneck',   animal:'Silverback',    img:'https://images-api.printify.com/mockup/6a39356b070a25b0810962c7/25459/98502/brc-silverback-crewneck.jpg?camera_label=front',    sizes:['S','M','L','XL'] },
  { name:'BRC Silverback Shorts',      price:42, type:'shorts',     animal:'Silverback',    img:'https://images-api.printify.com/mockup/6a3930e367e671ee940758d8/125496/112022/brc-silverback-shorts.jpg?camera_label=front',      sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Silverback Sweatpants',  price:58, type:'sweatpants', animal:'Silverback',    img:'https://images-api.printify.com/mockup/6a393588c1b087222202388f/103934/126668/brc-silverback-sweatpants.jpg?camera_label=front',  sizes:['S','M','L','XL'] },
  { name:'BRC Grizzly Tee',            price:42, type:'tee',        animal:'Grizzly',       img:'https://images-api.printify.com/mockup/6a3930c4cbc1623ff404cb66/12124/92570/brc-grizzly-tee.jpg?camera_label=front',            sizes:['S','M','L','XL'] },
  { name:'BRC Grizzly Hoodie',         price:65, type:'hoodie',     animal:'Grizzly',       img:'https://images-api.printify.com/mockup/6a3935937b55aee8530021bf/32920/98424/brc-grizzly-hoodie.jpg?camera_label=front',         sizes:['S','M','L','XL','2XL'] },
  { name:'BRC Grizzly Crewneck',       price:55, type:'crewneck',   animal:'Grizzly',       img:'https://images-api.printify.com/mockup/6a39359c67e671ee94075dde/25459/98502/brc-grizzly-crewneck.jpg?camera_label=front',       sizes:['S','M','L','XL'] },
  { name:'BRC Grizzly Shorts',         price:42, type:'shorts',     animal:'Grizzly',       img:'https://images-api.printify.com/mockup/6a3930e7cbc1623ff404cbad/125496/112022/brc-grizzly-shorts.jpg?camera_label=front',         sizes:['XS','S','M','L','XL','2XL'] },
  { name:'BRC Grizzly Sweatpants',     price:58, type:'sweatpants', animal:'Grizzly',       img:'https://images-api.printify.com/mockup/6a3935ae070a25b081096368/103934/126668/brc-grizzly-sweatpants.jpg?camera_label=front',     sizes:['S','M','L','XL'] },
];

const TYPE_LABELS = { tee:'Tee', hoodie:'Hoodie', crewneck:'Crewneck', shorts:'Shorts', sweatpants:'Sweatpants' };
const ANIMALS     = ['BRC','Iron Wolf','Iron Bull','Iron Eagle','Black Panther','Iron Lion','Silverback','Grizzly'];
const TYPES       = ['tee','hoodie','crewneck','shorts','sweatpants'];

// ── INJECT CSS ──────────────────────────────────────────────
const css = `
  .brc-card {
    background: #080808;
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    overflow: hidden;
    transition: border-color .3s, box-shadow .3s;
    position: relative;
  }
  .brc-card:hover {
    border-color: rgba(239,68,68,0.35);
    box-shadow: 0 0 40px rgba(239,68,68,0.12), 0 20px 60px rgba(0,0,0,0.8);
  }
  .brc-img-stage {
    position: relative;
    aspect-ratio: 1;
    background: radial-gradient(ellipse at 50% 35%, #1a1a1a 0%, #050505 75%);
    overflow: hidden;
    transform-style: preserve-3d;
  }
  .brc-img-stage::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 60%),
      radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.06) 0%, transparent 60%);
    z-index: 2;
    pointer-events: none;
  }
  .brc-img-stage::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.15) 0px,
      rgba(0,0,0,0.15) 1px,
      transparent 1px,
      transparent 3px
    );
    z-index: 3;
    pointer-events: none;
    opacity: .4;
  }
  .brc-product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    display: block;
    transform-origin: center;
    transition: transform .1s ease-out;
    will-change: transform;
    position: relative;
    z-index: 1;
  }
  .brc-glare {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 55%);
    opacity: 0;
    transition: opacity .3s;
  }
  .brc-card:hover .brc-glare { opacity: 1; }
  .brc-reflection {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.5) 60%, transparent 100%);
    z-index: 5;
    pointer-events: none;
  }
  .brc-card-info {
    padding: 14px 16px;
    background: #080808;
    position: relative;
    z-index: 6;
  }
  .brc-animal-tag {
    color: #ef4444;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .15em;
    margin-bottom: 3px;
  }
  .brc-product-title {
    color: #fff;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .04em;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .brc-price {
    color: #ef4444;
    font-size: 18px;
    font-weight: 900;
  }
  .brc-badge {
    float: right;
    color: #3f3f46;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .1em;
    margin-top: 4px;
  }

  /* ── MODAL ── */
  #brc-modal {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9100;
    background: rgba(0,0,0,0.96);
    backdrop-filter: blur(12px);
    overflow-y: auto;
  }
  .brc-modal-inner {
    max-width: 500px;
    margin: 32px auto;
    padding: 0 16px 80px;
  }
  .brc-modal-stage {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    perspective: 1200px;
    background: radial-gradient(ellipse at 50% 30%, #1c1c1c 0%, #050505 70%);
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    cursor: grab;
    user-select: none;
  }
  .brc-modal-stage:active { cursor: grabbing; }
  .brc-modal-stage::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 80%, rgba(239,68,68,0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 50%);
    z-index: 2;
    pointer-events: none;
  }
  .brc-modal-stage::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.2) 0px,
      rgba(0,0,0,0.2) 1px,
      transparent 1px,
      transparent 4px
    );
    z-index: 3;
    pointer-events: none;
    opacity: .5;
  }
  .brc-modal-img-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    z-index: 1;
    transition: transform .05s linear;
    will-change: transform;
  }
  .brc-modal-img {
    width: 88%;
    height: 88%;
    object-fit: contain;
    mix-blend-mode: multiply;
    display: block;
    position: relative;
    z-index: 1;
  }
  .brc-modal-shadow {
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
    width: 55%;
    height: 6%;
    background: radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%);
    filter: blur(8px);
    z-index: 0;
    transition: transform .05s linear;
    pointer-events: none;
  }
  .brc-modal-ground {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 30%;
    background: linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 100%);
    z-index: 4;
    pointer-events: none;
  }
  .brc-rotate-hint {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.2);
    font-size: 8px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .15em;
    z-index: 10;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .brc-rotate-hint svg { width: 14px; height: 14px; }

  .brc-modal-body {
    padding: 20px 0 0;
  }
  .brc-size-btn {
    padding: 9px 18px;
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .1em;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: #71717a;
    cursor: pointer;
    transition: all .2s;
  }
  .brc-size-btn.active {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;
  }
  .brc-add-btn {
    width: 100%;
    padding: 16px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .18em;
    border: none;
    background: #ef4444;
    color: #fff;
    cursor: pointer;
    transition: background .2s;
    margin-top: 20px;
  }
  .brc-add-btn:hover { background: #dc2626; }
  .brc-add-btn.success { background: #16a34a; }

  /* CART BAR */
  #brc-cart-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 8000;
    background: rgba(5,5,5,0.97);
    border-top: 1px solid rgba(239,68,68,0.2);
    padding: 12px 24px;
    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    backdrop-filter: blur(12px);
  }
  #brc-cart-bar.visible { display: flex; }
  #brc-checkout-btn {
    background: #ef4444;
    border: none;
    color: #fff;
    padding: 10px 28px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .15em;
    cursor: pointer;
    transition: background .2s;
  }
  #brc-checkout-btn:hover { background: #dc2626; }

  /* FILTER BUTTONS */
  .brc-filter-btn {
    padding: 6px 14px;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: .12em;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    color: #71717a;
    cursor: pointer;
    transition: all .2s;
  }
  .brc-filter-btn.active {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;
  }
`;
const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

function brcInit() {

  // ── INJECT MODAL + CART BAR ──────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <div id="brc-modal">
      <div class="brc-modal-inner">
        <button id="brc-modal-close" style="position:sticky;top:16px;float:right;background:none;border:1px solid rgba(255,255,255,0.1);color:#71717a;width:36px;height:36px;cursor:pointer;font-size:18px;margin-bottom:8px;z-index:10;">✕</button>
        <div style="clear:both;"></div>

        <!-- 360° STAGE -->
        <div class="brc-modal-stage" id="brc-360-stage">
          <div class="brc-modal-img-wrap" id="brc-img-wrap">
            <img id="brc-modal-img" class="brc-modal-img" src="" alt="" draggable="false">
          </div>
          <div class="brc-modal-shadow" id="brc-shadow"></div>
          <div class="brc-modal-ground"></div>
          <div class="brc-rotate-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            DRAG TO ROTATE
          </div>
        </div>

        <div class="brc-modal-body" id="brc-modal-body"></div>
      </div>
    </div>

    <div id="brc-cart-bar">
      <span id="brc-cart-summary" style="color:#a1a1aa;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;"></span>
      <button id="brc-checkout-btn">CHECKOUT →</button>
    </div>
  `);

  document.getElementById('brc-modal-close').addEventListener('click', closeModal);
  document.getElementById('brc-modal').addEventListener('click', e => { if(e.target.id==='brc-modal') closeModal(); });
  document.getElementById('brc-checkout-btn').addEventListener('click', launchStripeCheckout);

  // ── 360° ROTATION ENGINE ─────────────────────────────────
  const stage   = document.getElementById('brc-360-stage');
  const imgWrap = document.getElementById('brc-img-wrap');
  const shadow  = document.getElementById('brc-shadow');

  let rotY = 0, rotX = 0;
  let isDragging = false, lastX = 0, lastY = 0;
  let velocity = 0.4; // auto-spin speed deg/frame
  let autoFrame = null;

  function applyRotation() {
    imgWrap.style.transform = `rotateY(${rotY}deg) rotateX(${rotX * 0.4}deg)`;
    // shadow moves with rotation depth
    const scale = 0.6 + Math.abs(Math.sin(rotY * Math.PI / 180)) * 0.4;
    shadow.style.transform = `translateX(-50%) scaleX(${scale})`;
  }

  function autoSpin() {
    if (!isDragging) {
      rotY += velocity;
      // subtle vertical oscillation
      rotX = Math.sin(rotY * 0.02) * 4;
      applyRotation();
    }
    autoFrame = requestAnimationFrame(autoSpin);
  }

  stage.addEventListener('mousedown', e => {
    isDragging = true; lastX = e.clientX; lastY = e.clientY;
    stage.style.cursor = 'grabbing';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    rotY += dx * 0.5;
    rotX += dy * 0.3;
    rotX = Math.max(-25, Math.min(25, rotX));
    velocity = dx * 0.5;
    lastX = e.clientX; lastY = e.clientY;
    applyRotation();
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    stage.style.cursor = 'grab';
    // dampen velocity
    velocity = Math.max(-1.5, Math.min(1.5, velocity * 0.3)) || 0.4;
    if (Math.abs(velocity) < 0.05) velocity = 0.4;
  });

  // Touch support
  stage.addEventListener('touchstart', e => {
    isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - lastX;
    rotY += dx * 0.5;
    velocity = dx * 0.4;
    lastX = e.touches[0].clientX;
    applyRotation();
  });
  document.addEventListener('touchend', () => {
    isDragging = false;
    velocity = Math.max(-2, Math.min(2, velocity * 0.3)) || 0.4;
  });

  // ── RENDER GRID ──────────────────────────────────────────
  const shopGrid  = document.getElementById('brc-shop-grid');
  const animalBar = document.getElementById('brc-animal-filter');
  const typeBar   = document.getElementById('brc-type-filter');
  if (!shopGrid) return;

  let activeAnimal = 'all', activeType = 'all';

  function renderGrid() {
    const items = CATALOG.filter(p =>
      (activeAnimal === 'all' || p.animal === activeAnimal) &&
      (activeType   === 'all' || p.type   === activeType)
    );
    shopGrid.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'brc-card';
      card.innerHTML = `
        <div class="brc-img-stage" id="stage-${p.name.replace(/\s+/g,'_')}">
          <img class="brc-product-img" src="${p.img}" alt="${p.name}" loading="lazy">
          <div class="brc-glare"></div>
          <div class="brc-reflection"></div>
        </div>
        <div class="brc-card-info">
          <div class="brc-animal-tag">${p.animal} · ${TYPE_LABELS[p.type]}</div>
          <div class="brc-product-title">${p.name.replace('BRC ','')}</div>
          <span class="brc-price">$${p.price}</span>
          <span class="brc-badge">Black · DTG</span>
        </div>
      `;
      // 3D tilt on mousemove
      const imgStage = card.querySelector('.brc-img-stage');
      const img      = card.querySelector('.brc-product-img');
      const glare    = card.querySelector('.brc-glare');
      imgStage.addEventListener('mousemove', e => {
        const r = imgStage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        img.style.transform = `perspective(500px) rotateY(${x*18}deg) rotateX(${-y*12}deg) scale(1.06)`;
        glare.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.12) 0%, transparent 55%)`;
      });
      imgStage.addEventListener('mouseleave', () => {
        img.style.transform = '';
        glare.style.background = 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 55%)';
      });
      card.addEventListener('click', () => openProduct(p.name));
      shopGrid.appendChild(card);
    });
    if (!items.length) {
      shopGrid.innerHTML = '<p style="color:#3f3f46;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;grid-column:1/-1;text-align:center;padding:40px 0;">No products match filter</p>';
    }
  }

  // Filters
  if (animalBar) {
    ['all',...ANIMALS].forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'brc-filter-btn' + (a==='all'?' active':'');
      btn.dataset.animal = a;
      btn.textContent = a==='all'?'ALL':a;
      btn.addEventListener('click', () => {
        activeAnimal = a;
        animalBar.querySelectorAll('.brc-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.animal===a));
        renderGrid();
      });
      animalBar.appendChild(btn);
    });
  }
  if (typeBar) {
    ['all',...TYPES].forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'brc-filter-btn' + (t==='all'?' active':'');
      btn.dataset.type = t;
      btn.textContent = t==='all'?'ALL':(TYPE_LABELS[t]||t);
      btn.addEventListener('click', () => {
        activeType = t;
        typeBar.querySelectorAll('.brc-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.type===t));
        renderGrid();
      });
      typeBar.appendChild(btn);
    });
  }
  renderGrid();

  // ── CART ─────────────────────────────────────────────────
  let cart = JSON.parse(localStorage.getItem('brc_cart_v2')||'[]');
  function saveCart() {
    localStorage.setItem('brc_cart_v2', JSON.stringify(cart));
    const bar     = document.getElementById('brc-cart-bar');
    const summary = document.getElementById('brc-cart-summary');
    if (!cart.length) { bar.classList.remove('visible'); return; }
    const total = cart.reduce((s,i)=>s+i.price*i.quantity,0);
    const count = cart.reduce((s,i)=>s+i.quantity,0);
    summary.textContent = `${count} item${count>1?'s':''} · $${total}`;
    bar.classList.add('visible');
  }
  saveCart();

  // ── PRODUCT MODAL ─────────────────────────────────────────
  let currentProduct = null;
  let selectedSize   = '';

  window.openProduct = function(name) {
    const p = CATALOG.find(x=>x.name===name);
    if (!p) return;
    currentProduct = p;
    selectedSize   = p.sizes[0];

    // Load image into 360 stage
    const modalImg = document.getElementById('brc-modal-img');
    modalImg.src = p.img;
    modalImg.alt = p.name;

    // Reset rotation
    rotY = 0; rotX = 0; velocity = 0.3;
    if (autoFrame) cancelAnimationFrame(autoFrame);
    autoFrame = requestAnimationFrame(autoSpin);

    // Body info
    document.getElementById('brc-modal-body').innerHTML = `
      <p style="color:#ef4444;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.15em;margin-bottom:6px;">${p.animal} · ${TYPE_LABELS[p.type]}</p>
      <h2 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;margin-bottom:6px;">${p.name.replace('BRC ','')}</h2>
      <p style="color:#ef4444;font-size:24px;font-weight:900;margin-bottom:4px;">$${p.price}</p>
      <p style="color:#3f3f46;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:24px;">+ $5.99 shipping · Black · DTG Print · Printify · Ships 3-5 days</p>

      <p style="color:#71717a;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px;">SIZE</p>
      <div id="brc-size-row" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
        ${p.sizes.map((s,i)=>`<button class="brc-size-btn${i===0?' active':''}" data-sz="${s}">${s}</button>`).join('')}
      </div>
      <button class="brc-add-btn" id="brc-add-btn">ADD TO CART — $${p.price}</button>
      <p style="text-align:center;color:#27272a;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-top:10px;">Secure checkout via Stripe · No account needed</p>
    `;

    // Size picker
    document.getElementById('brc-size-row').addEventListener('click', e => {
      const btn = e.target.closest('.brc-size-btn');
      if (!btn) return;
      selectedSize = btn.dataset.sz;
      document.querySelectorAll('.brc-size-btn').forEach(b => b.classList.toggle('active', b===btn));
    });

    // Add to cart
    document.getElementById('brc-add-btn').addEventListener('click', () => {
      const existing = cart.find(i=>i.name===p.name && i.size===selectedSize);
      if (existing) existing.quantity++;
      else cart.push({ name:p.name, size:selectedSize, price:p.price, quantity:1, image:p.img });
      saveCart();
      const btn = document.getElementById('brc-add-btn');
      btn.textContent = '✓ ADDED';
      btn.classList.add('success');
      setTimeout(() => closeModal(), 800);
    });

    document.getElementById('brc-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    document.getElementById('brc-modal').style.display = 'none';
    document.body.style.overflow = '';
    if (autoFrame) { cancelAnimationFrame(autoFrame); autoFrame = null; }
    velocity = 0.4; rotY = 0; rotX = 0;
  }

  // ── STRIPE CHECKOUT ───────────────────────────────────────
  async function launchStripeCheckout() {
    const btn = document.getElementById('brc-checkout-btn');
    btn.textContent = 'CONNECTING...'; btn.disabled = true;
    try {
      const r = await fetch(`${GATEWAY}/api/create-checkout-session`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          items: cart,
          success_url: location.origin + location.pathname + '?status=success',
          cancel_url:  location.origin + location.pathname + '?status=cancelled'
        })
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      window.location.href = d.url;
    } catch(err) {
      btn.textContent = 'ERROR — RETRY'; btn.disabled = false;
    }
  }
  window.launchStripeCheckout = launchStripeCheckout;

  // ── LEGACY COMPAT ─────────────────────────────────────────
  window.launchPrintfulDesign = name => openProduct('BRC ' + name) || openProduct(name);

  // ── REDIRECT HANDLERS ──────────────────────────────────────
  const p = new URLSearchParams(location.search);
  if (p.get('status') === 'success') {
    localStorage.removeItem('brc_cart_v2');
    cart = []; saveCart();
    alert('ORDER CONFIRMED!\n\nYour gear is being printed. Check your email for tracking.');
    history.replaceState({}, '', location.pathname);
  } else if (p.get('status') === 'cancelled') {
    alert('CHECKOUT CANCELLED.\n\nYour cart is still saved.');
    history.replaceState({}, '', location.pathname);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', brcInit);
} else {
  brcInit();
}
