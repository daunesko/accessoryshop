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

// ========== BUY BUTTON FUNCTIONALITY ==========
const buyButtons = document.querySelectorAll('.btn-buy');

buyButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Get product info
    const card = btn.closest('.card');
    const productName = card.querySelector('.card-name').textContent;
    const price = card.querySelector('.price').textContent;
    
    // Add animation
    btn.textContent = '✅ Добавлено!';
    btn.style.background = '#4caf50';
    
    setTimeout(() => {
      btn.textContent = 'В корзину';
      btn.style.background = '';
    }, 2000);
    
    console.log(`Added to cart: ${productName} - ${price}`);
  });
});

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'Escape') {
    overlayReg.classList.remove('active');
    overlaySpec.classList.remove('active');
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
