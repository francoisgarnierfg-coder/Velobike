/* =====================================================
   VELOKID — Back-office Admin Logic
   ===================================================== */

/* ─── Constantes ─────────────────────────────────── */
const ADMIN_CREDENTIALS = { email: 'admin@velokid.fr', password: 'velokid2025' };

const STATUS_LABELS = {
  pending:    'En attente',
  confirmed:  'Confirmée',
  processing: 'En préparation',
  shipped:    'Expédiée',
  delivered:  'Livrée',
  cancelled:  'Annulée'
};

const STATUS_BADGE = {
  pending:    'badge-pending',
  confirmed:  'badge-confirmed',
  processing: 'badge-processing',
  shipped:    'badge-shipped',
  delivered:  'badge-delivered',
  cancelled:  'badge-cancelled'
};

const PAY_LABELS = { paid: 'Payé', pending: 'En attente', refunded: 'Remboursé' };
const PAY_BADGE  = { paid: 'badge-paid', pending: 'badge-pending', refunded: 'badge-cancelled' };

const PRODUCTS_CATALOG = [
  { id: 'mini-bolide',   name: 'Mini Bolide',      price: 89,  img: 'images/bike1.jpg', category: 'draisienne' },
  { id: 'primo-12',      name: 'Primo 12"',         price: 149, img: 'images/bike2.jpg', category: '12' },
  { id: 'spark-14',      name: 'Spark 14"',         price: 169, img: 'images/bike3.jpg', category: '14' },
  { id: 'junior-16',     name: 'Junior 16"',        price: 189, img: 'images/bike3.jpg', category: '16' },
  { id: 'trail-18',      name: 'Trail 18"',         price: 209, img: 'images/bike4.jpg', category: '18' },
  { id: 'explorer-20',   name: 'Explorer 20"',      price: 229, img: 'images/bike5.jpg', category: '20' },
  { id: 'avanti-24',     name: 'Avanti 24"',        price: 289, img: 'images/bike5.jpg', category: '24' },
  { id: 'street-kid-bmx',name: 'Street Kid BMX',   price: 199, img: 'images/bike6.jpg', category: 'bmx' },
  { id: 'dirt-pro-bmx',  name: 'Dirt Pro BMX',     price: 249, img: 'images/bike6.jpg', category: 'bmx' },
  { id: 'e-spark',       name: 'E-Spark 20"',      price: 349, img: 'images/bike4.jpg', category: 'electric' },
  { id: 'rainbow-girl',  name: 'Rainbow Girl',     price: 179, img: 'images/bike3.jpg', category: '16' },
  { id: 'zoom-drais',    name: 'Zoom Draisienne',  price: 79,  img: 'images/bike1.jpg', category: 'draisienne' },
];

const FAKE_CUSTOMERS = [
  { name: 'Sophie Martin',  email: 'sophie.martin@gmail.com',   phone: '06 12 34 56 78', address: '12 rue des Lilas', city: 'Lyon', postalCode: '69001' },
  { name: 'Pierre Durand',  email: 'p.durand@free.fr',          phone: '07 23 45 67 89', address: '4 av. Victor Hugo', city: 'Bordeaux', postalCode: '33000' },
  { name: 'Marie Lefort',   email: 'marie.lefort@outlook.com',  phone: '06 34 56 78 90', address: '8 rue Molière', city: 'Paris', postalCode: '75011' },
  { name: 'Jean Moreau',    email: 'jmoreau@orange.fr',         phone: '07 45 67 89 01', address: '3 chemin des Roses', city: 'Nantes', postalCode: '44000' },
  { name: 'Claire Petit',   email: 'claire.petit@gmail.com',    phone: '06 56 78 90 12', address: '27 bd Gambetta', city: 'Toulouse', postalCode: '31000' },
  { name: 'Thomas Girard',  email: 'thomas.girard@sfr.fr',      phone: '07 67 89 01 23', address: '15 rue du Commerce', city: 'Strasbourg', postalCode: '67000' },
  { name: 'Julie Bernard',  email: 'j.bernard@gmail.com',       phone: '06 78 90 12 34', address: '6 allée des Pins', city: 'Montpellier', postalCode: '34000' },
  { name: 'Marc Dupont',    email: 'marc.dupont@laposte.net',   phone: '07 89 01 23 45', address: '19 impasse des Saules', city: 'Marseille', postalCode: '13001' },
];

const SUPPLIERS = ['CycloPro Distribution', 'VéloImport SAS', 'KidsBike Europe', 'SportCycle France'];

/* ─── Utilitaires ──────────────────────────────────── */
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function fmtDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDateTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtPrice(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function orderId(n) { return 'VK-' + String(n).padStart(6, '0'); }
function supId(n)   { return 'SUP-' + String(n).padStart(4, '0'); }
function payId(n)   { return 'PAY-' + String(n).padStart(5, '0'); }
function trackNum() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return 'FR' + Math.floor(Math.random() * 9e9).toString() + chars[Math.floor(Math.random()*26)];
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ─── Génération des données de démonstration ─────── */
function generateMockOrders() {
  const statuses = [
    'delivered','delivered','delivered','delivered','delivered','delivered',
    'shipped','shipped','shipped',
    'processing','processing',
    'confirmed','confirmed',
    'pending',
    'cancelled'
  ];

  return statuses.map((status, i) => {
    const customer = FAKE_CUSTOMERS[i % FAKE_CUSTOMERS.length];
    const numItems = rand(1, 3);
    const items = [];
    for (let j = 0; j < numItems; j++) {
      const p = PRODUCTS_CATALOG[rand(0, PRODUCTS_CATALOG.length - 1)];
      items.push({ ...p, qty: rand(1, 2) });
    }
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping  = subtotal >= 99 ? 0 : 9.90;
    const total     = subtotal + shipping;
    const id        = orderId(1000 + i);
    const date      = daysAgo(rand(0, 29));
    const payStatus = status === 'cancelled' ? 'refunded' : 'paid';
    const order = {
      id,
      date,
      customer: { ...customer },
      items,
      subtotal,
      shipping,
      total,
      status,
      paymentStatus: payStatus,
      trackingNumber: (status === 'shipped' || status === 'delivered') ? trackNum() : null,
      supplierOrderId: status !== 'pending' ? supId(2000 + i) : null,
    };
    order.invoice = { html: generateInvoiceHTML(order) };
    return order;
  });
}

function generateMockContacts() {
  const subjects = [
    'Question sur la taille du vélo',
    'Délai de livraison',
    'Commande non reçue',
    'Demande de retour',
    'Problème de montage',
    'Compatibilité roue stabilisatrice',
    'Demande de devis collectivité',
    'Avis produit Explorer 20"',
  ];
  const messages = [
    'Bonjour, mon fils a 3 ans et mesure 95 cm. Quelle taille de vélo me conseillez-vous ? Merci.',
    'Bonjour, j\'ai passé une commande il y a 5 jours et je n\'ai toujours pas de numéro de suivi. Pouvez-vous m\'aider ?',
    'Ma commande VK-001005 n\'est toujours pas arrivée après 10 jours. Que se passe-t-il ?',
    'Je souhaite retourner le vélo que j\'ai reçu, il ne correspond pas à mes attentes. Comment procéder ?',
    'Je n\'arrive pas à monter le guidon correctement. La notice n\'est pas très claire. Avez-vous une vidéo ?',
    'Les roues stabilisatrices du Primo 12" sont-elles compatibles avec le Spark 14" ?',
    'Nous sommes une école primaire et souhaitons équiper notre parc vélo (15 vélos). Avez-vous des tarifs dégressifs ?',
    'Je viens de recevoir mon Explorer 20", super produit ! Ma fille est ravie. Merci.',
  ];
  return subjects.map((subject, i) => ({
    id: i + 1,
    date: daysAgo(rand(0, 14)),
    name: FAKE_CUSTOMERS[i].name,
    email: FAKE_CUSTOMERS[i].email,
    subject,
    message: messages[i],
    read: i > 2,
    replied: i > 4,
  }));
}

function generateMockInventory() {
  return PRODUCTS_CATALOG.map(p => ({
    ...p,
    stock: rand(2, 30),
    threshold: 5,
    age: p.category === 'draisienne' ? '1–3 ans' :
         p.category === '12' ? '2–4 ans' :
         p.category === '14' ? '3–5 ans' :
         p.category === '16' ? '4–6 ans' :
         p.category === '18' ? '5–7 ans' :
         p.category === '20' ? '6–9 ans' :
         p.category === '24' ? '8–12 ans' :
         p.category === 'bmx' ? '8+ ans' :
         p.category === 'electric' ? '6–10 ans' : '—',
  }));
}

function generateMockSupplierOrders(orders) {
  const supOrders = [];
  orders.filter(o => o.supplierOrderId).forEach((order, i) => {
    const costRatio = 0.6 + Math.random() * 0.15;
    supOrders.push({
      id: order.supplierOrderId,
      date: new Date(new Date(order.date).getTime() - 86400000).toISOString(),
      supplier: SUPPLIERS[i % SUPPLIERS.length],
      orderRef: order.id,
      items: order.items.map(it => ({ name: it.name, qty: it.qty, unitCost: Math.round(it.price * costRatio) })),
      total: Math.round(order.subtotal * costRatio),
      status: order.status === 'pending' || order.status === 'confirmed' ? 'pending' : 'delivered',
    });
  });
  return supOrders;
}

function generateMockPayments(orders) {
  return orders
    .filter(o => o.paymentStatus !== 'pending')
    .map((order, i) => ({
      id: payId(3000 + i),
      date: order.date,
      orderId: order.id,
      customer: order.customer.name,
      amount: order.total,
      method: pick(['Carte bancaire', 'Carte bancaire', 'Carte bancaire', 'PayPal']),
      status: order.paymentStatus === 'refunded' ? 'refunded' : 'completed',
    }));
}

/* ─── Accès aux données ────────────────────────────── */
function getOrders()    { return JSON.parse(localStorage.getItem('vk_admin_orders')   || 'null'); }
function getContacts()  { return JSON.parse(localStorage.getItem('vk_admin_contacts') || 'null'); }
function getInventory() { return JSON.parse(localStorage.getItem('vk_admin_inventory')|| 'null'); }
function getSupOrders() { return JSON.parse(localStorage.getItem('vk_admin_sup_orders')|| 'null'); }
function getPayments()  { return JSON.parse(localStorage.getItem('vk_admin_payments') || 'null'); }

function saveOrders(d)    { localStorage.setItem('vk_admin_orders',    JSON.stringify(d)); }
function saveContacts(d)  { localStorage.setItem('vk_admin_contacts',  JSON.stringify(d)); }
function saveInventory(d) { localStorage.setItem('vk_admin_inventory', JSON.stringify(d)); }
function saveSupOrders(d) { localStorage.setItem('vk_admin_sup_orders',JSON.stringify(d)); }
function savePayments(d)  { localStorage.setItem('vk_admin_payments',  JSON.stringify(d)); }

function initData() {
  let orders = getOrders();
  if (!orders) {
    orders = generateMockOrders();
    saveOrders(orders);
  }
  let contacts = getContacts();
  if (!contacts) { contacts = generateMockContacts(); saveContacts(contacts); }
  let inventory = getInventory();
  if (!inventory) { inventory = generateMockInventory(); saveInventory(inventory); }
  let supOrders = getSupOrders();
  if (!supOrders) { supOrders = generateMockSupplierOrders(orders); saveSupOrders(supOrders); }
  let payments = getPayments();
  if (!payments) { payments = generateMockPayments(orders); savePayments(payments); }
}

/* ─── Génération de facture HTML ───────────────────── */
function generateInvoiceHTML(order) {
  const taxRate = 0.20;
  const htSubtotal = (order.subtotal / (1 + taxRate));
  const tva = order.subtotal - htSubtotal;
  const rows = order.items.map(it => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;">${it.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;text-align:center;">${it.qty}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;text-align:right;">${(it.price / 1.2).toFixed(2)} €</td>
      <td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;text-align:right;font-weight:600;">${(it.price * it.qty).toFixed(2)} €</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<title>Facture ${order.id}</title>
<style>
  body{font-family:'Segoe UI',Arial,sans-serif;color:#0D1B2A;margin:0;padding:32px;max-width:800px;margin:0 auto;}
  .inv-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:3px solid #FF6B35;}
  .inv-logo{font-size:1.5rem;font-weight:800;color:#0D1B2A;}
  .inv-logo span{color:#FF6B35;}
  .inv-company{font-size:.8rem;color:#6B7280;margin-top:4px;}
  .inv-meta h1{font-size:1.4rem;color:#FF6B35;margin:0 0 4px;text-align:right;}
  .inv-meta p{font-size:.82rem;color:#6B7280;margin:0;text-align:right;}
  .inv-parties{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:32px;}
  .inv-party-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:#6B7280;margin-bottom:6px;font-weight:600;}
  .inv-party-name{font-weight:700;margin-bottom:4px;}
  .inv-party-info{font-size:.85rem;color:#374151;line-height:1.6;}
  table{width:100%;border-collapse:collapse;margin-bottom:24px;}
  thead{background:#0D1B2A;color:white;}
  thead th{padding:12px 8px;text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;}
  thead th:last-child,thead th:nth-child(3){text-align:right;}
  thead th:nth-child(2){text-align:center;}
  .inv-totals{margin-left:auto;width:260px;}
  .tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:.88rem;}
  .tot-row.total{font-weight:800;font-size:1.05rem;border-top:2px solid #0D1B2A;margin-top:6px;padding-top:10px;}
  .inv-footer{margin-top:48px;padding-top:20px;border-top:1px solid #E5E7EB;font-size:.75rem;color:#6B7280;text-align:center;}
  .no-print-btn{position:fixed;top:20px;right:20px;background:#FF6B35;color:white;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.9rem;}
  @media print{.no-print-btn{display:none;}}
</style></head>
<body>
<button class="no-print-btn" onclick="window.print()">🖨️ Imprimer</button>
<div class="inv-header">
  <div>
    <div class="inv-logo">Vélo<span>Kid</span></div>
    <div class="inv-company">
      12 rue des Cyclistes — 75011 Paris<br>
      SIRET : 123 456 789 00012 · TVA : FR12123456789<br>
      bonjour@velokid.fr · 01 23 45 67 89
    </div>
  </div>
  <div class="inv-meta">
    <h1>FACTURE</h1>
    <p>N° ${order.id}</p>
    <p>Date : ${fmtDate(order.date)}</p>
  </div>
</div>
<div class="inv-parties">
  <div>
    <div class="inv-party-label">Vendeur</div>
    <div class="inv-party-name">VéloKid SAS</div>
    <div class="inv-party-info">12 rue des Cyclistes<br>75011 Paris, France</div>
  </div>
  <div>
    <div class="inv-party-label">Client</div>
    <div class="inv-party-name">${order.customer.name}</div>
    <div class="inv-party-info">
      ${order.customer.address}<br>
      ${order.customer.postalCode} ${order.customer.city}<br>
      ${order.customer.email}
    </div>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th>Désignation</th>
      <th>Qté</th>
      <th>Prix HT unitaire</th>
      <th>Total TTC</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
    ${order.shipping > 0 ? `<tr><td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;">Frais de livraison</td><td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;text-align:center;">1</td><td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;text-align:right;">${(order.shipping/1.2).toFixed(2)} €</td><td style="padding:10px 8px;border-bottom:1px solid #E5E7EB;text-align:right;font-weight:600;">${order.shipping.toFixed(2)} €</td></tr>` : ''}
  </tbody>
</table>
<div class="inv-totals">
  <div class="tot-row"><span>Sous-total HT</span><span>${htSubtotal.toFixed(2)} €</span></div>
  <div class="tot-row"><span>TVA (20 %)</span><span>${tva.toFixed(2)} €</span></div>
  ${order.shipping === 0 ? '<div class="tot-row"><span>Livraison</span><span>Gratuite</span></div>' : ''}
  <div class="tot-row total"><span>Total TTC</span><span>${order.total.toFixed(2)} €</span></div>
</div>
<div class="inv-footer">
  Conditions de règlement : paiement à la commande — TVA non applicable, art. 293 B du CGI si applicable<br>
  En cas de litige : Médiation de la consommation disponible sur mediateur-conso.fr<br>
  VéloKid SAS — Capital 10 000 € — RCS Paris B 123 456 789
</div>
</body></html>`;
}

/* ─── Fonctions partagées avec paiement.html ────────── */
function buildOrderFromCart(orderNumber) {
  const cartRaw = localStorage.getItem('velokid_cart');
  const orderRaw = localStorage.getItem('velokid_order');
  if (!cartRaw || !orderRaw) return null;

  const cart  = JSON.parse(cartRaw);
  const info  = JSON.parse(orderRaw);
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping  = subtotal >= 99 ? 0 : 9.90;
  const total     = subtotal + shipping;

  const order = {
    id: orderNumber,
    date: new Date().toISOString(),
    customer: {
      name: (info.firstName || '') + ' ' + (info.lastName || ''),
      email: info.email || '',
      phone: info.phone || '',
      address: info.address || '',
      city: info.city || '',
      postalCode: info.postalCode || '',
    },
    items: cart.map(it => ({ name: it.name, price: it.price, qty: it.qty, img: it.img, age: it.age })),
    subtotal,
    shipping,
    total,
    status: 'confirmed',
    paymentStatus: 'paid',
    trackingNumber: null,
    supplierOrderId: null,
  };
  order.invoice = { html: generateInvoiceHTML(order) };
  return order;
}

function saveOrderToAdmin(order) {
  const orders = getOrders() || [];
  orders.unshift(order);
  saveOrders(orders);
  // Ajouter paiement
  const payments = getPayments() || [];
  payments.unshift({
    id: payId(Date.now() % 100000),
    date: order.date,
    orderId: order.id,
    customer: order.customer.name,
    amount: order.total,
    method: 'Carte bancaire',
    status: 'completed',
  });
  savePayments(payments);
}

/* ─── RENDU DASHBOARD ──────────────────────────────── */
function renderDashboard() {
  const orders   = getOrders() || [];
  const contacts = getContacts() || [];
  const payments = getPayments() || [];
  const inventory= getInventory() || [];

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
  const ca = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pending = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const unread  = contacts.filter(c => !c.read).length;
  const lowStock = inventory.filter(p => p.stock <= p.threshold);

  // KPIs
  el('kpi-ca').textContent    = fmtPrice(ca);
  el('kpi-today').textContent = todayOrders.length;
  el('kpi-pending').textContent = pending;
  el('kpi-msgs').textContent  = unread;

  // Dernières commandes
  const tbody = el('dash-orders');
  tbody.innerHTML = orders.slice(0, 7).map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td class="light">${fmtDate(o.date)}</td>
      <td><div class="td-customer">${o.customer.name}</div><div class="td-email">${o.customer.email}</div></td>
      <td>${o.items.map(i => i.name).join(', ')}</td>
      <td><strong>${fmtPrice(o.total)}</strong></td>
      <td><span class="badge ${STATUS_BADGE[o.status]}">${STATUS_LABELS[o.status]}</span></td>
      <td><button class="btn-icon" onclick="openOrderModal('${o.id}')" title="Voir">👁</button></td>
    </tr>`).join('');

  // Alerte stocks bas
  const alertBox = el('stock-alert-box');
  if (lowStock.length > 0) {
    alertBox.innerHTML = `<div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <div><strong>${lowStock.length} produit(s) en stock faible :</strong> ${lowStock.map(p => `${p.name} (${p.stock} restants)`).join(', ')}</div>
    </div>`;
  } else {
    alertBox.innerHTML = '';
  }
}

/* ─── RENDU COMMANDES ───────────────────────────────── */
let currentOrderFilter = 'all';

function renderOrders(filter) {
  if (filter !== undefined) currentOrderFilter = filter;
  // Boutons filtres
  document.querySelectorAll('#section-orders .filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === currentOrderFilter);
  });

  const orders = getOrders() || [];
  const filtered = currentOrderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === currentOrderFilter);

  const tbody = el('orders-tbody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray);">Aucune commande</td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map(o => `
    <tr>
      <td><strong style="font-family:monospace;letter-spacing:.03em;">${o.id}</strong></td>
      <td class="light">${fmtDate(o.date)}</td>
      <td>
        <div class="td-customer">${o.customer.name}</div>
        <div class="td-email">${o.customer.email}</div>
      </td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--gray);font-size:.8rem;">
        ${o.items.map(i => i.name + (i.qty > 1 ? ' ×'+i.qty : '')).join(', ')}
      </td>
      <td><strong>${fmtPrice(o.total)}</strong></td>
      <td><span class="badge ${PAY_BADGE[o.paymentStatus]}">${PAY_LABELS[o.paymentStatus]}</span></td>
      <td><span class="badge ${STATUS_BADGE[o.status]}">${STATUS_LABELS[o.status]}</span></td>
      <td>
        <div style="display:flex;gap:5px;">
          <button class="btn-icon" onclick="openOrderModal('${o.id}')" title="Voir le détail">👁</button>
          <button class="btn-icon" onclick="openInvoice('${o.id}')" title="Ouvrir la facture">🧾</button>
        </div>
      </td>
    </tr>`).join('');
}

/* ─── MODAL COMMANDE ────────────────────────────────── */
function openOrderModal(orderId) {
  const orders = getOrders() || [];
  const order  = orders.find(o => o.id === orderId);
  if (!order) return;

  const statusOrder = ['pending','confirmed','processing','shipped','delivered'];
  const currentIdx  = statusOrder.indexOf(order.status);

  const timelineSteps = [
    { key: 'pending',    icon: '📦', label: 'Commande<br>reçue' },
    { key: 'confirmed',  icon: '✅', label: 'Paiement<br>confirmé' },
    { key: 'processing', icon: '⚙️', label: 'En<br>préparation' },
    { key: 'shipped',    icon: '🚚', label: 'Expédiée' },
    { key: 'delivered',  icon: '🏠', label: 'Livrée' },
  ];

  let timelineHTML = '';
  timelineSteps.forEach((step, i) => {
    const idx = statusOrder.indexOf(step.key);
    const isDone    = (order.status !== 'cancelled') && idx < currentIdx;
    const isCurrent = (order.status !== 'cancelled') && idx === currentIdx;
    const cls = isDone ? 'done' : isCurrent ? 'current' : '';
    timelineHTML += `<div class="timeline-step ${cls}">
      <div class="timeline-step-icon">${isDone ? '✓' : step.icon}</div>
      <div class="timeline-step-label">${step.label}</div>
    </div>`;
    if (i < timelineSteps.length - 1) {
      timelineHTML += `<div class="timeline-connector ${isDone ? 'done' : ''}"></div>`;
    }
  });

  const tva = 0.2;
  const ht  = order.subtotal / (1 + tva);

  el('modal-title').textContent = 'Commande ' + order.id;
  el('modal-body').innerHTML = `
    <div class="order-info-grid">
      <div class="info-block">
        <div class="info-block-label">Client</div>
        <div class="info-block-value">${order.customer.name}<br>${order.customer.email}<br>${order.customer.phone || ''}</div>
      </div>
      <div class="info-block">
        <div class="info-block-label">Livraison</div>
        <div class="info-block-value">${order.customer.address}<br>${order.customer.postalCode} ${order.customer.city}</div>
      </div>
      <div class="info-block">
        <div class="info-block-label">Date de commande</div>
        <div class="info-block-value">${fmtDateTime(order.date)}</div>
      </div>
      <div class="info-block">
        <div class="info-block-label">Numéro de suivi</div>
        <div class="info-block-value">${order.trackingNumber || '—'}</div>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:.8rem;font-weight:600;color:var(--gray);text-transform:uppercase;margin-bottom:10px;">Statut de la commande</div>
      ${order.status === 'cancelled' ? '<div class="alert alert-danger"><span class="alert-icon">❌</span> Commande annulée</div>' : `<div class="status-timeline">${timelineHTML}</div>`}
    </div>

    <div style="font-size:.8rem;font-weight:600;color:var(--gray);text-transform:uppercase;margin-bottom:10px;">Articles commandés</div>
    <div class="order-items-list">
      ${order.items.map(it => `
        <div class="order-item-row">
          <img src="${it.img}" alt="${it.name}" onerror="this.style.display='none'">
          <div>
            <div class="order-item-name">${it.name}</div>
            <div class="order-item-sub">${it.age || ''} — Qté : ${it.qty}</div>
          </div>
          <div class="order-item-price">${fmtPrice(it.price * it.qty)}</div>
        </div>`).join('')}
    </div>

    <div class="order-totals">
      <div class="totals-row"><span>Sous-total HT</span><span>${fmtPrice(ht)}</span></div>
      <div class="totals-row"><span>TVA (20 %)</span><span>${fmtPrice(order.subtotal - ht)}</span></div>
      <div class="totals-row"><span>Livraison</span><span>${order.shipping === 0 ? 'Gratuite' : fmtPrice(order.shipping)}</span></div>
      <div class="totals-row total"><span>Total TTC</span><span>${fmtPrice(order.total)}</span></div>
    </div>

    <div style="margin-top:20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <div style="font-size:.85rem;font-weight:600;">Changer le statut :</div>
      <select class="status-select" id="status-select-modal" onchange="updateOrderStatus('${order.id}', this.value)">
        ${Object.entries(STATUS_LABELS).map(([k,v]) => `<option value="${k}" ${k === order.status ? 'selected' : ''}>${v}</option>`).join('')}
      </select>
    </div>`;

  openModal();
}

function openModal()  { el('order-modal').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { el('order-modal').classList.remove('open'); document.body.style.overflow = ''; }

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders() || [];
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx < 0) return;
  orders[idx].status = newStatus;
  if ((newStatus === 'shipped' || newStatus === 'delivered') && !orders[idx].trackingNumber) {
    orders[idx].trackingNumber = trackNum();
  }
  saveOrders(orders);
  showToast('Statut mis à jour : ' + STATUS_LABELS[newStatus], 'success');
  renderOrders();
  renderDashboard();
}

/* ─── STOCKS ─────────────────────────────────────────── */
function renderInventory() {
  const inventory = getInventory() || [];
  const tbody = el('inventory-tbody');
  const lowStockCount = inventory.filter(p => p.stock <= p.threshold).length;
  const alertEl = el('low-stock-alert');
  if (alertEl) alertEl.style.display = lowStockCount > 0 ? 'flex' : 'none';

  tbody.innerHTML = inventory.map((p, i) => {
    const low = p.stock <= p.threshold;
    const catBadge = p.category === 'draisienne' ? 'badge-confirmed'
      : p.category === 'bmx' ? 'badge-processing'
      : p.category === 'electric' ? 'badge-shipped'
      : 'badge-pending';
    return `<tr class="${low ? 'low-stock' : ''}">
      <td>
        <div class="td-product">
          <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'">
          <div>
            <div class="td-product-name">${p.name}</div>
            <div class="td-product-sub">${p.age || p.category}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${catBadge}">${p.category}</span></td>
      <td><strong>${fmtPrice(p.price)}</strong></td>
      <td>
        <input type="number" class="stock-input" value="${p.stock}" min="0"
          onchange="updateStock(${i}, this.value)">
      </td>
      <td class="light">${p.threshold} unités</td>
      <td>${low
        ? '<span class="badge badge-cancelled">⚠️ Stock faible</span>'
        : '<span class="badge badge-delivered">✓ OK</span>'}</td>
    </tr>`;
  }).join('');
}

function updateStock(idx, val) {
  const inventory = getInventory() || [];
  inventory[idx].stock = parseInt(val) || 0;
  saveInventory(inventory);
  showToast('Stock mis à jour', 'success');
  renderInventory();
  renderDashboard();
}

/* ─── COMMANDES FOURNISSEURS ────────────────────────── */
function renderSupplierOrders() {
  const supOrders = getSupOrders() || [];
  const tbody = el('sup-orders-tbody');
  tbody.innerHTML = supOrders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td class="light">${fmtDate(o.date)}</td>
      <td>${o.supplier}</td>
      <td>${o.items.map(i => i.name + ' ×' + i.qty).join(', ')}</td>
      <td><strong>${fmtPrice(o.total)}</strong></td>
      <td><span class="badge ${o.status === 'delivered' ? 'badge-delivered' : 'badge-pending'}">${o.status === 'delivered' ? 'Livrée' : 'En attente'}</span></td>
      <td>Commande client : <strong>${o.orderRef}</strong></td>
    </tr>`).join('');
}

function toggleSupplierForm() {
  const form = el('supplier-form');
  form.classList.toggle('open');
  if (form.classList.contains('open')) form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function submitSupplierOrder(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const supOrders = getSupOrders() || [];
  const newSup = {
    id: supId(Date.now() % 10000),
    date: new Date().toISOString(),
    supplier: data.get('supplier'),
    orderRef: '—',
    items: [{ name: data.get('product'), qty: parseInt(data.get('qty')), unitCost: parseFloat(data.get('unitCost')) }],
    total: parseInt(data.get('qty')) * parseFloat(data.get('unitCost')),
    status: 'pending',
  };
  supOrders.unshift(newSup);
  saveSupOrders(supOrders);
  toggleSupplierForm();
  e.target.reset();
  renderSupplierOrders();
  showToast('Commande fournisseur créée', 'success');
}

/* ─── MESSAGES ───────────────────────────────────────── */
let selectedMessageId = null;

function renderContacts() {
  const contacts = getContacts() || [];
  const unreadCount = contacts.filter(c => !c.read).length;
  const list = el('message-list');

  list.innerHTML = contacts.map(c => `
    <div class="message-item ${!c.read ? 'unread' : ''} ${selectedMessageId === c.id ? 'selected' : ''}"
         onclick="viewMessage(${c.id})">
      <div class="message-avatar ${c.replied ? 'replied' : ''}">${c.name[0].toUpperCase()}</div>
      <div class="message-meta">
        <div class="message-from">
          ${c.name}
          ${!c.read ? '<span class="badge badge-new" style="font-size:.62rem;padding:2px 6px;">Nouveau</span>' : ''}
          ${c.replied ? '<span class="badge badge-delivered" style="font-size:.62rem;padding:2px 6px;">Répondu</span>' : ''}
        </div>
        <div class="message-subject">${c.subject}</div>
        <div class="message-preview">${c.message}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
        <div class="message-date">${fmtDate(c.date)}</div>
        ${!c.read ? '<div class="message-unread-dot"></div>' : ''}
      </div>
    </div>`).join('');

  // Badge sidebar
  const badge = el('sidebar-msg-badge');
  if (badge) badge.textContent = unreadCount || '';
  // Compteur dans header
  const countLabel = el('msg-count-label');
  if (countLabel) countLabel.textContent = `${contacts.length} message${contacts.length > 1 ? 's' : ''} · ${unreadCount} non lu${unreadCount > 1 ? 's' : ''}`;
  // KPI dashboard
  const kpiEl = el('kpi-msgs');
  if (kpiEl) kpiEl.textContent = unreadCount;
}

function viewMessage(id) {
  const contacts = getContacts() || [];
  const idx = contacts.findIndex(c => c.id === id);
  if (idx < 0) return;
  selectedMessageId = id;

  // Marquer comme lu
  contacts[idx].read = true;
  saveContacts(contacts);

  const c = contacts[idx];
  const panel = el('message-detail-panel');
  panel.innerHTML = `
    <div class="message-detail-header">
      <div class="message-detail-subject">${c.subject}</div>
      <div class="message-detail-meta">
        <span>👤 <strong>${c.name}</strong></span>
        <span>✉️ <a href="mailto:${c.email}" style="color:var(--primary);">${c.email}</a></span>
        <span>📅 <strong>${fmtDateTime(c.date)}</strong></span>
        <span>Statut : <span class="badge ${c.replied ? 'badge-delivered' : 'badge-pending'}">${c.replied ? 'Répondu' : 'En attente de réponse'}</span></span>
      </div>
    </div>
    <div class="message-detail-body">
      <div class="message-detail-text">${c.message}</div>
    </div>
    <div class="message-detail-actions">
      <a href="mailto:${c.email}?subject=Re%3A%20${encodeURIComponent(c.subject)}&body=Bonjour%20${encodeURIComponent(c.name.split(' ')[0])}%2C%0A%0A"
         class="btn btn-primary btn-sm">✉️ Répondre par email</a>
      ${!c.replied
        ? `<button class="btn btn-outline btn-sm" onclick="markReplied(${id})">✔ Marquer comme répondu</button>`
        : '<span class="badge badge-delivered" style="padding:6px 12px;">✔ Message traité</span>'}
    </div>`;

  renderContacts();
}

function markReplied(id) {
  const contacts = getContacts() || [];
  const idx = contacts.findIndex(c => c.id === id);
  if (idx < 0) return;
  contacts[idx].replied = true;
  saveContacts(contacts);
  viewMessage(id);
  showToast('Message marqué comme répondu', 'success');
}

/* ─── PAIEMENTS ──────────────────────────────────────── */
let currentPayFilter = 'all';

function renderPayments(filter) {
  if (filter !== undefined) currentPayFilter = filter;
  document.querySelectorAll('#section-payments .filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === currentPayFilter);
  });

  const payments = getPayments() || [];
  const filtered = currentPayFilter === 'all' ? payments : payments.filter(p => p.status === currentPayFilter);

  const total = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const count = payments.filter(p => p.status === 'completed').length;
  const refunded = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  el('pay-summary-total').textContent = fmtPrice(total);
  el('pay-summary-count').textContent = count;
  el('pay-summary-refund').textContent = fmtPrice(refunded);

  const tbody = el('payments-tbody');
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td><strong>${p.id}</strong></td>
      <td class="light">${fmtDate(p.date)}</td>
      <td><a href="#" onclick="openOrderModal('${p.orderId}');return false;" style="color:var(--primary);font-weight:600;">${p.orderId}</a></td>
      <td>${p.customer}</td>
      <td><strong>${fmtPrice(p.amount)}</strong></td>
      <td>${p.method}</td>
      <td><span class="badge ${PAY_BADGE[p.status]}">${PAY_LABELS[p.status]}</span></td>
    </tr>`).join('');
}

/* ─── FACTURES ───────────────────────────────────────── */
let currentInvoicePeriod = 'all';

function renderInvoices(period) {
  if (period !== undefined) currentInvoicePeriod = period;

  // Mettre à jour les boutons de filtre
  document.querySelectorAll('#section-invoices .filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.period === currentInvoicePeriod);
  });

  const orders = (getOrders() || []).filter(o => o.invoice && o.invoice.html);
  const now = new Date();

  // Filtrer par période
  const filtered = orders.filter(o => {
    const d = new Date(o.date);
    if (currentInvoicePeriod === 'today') return d.toDateString() === now.toDateString();
    if (currentInvoicePeriod === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (currentInvoicePeriod === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true; // 'all'
  });

  const container = el('invoices-container');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:56px;color:var(--gray);">
      <div style="font-size:2.5rem;margin-bottom:12px;opacity:.3;">🧾</div>
      <div style="font-weight:600;font-size:.9rem;">Aucune facture pour cette période</div>
    </div>`;
    return;
  }

  // Grouper par mois
  const groups = {};
  filtered.forEach(o => {
    const d = new Date(o.date);
    const key = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(o);
  });

  container.innerHTML = Object.entries(groups).map(([month, invoices]) => {
    const groupTotal = invoices.reduce((s, o) => s + o.total, 0);
    return `
    <div class="inv-group">
      <div class="inv-group-header">
        <span class="inv-group-title">${month}</span>
        <span class="inv-group-count">${invoices.length} facture${invoices.length > 1 ? 's' : ''}</span>
        <span class="inv-group-total">${fmtPrice(groupTotal)}</span>
      </div>
      <div class="invoice-grid">
        ${invoices.map(o => `
          <div class="invoice-card">
            <div class="invoice-number">📄 ${o.id}</div>
            <div class="invoice-customer">${o.customer.name}</div>
            <div class="invoice-date">📅 ${fmtDate(o.date)}</div>
            <div class="invoice-amount">${fmtPrice(o.total)}</div>
            <div class="invoice-badges">
              <span class="badge ${STATUS_BADGE[o.status]}">${STATUS_LABELS[o.status]}</span>
              <span class="badge ${PAY_BADGE[o.paymentStatus]}">${PAY_LABELS[o.paymentStatus]}</span>
            </div>
            <div class="invoice-actions">
              <button class="btn btn-primary btn-sm" onclick="openInvoice('${o.id}')">🖨️ Voir / Imprimer</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function openInvoice(orderId) {
  const orders = getOrders() || [];
  const order  = orders.find(o => o.id === orderId);
  if (!order || !order.invoice) return;
  const win = window.open('', '_blank');
  win.document.write(order.invoice.html);
  win.document.close();
}

/* ─── NAVIGATION SECTIONS ─────────────────────────── */
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  const section = el('section-' + name);
  if (section) section.classList.add('active');
  document.querySelectorAll(`[data-section="${name}"]`).forEach(l => l.classList.add('active'));

  const titles = {
    dashboard:  { title: 'Tableau de bord', sub: 'Vue d\'ensemble' },
    orders:     { title: 'Commandes clients', sub: 'Gestion des commandes' },
    inventory:  { title: 'Gestion des stocks', sub: 'Inventaire produits' },
    suppliers:  { title: 'Commandes fournisseurs', sub: 'Dropshipping' },
    contacts:   { title: 'Messages & Contacts', sub: 'Boîte de réception' },
    payments:   { title: 'Suivi des paiements', sub: 'Encaissements' },
    invoices:   { title: 'Factures', sub: 'Archive des factures' },
  };
  if (titles[name]) {
    el('topbar-title').textContent = titles[name].title;
    el('topbar-sub').textContent   = titles[name].sub;
  }

  // Render on show
  const renders = {
    dashboard: renderDashboard,
    orders:    () => renderOrders(),
    inventory: renderInventory,
    suppliers: renderSupplierOrders,
    contacts:  renderContacts,
    payments:  () => renderPayments(),
    invoices:  renderInvoices,
  };
  if (renders[name]) renders[name]();

  // Mobile: fermer sidebar
  if (window.innerWidth <= 1024) closeSidebar();
}

/* ─── SIDEBAR MOBILE ─────────────────────────────────── */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const isOpen   = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open', isOpen);
}
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

/* ─── TOAST ───────────────────────────────────────────── */
function showToast(msg, type = '') {
  const toast = el('admin-toast');
  toast.textContent = type === 'success' ? '✅ ' + msg : type === 'error' ? '❌ ' + msg : msg;
  toast.className = 'admin-toast show ' + type;
  setTimeout(() => { toast.className = 'admin-toast'; }, 3000);
}

/* ─── UTILITAIRE ────────────────────────────────────── */
function el(id) { return document.getElementById(id); }

/* ─── INIT ────────────────────────────────────────────── */
function adminInit() {
  // Vérification session
  if (!sessionStorage.getItem('vk_admin')) {
    location.href = 'admin-login.html';
    return;
  }
  initData();
  showSection('dashboard');

  // Mettre à jour la date dans la topbar
  const dateEl = el('topbar-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Badge messages non lus dans sidebar
  const contacts = getContacts() || [];
  const unread = contacts.filter(c => !c.read).length;
  const badge = el('sidebar-msg-badge');
  if (badge && unread > 0) badge.textContent = unread;
}

/* ─── LOGIN ───────────────────────────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const error = document.getElementById('login-error');

  if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem('vk_admin', '1');
    location.href = 'admin.html';
  } else {
    error.style.display = 'block';
    error.textContent = 'Identifiants incorrects. Vérifiez votre email et mot de passe.';
  }
}

function handleLogout() {
  sessionStorage.removeItem('vk_admin');
  location.href = 'admin-login.html';
}
