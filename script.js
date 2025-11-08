// =============================
// Navbar Scroll Effect
// =============================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// =============================
// Mobile Menu Toggle
// =============================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  menuToggle.querySelector("i").classList.toggle("fa-times");
});

// =============================
// Scroll Animation
// =============================
const animatedElements = document.querySelectorAll("[data-animate]");
function animateOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", animateOnScroll);
animateOnScroll();

// =============================
// Testimonial Slider
// =============================
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");
let index = 0;

function createDots() {
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });
  dotsContainer.children[0].classList.add("active-dot");
}

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  dotsContainer.childNodes.forEach(dot => dot.classList.remove("active-dot"));
  slides[i].classList.add("active");
  dotsContainer.children[i].classList.add("active-dot");
  index = i;
}

function autoSlide() {
  index = (index + 1) % slides.length;
  showSlide(index);
}
createDots();
setInterval(autoSlide, 5000);

// =============================
// Reservation Form
// =============================
const form = document.getElementById("formReservasi");
form.addEventListener("submit", e => {
  e.preventDefault();
  alert("🎉 Terima kasih! Reservasi Anda telah dikonfirmasi oleh Makanism ID.");
  form.reset();
});

// =============================
// Parallax Scroll Effect
// =============================
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  let offset = window.scrollY;
  hero.style.backgroundPositionY = offset * 0.5 + "px";
});
