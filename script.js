document.querySelector('.menu-toggle').addEventListener('click', function() {
  document.querySelector('nav').classList.toggle('active');
});


const menuLinks = document.querySelectorAll('nav ul li a');

menuLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    menuLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const targetId = this.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    document.querySelector('nav').classList.remove('active');
  });
});

// Skills Tab Switch
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabContents.forEach(content => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

// Animasi Fade-in untuk Timeline Items
const timelineItems = document.querySelectorAll('.timeline-item');

function checkTimelineAnimation() {
  timelineItems.forEach(item => {
    const itemPosition = item.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (itemPosition < windowHeight - 100) {
      item.classList.add('show');
    }
  });
}

window.addEventListener('scroll', checkTimelineAnimation);
window.addEventListener('load', checkTimelineAnimation);

// Carousel Logic
let currentIndex = 0;
const track = document.querySelector(".carousel-track");
const indicators = document.querySelectorAll(".indicator");
const slides = document.querySelectorAll(".achievement-card");
const totalSlides = slides.length;

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  
  indicators.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
  
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentIndex);
  });
}

// Ganti slide tiap 3 detik
setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
}, 3000);

updateCarousel();
