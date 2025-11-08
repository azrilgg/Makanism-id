// Buat teks melingkar
let circle = document.querySelector('.circle');
let text = circle.textContent.split('');
circle.textContent = '';
text.forEach((char, i) => {
  let span = document.createElement('span');
  span.textContent = char;
  span.style.transform = `rotate(${(360 / text.length) * i}deg)`;
  circle.appendChild(span);
});

// Carousel
let list = document.querySelector('.list');
let items = document.querySelectorAll('.item');
let count = items.length;
let active = 1;
let width_item = items[active].offsetWidth;
let prev = document.getElementById('prev');
let next = document.getElementById('next');

function runCarousel() {
  let old_active = document.querySelector('.item.active');
  if (old_active) old_active.classList.remove('active');
  items[active].classList.add('active');
  list.style.transform = `translateX(${-width_item * (active - 1)}px)`;
}

next.onclick = () => {
  active = active >= count - 1 ? 0 : active + 1;
  runCarousel();
};
prev.onclick = () => {
  active = active <= 0 ? count - 1 : active - 1;
  runCarousel();
};

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});
