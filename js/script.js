/**
 * DryLeaf Technologies - Main JavaScript File
 * Handles Navbar scroll, mobile navigation drawer, scroll reveal, 
 * interactive service detail modals, and inquiry dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initStickyHeader();
  initMobileNavigation();
  initActiveNavLink();
  initScrollReveal();
  initServiceModals();
  initGetStartedModal();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Sticky Header Scroll Effect
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer & Backdrop
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.hamburger-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu || !backdrop) return;

  const openMenu = () => {
    toggleBtn.classList.add('active');
    navMenu.classList.add('active');
    backdrop.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    toggleBtn.classList.remove('active');
    navMenu.classList.remove('active');
    backdrop.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Active Navigation Link Highlighting
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else if (linkHref.startsWith('#') && (currentPath === 'index.html' || currentPath === '')) {
      // Intersection Observer for in-page anchors on homepage
      setupAnchorObserver(link, linkHref);
    } else {
      link.classList.remove('active');
    }
  });
}

function setupAnchorObserver(link, anchorId) {
  const targetSection = document.querySelector(anchorId);
  if (!targetSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  observer.observe(targetSection);
}

/* --------------------------------------------------------------------------
   4. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   5. Interactive Service Detail Modal System
   -------------------------------------------------------------------------- */
const serviceData = {
  'web-dev': {
    title: 'Web Development',
    subtitle: 'Modern, responsive websites engineered for speed and user engagement.',
    desc: 'Our Web Development team crafts lightweight, ultra-responsive digital experiences built directly with clean HTML5, CSS3, and modern Vanilla JavaScript. We ensure fast load times, semantic SEO architecture, and effortless accessibility across mobile, tablet, and desktop viewports.',
    features: [
      'Responsive-by-Design Fluid Grid System',
      'SEO-Optimized Semantic HTML Architecture',
      'Ultra-Fast Loading & Zero Heavy Framework Overhead',
      'Custom Micro-Animations & Dynamic Scroll Effects',
      'Cross-Browser & Multi-Device Compatibility'
    ]
  },
  'ecommerce': {
    title: 'E-Commerce Development',
    subtitle: 'User-friendly online stores designed for smooth shopping experiences.',
    desc: 'DryLeaf Technologies builds seamless e-commerce interfaces designed around buyer psychology and frictionless checkout flows. From product catalog layout to responsive carts and clear calls-to-action, we empower online retailers to turn visits into customer loyalty.',
    features: [
      'Streamlined Product Catalog & Filtering UI',
      'Mobile-First Touch Friendly Shopping Experience',
      'Frictionless Cart & Checkout Micro-Interactions',
      'High-Converting Product Detail Layouts',
      'Performance Optimization for Fast Image Delivery'
    ]
  },
  'web-apps': {
    title: 'Custom Web Applications',
    subtitle: 'Purpose-built web applications designed around specific business needs.',
    desc: 'When standard templates fall short, we build custom web applications crafted precisely to meet your workflow operational needs. Our focus on clean frontend architecture ensures highly responsive data views, intuitive dashboards, and robust interactive elements.',
    features: [
      'Tailored Workflow & Interactive Dashboard UI',
      'Scalable Front-End Logic & State Handling',
      'Clean Component Architecture & Modularity',
      'Accessible Form Controls & Dynamic Inputs',
      'Cross-Platform Desktop & Tablet Responsiveness'
    ]
  },
  'ui-ux': {
    title: 'UI/UX Design',
    subtitle: 'Clean, intuitive interfaces focused on usability, clarity and aesthetics.',
    desc: 'Great technology relies on user clarity. Our UI/UX design philosophy blends human-centered interface design with modern visual elegance—combining crisp contrast, generous whitespace, harmonious typography, and meaningful micro-interactions.',
    features: [
      'User Journey Mapping & Architecture Wireframing',
      'High-Fidelity Visual Design Systems & Tokens',
      'Interactive Design Prototypes & Micro-Animations',
      'Accessibility Contrast & WCAG Compliance Check',
      'Responsive Mobile & Desktop Layout Adaptations'
    ]
  }
};

function initServiceModals() {
  const modalOverlay = document.getElementById('service-modal');
  if (!modalOverlay) return;

  const modalTitle = modalOverlay.querySelector('.modal-service-title');
  const modalSubtitle = modalOverlay.querySelector('.modal-service-subtitle');
  const modalDesc = modalOverlay.querySelector('.modal-service-desc');
  const modalFeatures = modalOverlay.querySelector('.modal-service-features');
  const closeBtn = modalOverlay.querySelector('.modal-close-btn');

  const openServiceModal = (serviceId) => {
    const data = serviceData[serviceId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalDesc.textContent = data.desc;

    modalFeatures.innerHTML = data.features
      .map(feat => `
        <div class="feature-item">
          <div class="feature-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span>${feat}</span>
        </div>
      `).join('');

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeServiceModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Bind click triggers on service cards
  document.querySelectorAll('[data-service-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      const serviceId = card.getAttribute('data-service-id');
      openServiceModal(serviceId);
    });
  });

  closeBtn?.addEventListener('click', closeServiceModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeServiceModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeServiceModal();
    }
  });

  // Delegate "Get Started with this Service" button inside modal
  const modalCta = modalOverlay.querySelector('.modal-cta-btn');
  modalCta?.addEventListener('click', () => {
    closeServiceModal();
    openGetStartedModal();
  });
}

/* --------------------------------------------------------------------------
   6. "Get Started" Project Inquiry Modal Dialog
   -------------------------------------------------------------------------- */
function initGetStartedModal() {
  const getStartedModal = document.getElementById('contact-modal');
  if (!getStartedModal) return;

  const closeBtn = getStartedModal.querySelector('.modal-close-btn');
  const contactForm = getStartedModal.querySelector('#project-inquiry-form');
  const successMsg = getStartedModal.querySelector('.form-success-msg');

  window.openGetStartedModal = () => {
    getStartedModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeGetStartedModal = () => {
    getStartedModal.classList.remove('active');
    document.body.style.overflow = '';
    if (contactForm) {
      contactForm.reset();
      contactForm.style.display = 'block';
    }
    if (successMsg) {
      successMsg.style.display = 'none';
    }
  };

  // Attach click listener to all "GET STARTED" buttons across the site
  document.querySelectorAll('.open-get-started').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openGetStartedModal();
    });
  });

  closeBtn?.addEventListener('click', closeGetStartedModal);
  getStartedModal.addEventListener('click', (e) => {
    if (e.target === getStartedModal) closeGetStartedModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getStartedModal.classList.contains('active')) {
      closeGetStartedModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate accessible form submission
      contactForm.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      setTimeout(() => {
        closeGetStartedModal();
      }, 2500);
    });
  }
}

/* --------------------------------------------------------------------------
   7. Back-to-Top Button Handler
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
