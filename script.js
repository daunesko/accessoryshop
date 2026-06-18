// ========== SLIDER FUNCTIONALITY ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const sliderTrack = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('dotsWrap');

// Create dots
function createDots() {
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
}

// Go to specific slide
function goToSlide(n) {
  currentSlide = n;
  updateSlider();
}

// Update slider position
function updateSlider() {
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  // Update dots
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}

// Previous slide
function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
}

// Event listeners for slider buttons
document.getElementById('btnNext').addEventListener('click', nextSlide);
document.getElementById('btnPrev').addEventListener('click', prevSlide);

// Auto-advance slider
setInterval(nextSlide, 5000);

// Initialize dots
createDots();

// ========== REGISTRATION MODAL ==========
const btnReg = document.getElementById('btnReg');
const closeReg = document.getElementById('closeReg');
const overlayReg = document.getElementById('overlayReg');
const regName = document.getElementById('regName');
const regAgree = document.getElementById('regAgree');
const btnRegSubmit = document.getElementById('btnRegSubmit');
const gMale = document.getElementById('gMale');
const gFemale = document.getElementById('gFemale');

let selectedGender = null;

// Open registration modal
btnReg.addEventListener('click', () => {
  overlayReg.classList.add('active');
});

// Close registration modal
closeReg.addEventListener('click', () => {
  overlayReg.classList.remove('active');
});

// Close on overlay click
overlayReg.addEventListener('click', (e) => {
  if (e.target === overlayReg) {
    overlayReg.classList.remove('active');
  }
});

// Gender selection
gMale.addEventListener('click', () => {
  selectedGender = 'male';
  gMale.classList.add('active');
  gFemale.classList.remove('active');
  checkFormValidity();
});

gFemale.addEventListener('click', () => {
  selectedGender = 'female';
  gFemale.classList.add('active');
  gMale.classList.remove('active');
  checkFormValidity();
});

// Check form validity
function checkFormValidity() {
  const isValid = regName.value.trim() !== '' && 
                  selectedGender !== null && 
                  regAgree.checked;
  btnRegSubmit.disabled = !isValid;
}

// Listen to form changes
regName.addEventListener('input', checkFormValidity);
regAgree.addEventListener('change', checkFormValidity);

// Submit registration
btnRegSubmit.addEventListener('click', () => {
  const data = {
    name: regName.value,
    gender: selectedGender,
    agreed: regAgree.checked
  };
  
  console.log('Registration data:', data);
  alert(`✅ Спасибо за регистрацию, ${regName.value}!`);
  
  // Reset form
  regName.value = '';
  selectedGender = null;
  regAgree.checked = false;
  gMale.classList.remove('active');
  gFemale.classList.remove('active');
  btnRegSubmit.disabled = true;
  
  // Close modal
  overlayReg.classList.remove('active');
});

// ========== SPECIALIST MODAL ==========
const btnHelp = document.getElementById('btnHelp');
const closeSpec = document.getElementById('closeSpec');
const overlaySpec = document.getElementById('overlaySpec');
const specName = document.getElementById('specName');
const specQuestion = document.getElementById('specQuestion');
const btnSpecSubmit = document.getElementById('btnSpecSubmit');

// Open specialist modal
btnHelp.addEventListener('click', () => {
  overlaySpec.classList.add('active');
});

// Close specialist modal
closeSpec.addEventListener('click', () => {
  overlaySpec.classList.remove('active');
});

// Close on overlay click
overlaySpec.addEventListener('click', (e) => {
  if (e.target === overlaySpec) {
    overlaySpec.classList.remove('active');
  }
});

// Submit specialist form
btnSpecSubmit.addEventListener('click', () => {
  if (specName.value.trim() === '' || specQuestion.value.trim() === '') {
    alert('⚠️ Пожалуйста, заполните все поля');
    return;
  }
  
  const data = {
    name: specName.value,
    question: specQuestion.value
  };
  
  console.log('Specialist request:', data);
  alert(`✅ Спасибо за ваш вопрос, ${specName.value}! Специалист скоро свяжется с вами.`);
  
  // Reset form
  specName.value = '';
  specQuestion.value = '';
  
  // Close modal
  overlaySpec.classList.remove('active');
});

// ========== CART + PRODUCT MODAL ==========
const STORAGE_KEY = 'styleAccCart';

// Элементы корзины
const btnCart = document.getElementById('btnCart');
const overlayCart = document.getElementById('overlayCart');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartFooterEl = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');
const btnCheckout = document.getElementById('btnCheckout');

// Элементы модалки товара
const overlayProduct = document.getElementById('overlayProduct');
const closeProduct = document.getElementById('closeProduct');
const pmImg = document.getElementById('pmImg');
const pmBadge = document.getElementById('pmBadge');
const pmName = document.getElementById('pmName');
const pmDesc = document.getElementById('pmDesc');
const pmPrice = document.getElementById('pmPrice');
const pmOldPrice = document.getElementById('pmOldPrice');
const pmAddToCart = document.getElementById('pmAddToCart');

// Состояние корзины: [{ name, emoji, priceText, price, qty }]
let cart = loadCart();
let activeProduct = null; // товар, открытый в модалке

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    /* localStorage недоступен — корзина работает в рамках сессии */
  }
}

// Цена из текста "12 900 ₽" -> 12900
function parsePrice(text) {
  const digits = (text || '').replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

// Форматирование числа -> "12 900 ₽"
function formatPrice(num) {
  return num.toLocaleString('ru-RU') + ' ₽';
}

// Собрать данные товара из карточки
function readProduct(card) {
  const badgeEl = card.querySelector('.card-badge');
  const oldPriceEl = card.querySelector('.old-price');
  const priceText = card.querySelector('.price').textContent.trim();
  return {
    name: card.querySelector('.card-name').textContent.trim(),
    emoji: card.querySelector('.card-img').textContent.trim(),
    desc: card.querySelector('.card-desc').textContent.trim(),
    badgeText: badgeEl ? badgeEl.textContent.trim() : '',
    badgeClass: badgeEl ? badgeEl.className : '',
    priceText: priceText,
    price: parsePrice(priceText),
    oldPriceText: oldPriceEl ? oldPriceEl.textContent.trim() : ''
  };
}

// Добавить товар в корзину
function addToCart(product) {
  const existing = cart.find((item) => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name: product.name,
      emoji: product.emoji,
      priceText: product.priceText,
      price: product.price,
      qty: 1
    });
  }
  saveCart();
  renderCart();
  bumpCounter();
}

function changeQty(name, delta) {
  const item = cart.find((i) => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.name !== name);
  }
  saveCart();
  renderCart();
}

function removeFromCart(name) {
  cart = cart.filter((i) => i.name !== name);
  saveCart();
  renderCart();
}

function totalCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function totalPrice() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// Анимация счётчика
function bumpCounter() {
  cartCount.classList.add('bump');
  setTimeout(() => cartCount.classList.remove('bump'), 200);
}

// Отрисовать корзину
function renderCart() {
  cartCount.textContent = totalCount();

  if (cart.length === 0) {
    cartEmptyEl.style.display = 'block';
    cartItemsEl.style.display = 'none';
    cartFooterEl.style.display = 'none';
    return;
  }

  cartEmptyEl.style.display = 'none';
  cartItemsEl.style.display = 'block';
  cartFooterEl.style.display = 'block';

  cartItemsEl.innerHTML = '';
  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
      </div>
      <div class="cart-qty">
        <button class="qty-btn" data-action="dec" aria-label="Уменьшить">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" data-action="inc" aria-label="Увеличить">+</button>
      </div>
      <button class="cart-item-remove" data-action="remove" aria-label="Удалить">🗑️</button>
    `;

    row.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(item.name, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(item.name, 1));
    row.querySelector('[data-action="remove"]').addEventListener('click', () => removeFromCart(item.name));

    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = formatPrice(totalPrice());
}

// Открыть/закрыть корзину
btnCart.addEventListener('click', () => overlayCart.classList.add('active'));
closeCart.addEventListener('click', () => overlayCart.classList.remove('active'));
overlayCart.addEventListener('click', (e) => {
  if (e.target === overlayCart) overlayCart.classList.remove('active');
});

// Оформление заказа
btnCheckout.addEventListener('click', () => {
  if (cart.length === 0) return;
  alert(`✅ Заказ оформлен!\nТоваров: ${totalCount()}\nСумма: ${formatPrice(totalPrice())}`);
  cart = [];
  saveCart();
  renderCart();
  overlayCart.classList.remove('active');
});

// Открыть модалку товара
function openProductModal(product) {
  activeProduct = product;
  pmImg.textContent = product.emoji;
  pmName.textContent = product.name;
  pmDesc.textContent = product.desc;
  pmPrice.textContent = product.priceText;

  if (product.badgeText) {
    pmBadge.textContent = product.badgeText;
    pmBadge.className = product.badgeClass;
    pmBadge.style.display = '';
  } else {
    pmBadge.style.display = 'none';
  }

  if (product.oldPriceText) {
    pmOldPrice.textContent = product.oldPriceText;
    pmOldPrice.style.display = '';
  } else {
    pmOldPrice.style.display = 'none';
  }

  overlayProduct.classList.add('active');
}

closeProduct.addEventListener('click', () => overlayProduct.classList.remove('active'));
overlayProduct.addEventListener('click', (e) => {
  if (e.target === overlayProduct) overlayProduct.classList.remove('active');
});

// Кнопка "В корзину" внутри модалки товара
pmAddToCart.addEventListener('click', () => {
  if (activeProduct) {
    addToCart(activeProduct);
    flashButton(pmAddToCart);
  }
});

// Анимация кнопки "Добавлено"
function flashButton(btn) {
  const original = btn.textContent;
  btn.textContent = '✅ Добавлено!';
  btn.style.background = '#4caf50';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 1500);
}

// Навесить обработчики на карточки товаров
document.querySelectorAll('.card').forEach((card) => {
  const buyBtn = card.querySelector('.btn-buy');

  // Клик по кнопке "В корзину" — добавляем, модалку НЕ открываем
  if (buyBtn) {
    buyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(readProduct(card));
      flashButton(buyBtn);
    });
  }

  // Клик по самой карточке — открываем модалку товара
  card.addEventListener('click', () => {
    openProductModal(readProduct(card));
  });
});

// Первичная отрисовка (восстановление корзины при загрузке)
renderCart();

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'Escape') {
    overlayReg.classList.remove('active');
    overlaySpec.classList.remove('active');
    overlayCart.classList.remove('active');
    overlayProduct.classList.remove('active');
  }
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('✨ Сайт Аксессуары Style загружен и готов к работе');
