// *** script.js: Full code for dual-section filter & pagination + other features ***

// Number of items per page for pagination
const itemsPerPage = 4;
// State object will hold pagination info per section
const state = {};

// -------------------------
// Section Filter & Pagination
// -------------------------
/**
 * Filters and paginates cards within a given section.
 * @param {string} sectionId - The ID prefix of the section (e.g., 'artikujt', 'krijime').
 * @param {string} category  - The data-category value to filter by, or 'all'.
 */
function filterSection(sectionId, category) {
  const cardsContainer = document.getElementById(`${sectionId}-cards`);
  if (!cardsContainer) return;

  // Initialize state for section if needed
  if (!state[sectionId]) {
    state[sectionId] = { currentPage: 1, allCards: [], filtered: [] };
  }
  const st = state[sectionId];

  // Collect all cards in this section, then filter by category
  st.allCards = Array.from(cardsContainer.querySelectorAll('.card'));
  st.filtered = st.allCards.filter(card =>
    category === 'all' || card.dataset.category === category
  );
  st.currentPage = 1;

  // Display first page and update controls
  showPage(sectionId);
  updatePagination(sectionId);
  highlightFilterButton(sectionId, category);
}

/**
 * Shows the cards for the current page in a section.
 */
function showPage(sectionId) {
  const st = state[sectionId];
  const container = document.getElementById(`${sectionId}-cards`);
  if (!st || !container) return;

  // Hide all cards
  container.querySelectorAll('.card').forEach(card => {
    card.style.display = 'none';
  });

  // Show only the slice for the current page
  const start = (st.currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  st.filtered.slice(start, end).forEach(card => {
    card.style.display = 'block';
  });
}

/**
 * Enables or disables Prev/Next buttons based on page count.
 */
function updatePagination(sectionId) {
  const st = state[sectionId];
  const prevBtn = document.getElementById(`${sectionId}-prev`);
  const nextBtn = document.getElementById(`${sectionId}-next`);
  if (!st || !prevBtn || !nextBtn) return;

  const totalPages = Math.max(1, Math.ceil(st.filtered.length / itemsPerPage));
  prevBtn.disabled = st.currentPage <= 1;
  nextBtn.disabled = st.currentPage >= totalPages;
}

/**
 * Moves to the next page in a section.
 */
function nextPage(sectionId) {
  const st = state[sectionId];
  if (!st) return;
  const totalPages = Math.ceil(st.filtered.length / itemsPerPage);
  if (st.currentPage < totalPages) {
    st.currentPage++;
    showPage(sectionId);
    updatePagination(sectionId);
  }
}

/**
 * Moves to the previous page in a section.
 */
function prevPage(sectionId) {
  const st = state[sectionId];
  if (!st) return;
  if (st.currentPage > 1) {
    st.currentPage--;
    showPage(sectionId);
    updatePagination(sectionId);
  }
}

/**
 * Highlights the active filter button in a section.
 */
function highlightFilterButton(sectionId, category) {
  const btnContainer = document.getElementById(`${sectionId}-filters`);
  if (!btnContainer) return;
  btnContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const active = Array.from(btnContainer.querySelectorAll('.filter-btn'))
    .find(btn => btn.getAttribute('onclick')?.includes(`'${category}'`));
  if (active) active.classList.add('active');
}

// -------------------------
// Lazy Loading Images
// -------------------------
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        obs.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => observer.observe(img));
}

// -------------------------
// Hero Carousel
// -------------------------
const carouselImages = [
  'images/karusel/1.jpg','images/karusel/2.jpg','images/karusel/3.jpg',
  'images/karusel/4.jpg','images/karusel/5.jpg','images/karusel/6.jpg',
  'images/karusel/7.jpg','images/karusel/8.jpg','images/karusel/9.jpg',
  'images/karusel/10.jpg'
];
let carouselIndex = 0;
function rotateCarousel() {
  const img = document.getElementById('carouselImage');
  if (!img) return;
  carouselIndex = (carouselIndex + 1) % carouselImages.length;
  img.classList.add('fade-out');
  setTimeout(() => {
    img.src = carouselImages[carouselIndex];
    img.classList.remove('fade-out');
  }, 400);
}

// -------------------------
// Advanced Gallery
// -------------------------
function changeMainImage(thumbnail) {
  const main = document.getElementById('mainImage');
  if (!main) return;
  main.classList.add('fade-out');
  setTimeout(() => {
    main.src = thumbnail.src;
    main.classList.remove('fade-out');
  }, 300);
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumbnail.classList.add('active');
}

// -------------------------
// Scroll Spy for Active Nav
// -------------------------
function initScrollSpy() {
  window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('main section[id]').forEach(sec => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) current = sec.id;
    });
    document.querySelectorAll('.side-nav a').forEach(link => {
      link.classList.toggle('active-nav', link.getAttribute('href') === `#${current}`);
    });
  });
}

// -------------------------
// Initialization on DOM Ready
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize filters + pagination for each section that has filters
  document.querySelectorAll('[id$="-filters"]').forEach(container => {
    const sectionId = container.id.replace('-filters', '');
    filterSection(sectionId, 'all');
  });

  initLazyLoading();
  setInterval(rotateCarousel, 4000);
  initScrollSpy();
});

// grab the elements
const hamburger = document.querySelector('.hamburger');
const sidebar   = document.querySelector('.sidebar');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});