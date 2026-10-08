/**
 * SAKSHI KUMARI PORTFOLIO - SCRIPT
 * High performance animations, interactive canvas, and responsive UX
 */

document.addEventListener('DOMContentLoaded', () => {

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. Interactive Background Canvas Animation (Constellation Network)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = Math.min(window.innerWidth < 768 ? 35 : 75, 90);
    const mouse = { x: null, y: null, radius: 140 };

    // Resize handler
    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle constructor
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.colorAlpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Subtle mouse push effect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        const isDark = document.body.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(165, 180, 252, ${this.colorAlpha})`
          : `rgba(99, 102, 241, ${this.colorAlpha * 0.8})`;
        ctx.fill();
      }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.body.getAttribute('data-theme') !== 'light';
      const lineColor = isDark ? '99, 102, 241' : '129, 140, 248';

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (distance < maxDist) {
            const opacity = (1 - distance / maxDist) * (isDark ? 0.22 : 0.15);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw each particle
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* --------------------------------------------------------------------------
     2. Navbar Scrolled State & ScrollSpy
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // Toggle scrolled styling
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link update
    const scrollPos = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer Toggle
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close when clicking nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Theme Switcher (Dark / Light Mode)
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('sakshi_portfolio_theme') || 'dark';

  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sakshi_portfolio_theme', nextTheme);
    });
  }

  /* --------------------------------------------------------------------------
     5. Scroll Reveal Animations (Intersection Observer)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback for browsers without observer
    revealElements.forEach((el) => el.classList.add('active'));
  }

  /* --------------------------------------------------------------------------
     6. Interactive C Code Simulation Runner
     -------------------------------------------------------------------------- */
  const runSimBtn = document.getElementById('run-sim-btn');
  const simOutput = document.getElementById('sim-output');

  if (runSimBtn && simOutput) {
    let isRunning = false;

    runSimBtn.addEventListener('click', () => {
      if (isRunning) return;
      isRunning = true;
      runSimBtn.disabled = true;
      runSimBtn.innerHTML = '<span class="status-dot-pulse"></span> Compiling...';

      simOutput.innerHTML = '<span style="color:#64748b">&gt; gcc sakshi_code.c -o output</span><br><span style="color:#f59e0b">&gt; Compiling source code...</span>';

      setTimeout(() => {
        simOutput.innerHTML = `
          <span style="color:#64748b">&gt; gcc sakshi_code.c -o output [OK]</span><br>
          <span style="color:#38bdf8">&gt; ./output</span><br>
          <span style="color:#10b981; font-weight: 700;">&gt; Sakshi is compiling: Curiosity + Consistency = Growth!</span><br>
          <span style="color:#a855f7; font-size: 0.75rem;">&gt; Process exited with code 0 (Execution successful &bull; Learning continuous)</span>
        `;
        runSimBtn.disabled = false;
        runSimBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Run Again';
        if (window.lucide) window.lucide.createIcons();
        isRunning = false;
      }, 900);
    });
  }

  /* --------------------------------------------------------------------------
     7. Copy Email to Clipboard with Toast Notification
     -------------------------------------------------------------------------- */
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');
  const copyToast = document.getElementById('copy-toast');

  if (copyBtn && emailText && copyToast) {
    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard
        .writeText(email)
        .then(() => {
          copyToast.classList.add('show');
          setTimeout(() => {
            copyToast.classList.remove('show');
          }, 3200);
        })
        .catch(() => {
          // Fallback if clipboard API restricted
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);

          copyToast.classList.add('show');
          setTimeout(() => {
            copyToast.classList.remove('show');
          }, 3200);
        });
    });
  }

  /* --------------------------------------------------------------------------
     8. Contact Form Live Validation & User Feedback
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#user-name').value.trim();
      const email = contactForm.querySelector('#user-email').value.trim();
      const subject = contactForm.querySelector('#user-subject').value.trim();
      const message = contactForm.querySelector('#user-message').value.trim();

      // Simple validation
      if (!name || !email || !subject || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all the fields before sending.';
        return;
      }

      // Email format regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please provide a valid email address.';
        return;
      }

      const submitBtn = contactForm.querySelector('#submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span>';

      // Simulate sending feedback
      setTimeout(() => {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `<strong>Thank you, ${name}!</strong> Your message has been received. Sakshi will get back to you soon.`;
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();

        // Auto hide success note after 6 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 6000);
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------------
     9. Interactive Tilt Effect on Cards (Gentle 3D Feel on Desktop)
     -------------------------------------------------------------------------- */
  if (window.innerWidth > 992) {
    const cards = document.querySelectorAll('.hero-feature-card, .interest-card, .book-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

});
