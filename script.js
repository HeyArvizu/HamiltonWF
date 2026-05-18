/* ═══════════════════════════════════════════════════════════
   HAMILTON WF — script.js
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV — scroll state ── */
  const nav = document.getElementById('nav');
  const isInnerPage = document.body.classList.contains('inner-page');
  const onScroll = () => {
    nav.classList.toggle('scrolled', isInnerPage || window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. NAV — mobile toggle ── */
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    mobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobile.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* ── 3. SCROLL REVEAL (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = getComputedStyle(entry.target).getPropertyValue('--d') || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 4. HERO PARALLAX ── */
  const heroBg = document.querySelector('.hero-bg');
  const tecBg  = document.querySelector('.tec-bg');
  const innovBg = document.querySelector('.innov-hero-bg');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroBg) {
      heroBg.style.transform = `scale(1.06) translateY(${sy * 0.18}px)`;
    }
    if (tecBg) {
      const rect = tecBg.parentElement.getBoundingClientRect();
      const offset = -rect.top * 0.12;
      tecBg.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
    if (innovBg) {
      const rect = innovBg.parentElement.getBoundingClientRect();
      const offset = -rect.top * 0.1;
      innovBg.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
  }, { passive: true });

  /* ── 5. PRODUCTS — tab switching ── */
  const prodTabs   = document.querySelectorAll('.prod-tab');
  const prodImages = document.querySelectorAll('.prod-img');

  prodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.prod;
      prodTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      prodImages.forEach(img => img.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(`pv-${key}`);
      if (target) target.classList.add('active');
    });
  });

  /* ── 6. COUNTER ANIMATION (tecnología stats) ── */
  const counters = document.querySelectorAll('.stat-n[data-target]');
  let countersStarted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.5 });

  const tecSection = document.querySelector('.tecnologia');
  if (tecSection) countObserver.observe(tecSection);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    const easeOut  = t => 1 - Math.pow(1 - t, 3);
    const update   = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  /* ── 7. CONTACT FORM ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'rgba(255,255,255,0.8)';
          setTimeout(() => field.style.borderColor = '', 2000);
        }
      });
      if (!valid) return;
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        success.classList.add('visible');
      }, 1200);
    });
  }

  /* ── 8. SMOOTH SCROLL for nav anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── 8b. HERO SCROLL HINT — click scrolls to #nosotros ── */
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const target = document.getElementById('nosotros');
      if (!target) return;
      const navH = nav ? nav.offsetHeight : 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  /* ── 9. ACTIVE NAV LINK on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ── 10. LIGHTBOX ── */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  if (lightbox && lightboxImg) {
    const galleryItems = [...document.querySelectorAll('[data-lightbox]')];
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const item = galleryItems[index];
      lightboxImg.src = item.dataset.lightbox;
      lightboxImg.alt = item.dataset.alt || '';
      lightboxImg.style.opacity = '1';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      updateCounter();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 400);
    }

    function navigate(direction) {
      currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = galleryItems[currentIndex].dataset.lightbox;
        lightboxImg.style.opacity = '1';
        updateCounter();
      }, 220);
    }

    function updateCounter() {
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
      }
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev)  lightboxPrev.addEventListener('click', () => navigate(-1));
    if (lightboxNext)  lightboxNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'ArrowRight')  navigate(1);
    });
  }

  /* ── 11. LIFESTYLE TRACK — drag to scroll ── */
  const track = document.querySelector('.prod-lifestyle-track');
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', e => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup',   () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* ── 12. PRODUCTS PAGE NAV — active on scroll ── */
  const prodPageSections = document.querySelectorAll('.prod-feature[id]');
  const prodNavLinks     = document.querySelectorAll('.prod-page-nav-link');
  if (prodPageSections.length && prodNavLinks.length) {
    const prodSectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          prodNavLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4 });
    prodPageSections.forEach(s => prodSectionObs.observe(s));
  }

  /* ── 13. PRODUCT MODAL ── */
  const productData = {
    roller: {
      num: '01',
      title: 'Roller',
      img: 'Fotos/curtain-with-sunlight.jpg',
      desc: 'Elegancia minimalista con tela de alta precisión. Control total de la luz con movimiento completamente silencioso. Diseñadas para espacios que valoran la limpieza visual y la funcionalidad premium.',
      features: ['Control total de iluminación', 'Movimiento silencioso y preciso', 'Telas técnicas y decorativas', 'Sistemas manuales y motorizados'],
      benefits: [{ label: 'Material', val: 'Tela técnica premium' }, { label: 'Operación', val: 'Manual / Motorizado' }, { label: 'Acabado', val: 'Minimalista' }, { label: 'Aplicación', val: 'Residencial & Comercial' }],
      link: 'roller.html'
    },
    double: {
      num: '02',
      title: 'Double Roller',
      img: 'Fotos/WhatsApp Image 2025-03-03 at 10.16.40 (1).jpeg',
      desc: 'Sistema dual de telas que combina transparencia y oscurecimiento en una sola solución. Permite transitar entre privacidad y luminosidad con un solo movimiento elegante.',
      features: ['Doble capa de tela integrada', 'Control graduado de la luz', 'Privacidad sin oscurecer totalmente', 'Diseño de alta sofisticación'],
      benefits: [{ label: 'Sistema', val: 'Dual layer' }, { label: 'Control', val: 'Gradual e independiente' }, { label: 'Estilo', val: 'Contemporáneo' }, { label: 'Instalación', val: 'A medida' }],
      link: 'double-roller.html'
    },
    cortinas: {
      num: '03',
      title: 'Cortinas',
      img: 'Fotos/WhatsApp Image 2025-03-03 at 10.16.40 (3).jpeg',
      desc: 'Diseños a medida que enmarcan cualquier espacio con suavidad, textura y carácter. Desde lino natural hasta terciopelo premium, cada cortina es una expresión de estilo personal.',
      features: ['Diseño completamente a medida', 'Amplio catálogo de telas', 'Instalación profesional', 'Personalización total de detalles'],
      benefits: [{ label: 'Telas', val: 'Lino, seda, terciopelo' }, { label: 'Confección', val: 'A medida' }, { label: 'Pliegues', val: 'Múltiples estilos' }, { label: 'Herrajes', val: 'Premium importados' }],
      link: 'cortinas.html'
    },
    toldos: {
      num: '04',
      title: 'Toldos',
      img: 'Fotos/WhatsApp Image 2025-03-14 at 21.19.42.jpeg',
      desc: 'Protección solar exterior de alto rendimiento, diseñada para durar y destacar. Sistemas que combinan funcionalidad extrema con una estética arquitectónica sofisticada.',
      features: ['Protección UV de alta eficiencia', 'Estructuras de aluminio premium', 'Telas técnicas de exterior', 'Sistemas manuales y motorizados'],
      benefits: [{ label: 'Protección', val: 'UV 95-98%' }, { label: 'Estructura', val: 'Aluminio anodizado' }, { label: 'Tela', val: 'Acrílica técnica' }, { label: 'Durabilidad', val: '10+ años' }],
      link: 'toldos.html'
    },
    maderas: {
      num: '05',
      title: 'Maderas',
      img: 'Fotos/WhatsApp Image 2025-03-03 at 10.16.40 (5).jpeg',
      desc: 'La calidez natural de la madera en persianas y celosías que transforman la atmósfera de cualquier espacio. Materiales seleccionados que combinan estética y durabilidad excepcionales.',
      features: ['Maderas seleccionadas premium', 'Acabados naturales y lacados', 'Lamas orientables de precisión', 'Tratamiento anti-humedad'],
      benefits: [{ label: 'Material', val: 'Madera natural / PVC madera' }, { label: 'Acabado', val: 'Natural / Lacado' }, { label: 'Lamas', val: '25mm / 50mm' }, { label: 'Ambiente', val: 'Interior premium' }],
      link: 'maderas.html'
    },
    auto: {
      num: '06',
      title: 'Automatización',
      img: 'Fotos/WhatsApp Image 2025-03-03 at 10.16.40 (6).jpeg',
      desc: 'Tecnología inteligente que integra control remoto, sensores lumínicos y sistemas de domótica en cada instalación. El futuro de los espacios inteligentes, disponible hoy.',
      features: ['Motorización silenciosa premium', 'Control por voz y smartphone', 'Integración con domótica', 'Sensores de luz y viento'],
      benefits: [{ label: 'Control', val: 'App / Voz / Remoto' }, { label: 'Integración', val: 'KNX, Lutron, Alexa' }, { label: 'Motor', val: 'Somfy / Hamilton' }, { label: 'Programación', val: 'Horarios automáticos' }],
      link: 'automatizacion.html'
    }
  };

  const prodModal        = document.getElementById('prodModal');
  const prodModalClose   = document.getElementById('prodModalClose');
  const prodModalImg     = document.getElementById('prodModalImg');
  const prodModalNum     = document.getElementById('prodModalNum');
  const prodModalTitle   = document.getElementById('prodModalTitle');
  const prodModalDesc    = document.getElementById('prodModalDesc');
  const prodModalFeats   = document.getElementById('prodModalFeatures');
  const prodModalBens    = document.getElementById('prodModalBenefits');
  const prodModalCta     = document.getElementById('prodModalCta');

  function openProdModal(key) {
    const d = productData[key];
    if (!d || !prodModal) return;
    prodModalImg.src = d.img;
    prodModalImg.alt = d.title;
    prodModalNum.textContent = d.num + ' /';
    prodModalTitle.textContent = d.title;
    prodModalDesc.textContent = d.desc;
    prodModalFeats.innerHTML = d.features.map(f =>
      `<div class="prod-modal-feature-item"><span class="prod-modal-feature-dot"></span>${f}</div>`
    ).join('');
    prodModalBens.innerHTML = d.benefits.map(b =>
      `<div class="prod-modal-benefit"><span class="prod-modal-benefit-label">${b.label}</span><span class="prod-modal-benefit-val">${b.val}</span></div>`
    ).join('');
    prodModalCta.href = d.link;
    prodModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProdModal() {
    if (!prodModal) return;
    prodModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.prod-card[data-product]').forEach(card => {
    card.addEventListener('click', () => openProdModal(card.dataset.product));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProdModal(card.dataset.product); } });
  });

  if (prodModalClose) prodModalClose.addEventListener('click', closeProdModal);
  if (prodModal) {
    prodModal.addEventListener('click', e => { if (e.target === prodModal) closeProdModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && prodModal.classList.contains('active')) closeProdModal(); });
  }

  /* ── 14. DISTRIBUIDOR FORM ── */
  const df = document.getElementById('distForm');
  const ds = document.getElementById('distSuccess');
  if (df && ds) {
    df.addEventListener('submit', e => {
      e.preventDefault();
      const btn = df.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;
      setTimeout(() => { df.style.display = 'none'; ds.classList.add('visible'); }, 1200);
    });
  }

  /* ── 14. CONTACTO PAGE FORM ── */
  const cpf = document.getElementById('contactPageForm');
  const cps = document.getElementById('contactPageSuccess');
  if (cpf && cps) {
    cpf.addEventListener('submit', e => {
      e.preventDefault();
      const req = cpf.querySelectorAll('[required]');
      let ok = true;
      req.forEach(f => {
        if (!f.value.trim()) {
          ok = false;
          f.style.borderColor = 'var(--red)';
          setTimeout(() => f.style.borderColor = '', 2000);
        }
      });
      if (!ok) return;
      const btn = cpf.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;
      setTimeout(() => { cpf.style.display = 'none'; cps.classList.add('visible'); }, 1200);
    });
  }

  /* ── 15. INNOVACION FORM ── */
  const innForm  = document.getElementById('innovForm');
  const innSucc  = document.getElementById('innovSuccess');
  if (innForm && innSucc) {
    innForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = innForm.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;
      setTimeout(() => { innForm.style.display = 'none'; innSucc.classList.add('visible'); }, 1200);
    });
  }

});
