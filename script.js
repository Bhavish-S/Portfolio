// ==========================================================================
// PORTFOLIO — MAXIMAL INTERACTIONS
// Phases 3, 4, 5, 7 — Motion, Hover, Visual, Advanced Effects
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // ========================================================================
  // PHASE 3 — SCROLL PROGRESS BAR
  // ========================================================================
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      scrollProgress.style.width = Math.min((scrollPx / winHeightPx) * 100, 100) + '%';
    }, { passive: true });
  }

  // ========================================================================
  // PHASE 3 — INTERSECTION OBSERVER SCROLL REVEAL (staggered)
  // ========================================================================
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger children within the same parent
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.querySelectorAll('.reveal'));
          const index = siblings.indexOf(entry.target);
          const delay = index * 60; // 60ms stagger
          entry.target.style.transitionDelay = delay + 'ms';
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Reduced motion: show everything immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('revealed');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ========================================================================
  // PHASE 3 — ABOUT PORTRAIT PARALLAX
  // ========================================================================
  if (!prefersReducedMotion && !isTouch) {
    const aboutPortrait = document.getElementById('about-portrait');
    if (aboutPortrait) {
      window.addEventListener('scroll', () => {
        const rect = aboutPortrait.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        if (rect.top < viewHeight && rect.bottom > 0) {
          const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
          const offset = (progress - 0.5) * 60; // ~0.5x parallax
          aboutPortrait.style.transform = `translateY(${offset}px)`;
        }
      }, { passive: true });
    }
  }

  // ========================================================================
  // PHASE 3 — TIMELINE PROGRESS LINE
  // ========================================================================
  if (!prefersReducedMotion) {
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    timelineNodes.forEach(node => timelineObserver.observe(node));

    // Animate progress line height based on scroll
    const timelineCols = document.querySelectorAll('.timeline-col');
    window.addEventListener('scroll', () => {
      timelineCols.forEach(col => {
        const progressEl = col.querySelector('.timeline-progress');
        if (!progressEl) return;
        const rect = col.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        if (rect.top < viewHeight && rect.bottom > 0) {
          const progress = Math.min(Math.max((viewHeight - rect.top) / rect.height, 0), 1);
          progressEl.style.height = (progress * 100) + '%';
        }
      });
    }, { passive: true });
  }

  // ========================================================================
  // PHASE 3 — SMOOTH SCROLLING (vanilla inertia)
  // ========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetY = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  // ========================================================================
  // PHASE 4 — MAGNETIC BUTTON PULL (desktop only)
  // ========================================================================
  if (!isTouch) {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ========================================================================
  // PHASE 4 — CLICK RIPPLE ON BUTTONS
  // ========================================================================
  document.querySelectorAll('.brutal-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Remove existing ripples
      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ========================================================================
  // PHASE 4 — BUTTON PRESS STATES
  // ========================================================================
  const brutalBtns = document.querySelectorAll('.brutal-btn, .brutal-link');
  brutalBtns.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'translate(4px, 4px)';
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

  // ========================================================================
  // PHASE 4 — CUSTOM CROSSHAIR CURSOR (desktop only)
  // ========================================================================
  if (!isTouch && !prefersReducedMotion) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      let cursorX = 0, cursorY = 0;
      let currentX = 0, currentY = 0;

      document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (!cursor.classList.contains('visible')) {
          cursor.classList.add('visible');
        }
      });

      document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
      });

      // Smooth follow with lerp
      function animateCursor() {
        currentX += (cursorX - currentX) * 0.15;
        currentY += (cursorY - currentY) * 0.15;
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      // Scale up on hover over interactive elements
      const interactives = document.querySelectorAll('a, button, input, textarea, .brutal-btn, .brutal-card, .project-card, .hover-push');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    }
  }

  // ========================================================================
  // PHASE 4 — CONTACT FORM SUBMIT ANIMATION
  // ========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading state
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const actionUrl = contactForm.getAttribute('action');

      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success
          submitBtn.classList.remove('btn-loading');
          contactForm.style.display = 'none';
          formSuccess.classList.add('active');
          contactForm.reset();
        } else {
          // Error handling
          alert('Oops! There was a problem submitting your form.');
          submitBtn.classList.remove('btn-loading');
          submitBtn.disabled = false;
        }
      } catch (error) {
        alert('Oops! There was a problem submitting your form.');
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
      }
    });
  }

  // ========================================================================
  // PHASE 5 — SMART NAV ON SCROLL
  // ========================================================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

  if (navbar) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // If scrolled down past 100px, hide the navbar
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        navbar.style.transform = 'translateY(-100%)';
      } 
      // If scrolling up, or at the very top, show the navbar
      else {
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ========================================================================
  // PHASE 6 — LIGHTBOX
  // ========================================================================
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Open lightbox on image click
    document.querySelectorAll('[data-lightbox]').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ========================================================================
  // PHASE 7 — TYPEWRITER EFFECT (hero bio, fires once)
  // ========================================================================
  if (!prefersReducedMotion) {
    const typewriterEl = document.getElementById('hero-typewriter');
    if (typewriterEl) {
      const fullText = typewriterEl.textContent.trim();
      typewriterEl.textContent = '';

      let charIndex = 0;
      let lastTime = 0;
      const charDelay = 18; // ms per character

      // Web Audio API for synthetic terminal typing sound
      let audioCtx = null;
      function playTypeSound() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state !== 'running') return; // Blocked by autoplay policy

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        // Mechanical "clack" sound profile (rapid frequency drop for percussive strike)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.015);
        
        // Very fast envelope for a crisp strike
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.015);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.02);
      }

      // Resume audio context on first click if they interact while typing
      document.addEventListener('click', () => {
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }, { once: true });

      function typeStep(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;

        if (elapsed >= charDelay && charIndex < fullText.length) {
          const char = fullText.charAt(charIndex);
          typewriterEl.textContent += char;
          
          // Play sound perfectly synced to every character
          if (char !== ' ') {
            playTypeSound();
          }

          charIndex++;
          lastTime = timestamp;
        }

        if (charIndex < fullText.length) {
          requestAnimationFrame(typeStep);
        } else {
          // Typing complete — remove cursor after a beat
          setTimeout(() => {
            typewriterEl.classList.add('done');
          }, 1200);
        }
      }

      // Start after a short delay
      setTimeout(() => requestAnimationFrame(typeStep), 600);
    }
  }

  // ========================================================================
  // PHASE 7 — CANVAS PARTICLE FIELD (hero background, desktop only)
  // ========================================================================
  if (!prefersReducedMotion && !isTouch) {
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let mouseX = -1000, mouseY = -1000;
      const PARTICLE_COUNT = 50;
      const CONNECTION_DISTANCE = 120;
      const MOUSE_RADIUS = 150;

      function resizeCanvas() {
        const hero = document.getElementById('hero');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = hero.offsetWidth * dpr;
        canvas.height = hero.offsetHeight * dpr;
        canvas.style.width = hero.offsetWidth + 'px';
        canvas.style.height = hero.offsetHeight + 'px';
        ctx.scale(dpr, dpr);
      }

      function createParticles() {
        particles = [];
        const hero = document.getElementById('hero');
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * hero.offsetWidth,
            y: Math.random() * hero.offsetHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1
          });
        }
      }

      function drawParticles() {
        const hero = document.getElementById('hero');
        const w = hero.offsetWidth;
        const h = hero.offsetHeight;
        ctx.clearRect(0, 0, w, h);

        // Update and draw particles
        particles.forEach((p, i) => {
          // Cursor reactivity
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.vx -= (dx / dist) * force * 0.02;
            p.vy -= (dy / dist) * force * 0.02;
          }

          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Dampen
          p.vx *= 0.999;
          p.vy *= 0.999;

          // Bounce off edges
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x));
          p.y = Math.max(0, Math.min(h, p.y));

          // Draw dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(26, 29, 32, 0.15)';
          ctx.fill();

          // Draw connecting lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const lineDx = p.x - p2.x;
            const lineDy = p.y - p2.y;
            const lineDist = Math.sqrt(lineDx * lineDx + lineDy * lineDy);
            if (lineDist < CONNECTION_DISTANCE) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(26, 29, 32, ${0.08 * (1 - lineDist / CONNECTION_DISTANCE)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });

        requestAnimationFrame(drawParticles);
      }

      // Track mouse within hero
      const heroEl = document.getElementById('hero');
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      heroEl.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
      });

      resizeCanvas();
      createParticles();
      drawParticles();

      window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
      });
    }
  }
});
