/* ===================================================
   VELOKID — Système Panier
   =================================================== */

const CART_KEY = 'velokid_cart';

/* ---- Lecture / écriture ---- */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}
function clearCart() { saveCart([]); }

/* ---- Opérations ---- */
function addItem(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  showCartDrawer();
}

function removeItem(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateQty(id, qty) {
  if (qty < 1) { removeItem(id); return; }
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty = qty; saveCart(cart); }
}

function getTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function getCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

/* ---- Badge navbar ---- */
function updateCartBadge() {
  const count = getCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ---- Tiroir panier ---- */
function renderCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const cart = getCart();
  const body = drawer.querySelector('.cart-drawer-body');
  const footer = drawer.querySelector('.cart-drawer-footer');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p class="cart-empty-title" data-i18n="cart_empty">${t('cart_empty')}</p>
        <p style="font-size:.85rem;color:var(--gray)" data-i18n="cart_empty_desc">${t('cart_empty_desc')}</p>
        <a href="boutique.html" class="btn btn-primary btn-sm" style="margin-top:16px" onclick="closeCartDrawer()" data-i18n="nav_shop">${t('nav_shop')}</a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-age">${item.age || ''}</div>
        <div class="cart-item-price">${item.price} €</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-ctrl">
          <button onclick="updateQty('${item.id}', ${item.qty - 1})">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeItem('${item.id}')" title="${t('cart_remove')}">🗑</button>
      </div>
    </div>
  `).join('');

  if (footer) {
    const total = getTotal();
    const shipping = total >= 99 ? `<span style="color:var(--success)">${t('cart_free')}</span>` : '9,90 €';
    footer.style.display = 'block';
    footer.innerHTML = `
      <div class="cart-totals">
        <div class="cart-total-row"><span data-i18n="cart_shipping">${t('cart_shipping')}</span><span>${shipping}</span></div>
        <div class="cart-total-row total"><span data-i18n="cart_total">${t('cart_total')}</span><span>${(total >= 99 ? total : total + 9.9).toFixed(2)} €</span></div>
      </div>
      <a href="panier.html" class="btn btn-outline" style="width:100%;justify-content:center;margin-bottom:10px" onclick="closeCartDrawer()" data-i18n="cart_view">${t('cart_view')}</a>
      <a href="commande.html" class="btn btn-primary" style="width:100%;justify-content:center" onclick="closeCartDrawer()" data-i18n="cart_order">${t('cart_order')}</a>`;
  }
}

function showCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  if (overlay) overlay.classList.add('active');
  if (drawer)  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCartDrawer() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  if (overlay) overlay.classList.remove('active');
  if (drawer)  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- Surcharge globale addToCart ---- */
function addToCart(name, price, img, id, age, category) {
  addItem({ id: id || name.toLowerCase().replace(/\s+/g,'-'), name, price, img: img || 'images/bike1.jpg', age: age || '', category: category || '' });
  // Toast rapide
  const toast = document.getElementById('cartToast');
  const msg   = document.getElementById('cartToastMsg');
  if (toast && msg) {
    msg.textContent = `"${name}" ${t('cart_added')}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartDrawer();
  // Overlay click
  const overlay = document.getElementById('cartOverlay');
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
  // Bouton d'ouverture
  document.querySelectorAll('.cart-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      renderCartDrawer();
      showCartDrawer();
    });
  });
});
