// Simple active nav on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['experience', 'education', 'impact', 'contact'].map((id) =>
  document.getElementById(id)
);

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    if (section && window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.style.color =
      link.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
});
