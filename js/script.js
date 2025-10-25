/* =========================
   Smooth scrolling
========================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

/* =========================
   Theme toggle + persistence
========================= */
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '☀️';
}
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* =========================
   Name preference (localStorage)
========================= */
const greetName = document.getElementById('greet-name');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name');
const clearNameBtn = document.getElementById('clear-name');
const setNameTopBtn = document.getElementById('set-name');
const nameFeedback = document.getElementById('name-feedback');

function applyName(n) {
  greetName.textContent = n && n.trim() ? n.trim() : 'there';
}

applyName(localStorage.getItem('username') || '');

saveNameBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  localStorage.setItem('username', val);
  applyName(val);
  nameFeedback.textContent = val ? 'Saved!' : 'Name cleared.';
  setTimeout(() => (nameFeedback.textContent = ''), 1500);
});

clearNameBtn.addEventListener('click', () => {
  localStorage.removeItem('username');
  nameInput.value = '';
  applyName('');
  nameFeedback.textContent = 'Cleared.';
  setTimeout(() => (nameFeedback.textContent = ''), 1200);
});

// Quick focus via top button
setNameTopBtn.addEventListener('click', () => nameInput?.focus());

/* =========================
   Fun Fact API (with loading, error, retry)
========================= */
const factBtn = document.getElementById('fact-btn');
const factState = document.getElementById('fact-state');

async function loadFact() {
  factState.textContent = 'Loading…';
  try {
    // You can swap to any public API; Quotable is simple and reliable
    const res = await fetch('https://api.quotable.io/random', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch fact');
    const data = await res.json();
    factState.textContent = `“${data.content}” — ${data.author}`;
  } catch (err) {
    factState.innerHTML = `Couldn’t load a fact. <button id="retry-fact" class="linklike">Retry</button>`;
    document.getElementById('retry-fact')?.addEventListener('click', loadFact);
  }
}
factBtn.addEventListener('click', loadFact);

/* =========================
   Projects: filter + live search + collapsible
========================= */
const chips = document.querySelectorAll('.chip');
const searchInput = document.getElementById('project-search');
const cards = Array.from(document.querySelectorAll('.project-card'));
const emptyState = document.getElementById('empty-state');

function applyFilters() {
  const activeChip = document.querySelector('.chip.active');
  const filter = activeChip ? activeChip.dataset.filter : 'all';
  const query = (searchInput.value || '').toLowerCase();

  let visibleCount = 0;
  cards.forEach(card => {
    const cat = card.dataset.category;
    const text = card.textContent.toLowerCase();
    const matchesFilter = filter === 'all' || cat === filter;
    const matchesQuery = !query || text.includes(query);

    const show = matchesFilter && matchesQuery;
    card.style.display = show ? '' : 'none';
    if (show) visibleCount += 1;
  });

  emptyState.classList.toggle('hidden', visibleCount > 0);
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyFilters();
  });
});
searchInput.addEventListener('input', applyFilters);

// Collapsible details
document.querySelectorAll('.project-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
  });
});

// Initial filter state
applyFilters();

/* =========================
   Form validation + feedback
========================= */
const form = document.getElementById('contact-form');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const messageField = document.getElementById('message');
const nameErr = document.getElementById('name-error');
const emailErr = document.getElementById('email-error');
const messageErr = document.getElementById('message-error');
const formStatus = document.getElementById('form-status');

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;

  // Name
  if (!nameField.value.trim()) {
    nameErr.textContent = 'Please enter your name.';
    ok = false;
  } else nameErr.textContent = '';

  // Email
  if (!validateEmail(emailField.value.trim())) {
    emailErr.textContent = 'Please enter a valid email address.';
    ok = false;
  } else emailErr.textContent = '';

  // Message
  if (!messageField.value.trim()) {
    messageErr.textContent = 'Please enter a message.';
    ok = false;
  } else messageErr.textContent = '';

  if (!ok) {
    formStatus.textContent = '';
    return;
  }

  // Simulated success (no backend)
  formStatus.textContent = 'Sending…';
  setTimeout(() => {
    formStatus.textContent = '✅ Message sent (demo). Thanks!';
    form.reset();
  }, 700);
});

/* =========================
   Reveal on scroll (IntersectionObserver)
========================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
