/**
 * Adwin Thomas C - Portfolio Interactions
 * Clean, lightweight, and responsive
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Theme Switcher (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // 3. Mobile Drawer Navigation
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Scrollspy for Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // 5. Subtle Metric Counter on Viewport Scroll
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  const countUp = (counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const currentVal = easeProgress * target;

      counter.textContent = isDecimal 
        ? currentVal.toFixed(2) 
        : Math.floor(currentVal).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = isDecimal ? target.toFixed(2) : target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  const bannerWrap = document.querySelector('.metrics-banner-wrap');
  if (bannerWrap) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          counters.forEach(counter => countUp(counter));
          countersAnimated = true;
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(bannerWrap);
  }

  // 6. Skills Filtering & Search
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-group-card');
  const skillSearchInput = document.getElementById('skillSearchInput');

  let currentCategory = 'all';

  function filterSkills() {
    const query = skillSearchInput ? skillSearchInput.value.toLowerCase().trim() : '';

    skillCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesText = query === '' || cardText.includes(query);

      if (matchesCat && matchesText) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-filter');
      filterSkills();
    });
  });

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', filterSkills);
  }

  // 7. Project Details Modal (Clean & Realistic)
  const projectDetails = {
    'modal-hospital': {
      title: 'Real-Time Operations & Resource Management System',
      context: 'St. John’s Medical College & Hospital — In Active Production Use',
      overview: 'Developed a centralized operational monitoring system providing staff and administrators with a consolidated view of ongoing operations across 24 units, replacing fragmented ward-level logs.',
      points: [
        'Centralized status tracking for 24 concurrent live units, eliminating manual phone check-ins and paper whiteboards.',
        'Real-time bed availability monitoring by department and ward to improve admissions coordination.',
        'Currently deployed and in active daily production use by hospital administrators and surgical teams.'
      ],
      stack: ['Python', 'SQL', 'Plotly Dash', 'HIS Integration', 'Operational Analytics']
    },
    'modal-yolo': {
      title: 'Object Detection Using Deep Learning (YOLOv7)',
      context: 'Computer Vision Pipeline — Validated Prototype Stage',
      overview: 'Built an end-to-end multi-class object detection pipeline implementing the YOLOv7 architecture, covering dataset annotation, model training, evaluation, and inference.',
      points: [
        'Multi-class dataset preparation, bounding-box annotations, and image augmentation routines.',
        'Model training with anchor optimization, CIoU loss function, and learning rate scheduling in PyTorch.',
        'Evaluated mean Average Precision (mAP), confusion matrix, precision-recall curves, and real-time FPS throughput.'
      ],
      stack: ['Python', 'YOLOv7', 'PyTorch', 'OpenCV', 'Model Evaluation']
    },
    'modal-cancer': {
      title: 'Breast Cancer Clinical Data Repository',
      context: 'Division of Molecular Medicine, St. John’s Research Institute',
      overview: 'Designed and implemented a secure, relational clinical repository enabling structured storage, filtering, and retrieval of multi-dimensional clinical datasets.',
      points: [
        'Implemented Role-Based Access Controls (RBAC) to ensure compliance with sensitive data protection protocols.',
        'Normalized schema supporting clinical demographics, receptor markers, treatments, and follow-ups.',
        'Sub-second query filtering and automated data validation rules to eliminate record anomalies.'
      ],
      stack: ['Python', 'MySQL', 'Relational Schemas', 'RBAC Security', 'Data Validation']
    },
    'modal-iot': {
      title: 'IoT-Based Temperature Monitoring System',
      context: 'End-to-End Time-Series Telemetry & Alerting',
      overview: 'Engineered an end-to-end data pipeline to continuously collect, store, and visualize time-series sensor data with automated threshold-triggered alerts.',
      points: [
        'Real-time sensor telemetry ingestion with localized network caching to prevent packet dropouts.',
        'Threshold monitoring logic that generates immediate alerts upon temperature deviation.',
        'Interactive time-series dashboard for historical trend analysis and anomaly detection.'
      ],
      stack: ['Python', 'Time-Series DB', 'IoT Protocols', 'Dashboards', 'Event Alerts']
    }
  };

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const modalBtns = document.querySelectorAll('.project-modal-btn');

  function openModal(key) {
    const data = projectDetails[key];
    if (!data) return;

    modalBody.innerHTML = `
      <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--accent); margin-bottom: 6px;">${data.context}</div>
      <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main);">${data.title}</h3>
      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">${data.overview}</p>
      
      <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-main); margin-bottom: 8px;">Key Technical Highlights:</div>
      <ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
        ${data.points.map(p => `
          <li style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5; padding-left: 14px; position: relative;">
            <span style="position: absolute; left: 0; color: var(--accent);">•</span>${p}
          </li>
        `).join('')}
      </ul>

      <div style="font-size: 0.78rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;">Tech Stack:</div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${data.stack.map(s => `
          <span style="font-family: var(--font-mono); font-size: 0.76rem; background-color: var(--bg-subtle); color: var(--text-muted); padding: 2px 8px; border-radius: 4px;">${s}</span>
        `).join('')}
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-target');
      openModal(key);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // 8. Copy to Clipboard Utility & Toast
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy');
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        showToast(`Copied ${val}`);
      }).catch(() => {
        showToast(`Copied ${val}`);
      });
    });
  });
});

