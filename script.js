// ------------------------------
// CONFIGURACIÓN DEL CARRITO
// ------------------------------

const CART_KEY = 'easy_culinary_cart';

// Leer carrito
function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

// Guardar carrito
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Notificación bonita
function showAlert(text = 'Producto añadido al carrito') {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert';
  alertBox.textContent = text;

  document.body.appendChild(alertBox);

  setTimeout(() => alertBox.classList.add('show'), 10);
  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => alertBox.remove(), 300);
  }, 2000);
}

// Añadir producto
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({ ...product, cantidad: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showAlert();
}

// Restar producto
function decreaseItem(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.cantidad -= 1;

  if (item.cantidad <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
    showAlert('Producto eliminado');
  }

  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

// Sumar producto
function increaseItem(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.cantidad += 1;

  saveCart(cart);
  updateCartCount();
  renderCartPage();
}

// Actualizar contador del carrito
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = total;
}

// Renderizar carrito en carrito.html
function renderCartPage() {
  const container = document.querySelector('#cart-items');
  const totalSpan = document.querySelector('#cart-total');

  if (!container || !totalSpan) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; opacity:0.7;">Tu carrito está vacío.</p>';
    totalSpan.textContent = '0 €';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        Precio: ${item.precio} €
      </div>

      <div style="display:flex; align-items:center; gap:10px;">
        <button class="btn-small" onclick="decreaseItem('${item.id}')">−</button>
        <span style="font-size:1.2rem; font-weight:700;">${item.cantidad}</span>
        <button class="btn-small" onclick="increaseItem('${item.id}')">+</button>
      </div>

      <div>
        Subtotal: ${subtotal} €
      </div>
    `;
    container.appendChild(div);
  });

  totalSpan.textContent = total + ' €';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-add-cart]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        precio: parseFloat(btn.dataset.precio)
      };
      addToCart(product);
    });
  });

  updateCartCount();
  renderCartPage();
});
