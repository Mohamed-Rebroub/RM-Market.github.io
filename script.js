/* ═══════════════════════════════════════════════════════════════
   RM MARKET — script.js
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ── Custom Cursor ─────────────────────────────────────────── */
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;
let rafId;

if (cursorDot && cursorRing) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets =
    "a, button, .product-card, .cat-card, .feature-card, .filter-btn";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });
}

/* ── Navbar Scroll ─────────────────────────────────────────── */
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  lastScroll = currentScroll;
});

/* ── Active Nav Link ────────────────────────────────────────── */
const sections = document.querySelectorAll("section[id], footer[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  { threshold: 0.35 },
);

sections.forEach((s) => sectionObserver.observe(s));

/* ── Hamburger Menu ─────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const navLinksEl = document.getElementById("navLinks");

hamburger &&
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinksEl.classList.toggle("open");
    document.body.style.overflow = navLinksEl.classList.contains("open")
      ? "hidden"
      : "";
  });

navLinksEl &&
  navLinksEl.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinksEl.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

/* ── Scroll Reveal ─────────────────────────────────────────── */
const revealEls = document.querySelectorAll(".scroll-reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add("visible");
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

// stagger siblings
const revealGroups = {};
revealEls.forEach((el) => {
  const parent = el.parentElement;
  const key = parent ? parent.className : "root";
  revealGroups[key] = revealGroups[key] || [];
  revealGroups[key].push(el);
});

Object.values(revealGroups).forEach((group) => {
  group.forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
});

revealEls.forEach((el) => revealObserver.observe(el));

/* ── Hero Parallax ──────────────────────────────────────────── */
const heroContent = document.getElementById("heroContent");

document.addEventListener("mousemove", (e) => {
  if (!heroContent) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 12;
  heroContent.style.transform = `translate(${x}px, ${y}px)`;
});

/* ── Particles Canvas ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById("particlesCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H;
  const PARTICLE_COUNT = 60;
  const particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.5 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      this.hue = Math.random() * 20 + 35; // gold range
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      const progress = this.life / this.maxLife;
      if (progress < 0.2) {
        this.opacity = (progress / 0.2) * this.maxOpacity;
      } else if (progress > 0.7) {
        this.opacity = ((1 - progress) / 0.3) * this.maxOpacity;
      } else {
        this.opacity = this.maxOpacity;
      }
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
      ctx.fill();
      // glow
      ctx.shadowColor = `hsl(${this.hue}, 80%, 65%)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = ((100 - dist) / 100) * 0.06;
          ctx.strokeStyle = "#C9A84C";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Filter Tabs ────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    productCards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.style.transition = "opacity 0.3s, transform 0.3s";
      if (match) {
        card.style.opacity = "1";
        card.style.transform = "";
        card.style.pointerEvents = "";
      } else {
        card.style.opacity = "0.25";
        card.style.transform = "scale(0.96)";
        card.style.pointerEvents = "none";
      }
    });
  });
});

/* ── Cart ───────────────────────────────────────────────────── */
let cartCount = 0;
const cartCountEl = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
let toastTimer;

function updateCart(delta, name) {
  cartCount += delta;
  if (cartCount > 0) {
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.add("visible");
  } else {
    cartCountEl.classList.remove("visible");
  }
  showToast(`"${name}" added to cart`);
}

function showToast(msg) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    updateCart(1, name);

    // Ripple
    btn.style.transform = "scale(0.9)";
    setTimeout(() => (btn.style.transform = ""), 200);
  });
});

/* ── Testimonial Slider ─────────────────────────────────────── */
const track = document.getElementById("testimonialsTrack");
const dots = document.querySelectorAll(".testi-dot");
const prevBtn = document.getElementById("testiPrev");
const nextBtn = document.getElementById("testiNext");

if (track) {
  let current = 0;
  const total = track.children.length;
  let autoInterval;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  prevBtn &&
    prevBtn.addEventListener("click", () => {
      goTo(current - 1);
      resetAuto();
    });
  nextBtn &&
    nextBtn.addEventListener("click", () => {
      goTo(current + 1);
      resetAuto();
    });
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      goTo(i);
      resetAuto();
    }),
  );

  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }
  startAuto();

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener(
    "touchstart",
    (e) => (touchStartX = e.touches[0].clientX),
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });
}

/* ── Newsletter Form ────────────────────────────────────────── */
const newsletterForm = document.getElementById("newsletterForm");
newsletterForm &&
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector("input");
    const btn = newsletterForm.querySelector("button");
    btn.textContent = "Subscribed ✓";
    btn.style.background = "linear-gradient(135deg, #2d9a4a, #1e6b34)";
    input.value = "";
    input.disabled = true;
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Subscribe";
      btn.style.background = "";
      input.disabled = false;
      btn.disabled = false;
    }, 4000);
  });

/* ── Product Card 3D Tilt ───────────────────────────────────── */
productCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = dy * -6;
    const rotY = dx * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition =
      "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.5s, border-color 0.5s";
  });
  card.addEventListener("mouseenter", () => {
    card.style.transition = "box-shadow 0.3s, border-color 0.3s";
  });
});

/* ── Smooth Anchor Scroll ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ── Category Card Hover Sound / Ripple ─────────────────────── */
document.querySelectorAll(".cat-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(201,168,76,0.12);
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top - size / 2}px;
      transform: scale(0);
      animation: rippleEffect 0.7s ease-out forwards;
      pointer-events: none; z-index: 0;
    `;
    card.style.position = "relative";
    card.style.overflow = "hidden";
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe
const style = document.createElement("style");
style.textContent = `
  @keyframes rippleEffect {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ── Navbar logo letter animation ───────────────────────────── */
const logoRm = document.querySelector(".logo-rm");
if (logoRm) {
  logoRm.addEventListener("mouseenter", () => {
    logoRm.style.letterSpacing = "0.15em";
    logoRm.style.transition = "letter-spacing 0.3s ease";
  });
  logoRm.addEventListener("mouseleave", () => {
    logoRm.style.letterSpacing = "0.06em";
  });
}

/* ── Watch hands real time ──────────────────────────────────── */
function setWatchTime() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourDeg = h * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;

  document.querySelectorAll(".hour-hand").forEach((el) => {
    el.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  });
  document.querySelectorAll(".minute-hand").forEach((el) => {
    el.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    el.style.animation = "none";
  });
}
setWatchTime();
setInterval(setWatchTime, 1000);

/* ── Feature cards stagger on entry ─────────────────────────── */
document.querySelectorAll(".feature-card").forEach((card, i) => {
  card.style.transitionDelay = i * 0.08 + "s";
});

/* ── Number counter animation ───────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const startTime = performance.now();
  const isPercent = el.textContent.includes("%");
  const hasPlus = el.textContent.includes("+");
  const suffix = isPercent ? "%" : hasPlus ? "+" : "";

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * target);
    el.textContent =
      (value >= 1000 ? Math.floor(value / 1000) + "K" : value) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      statsObserver.unobserve(entry.target);
      entry.target.querySelectorAll(".stat-num").forEach((el) => {
        const text = el.textContent.replace(/[K+%]/g, "");
        let target = parseFloat(text);
        if (el.textContent.includes("K")) target *= 1000;
        animateCounter(el, target);
      });
    });
  },
  { threshold: 0.8 },
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) statsObserver.observe(heroStats);

/* ── Page Load ──────────────────────────────────────────────── */
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.4s ease";
  requestAnimationFrame(() => {
    document.body.style.opacity = "1";
  });
});
