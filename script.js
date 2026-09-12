// Pure Neubrutalism Interactions

document.addEventListener('DOMContentLoaded', () => {
  // Stark Scroll Progress Bar
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollLen = Math.min((scrollPx / winHeightPx) * 100, 100);
      scrollProgress.style.width = scrollLen + '%';
    });
  }

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Force hard hover state cleanup just in case
  const brutalBtns = document.querySelectorAll('.brutal-btn, .brutal-link');
  brutalBtns.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'translate(6px, 6px)';
      btn.style.boxShadow = '0px 0px 0px var(--c-black)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });
  });
});
