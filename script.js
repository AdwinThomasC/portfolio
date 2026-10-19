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
  // 7. Project Details Modal with Rich Screenshot Showcase
  const projectDetails = {
    'modal-vslam': {
      title: 'Real-Time Visual SLAM (Simultaneous Localization & Mapping)',
      context: 'Spatial AI & Computer Vision — Active R&D',
      overview: 'Engineering an end-to-end Visual SLAM system implementing real-time camera pose tracking, visual odometry, and 3D spatial point cloud reconstruction from sequential video feeds without reliance on external GPS.',
      points: [
        'Robust sequential feature extraction, visual odometry, and camera pose trajectory estimation.',
        'Real-time 3D landmark triangulation, keyframe management, and sparse point-cloud reconstruction.',
        'Loop-closure verification and pose-graph bundle adjustment to eliminate accumulated trajectory drift.'
      ],
      stack: ['Python', 'PyTorch', 'OpenCV', 'Visual Odometry', 'VSLAM', 'Spatial AI', '3D Geometry'],
      screenshots: [
        {
          src: 'assets/projects/vslam_tracking.png',
          title: 'Real-Time 3D Point Cloud & Visual Odometry Trajectory',
          desc: 'Sequential camera pose tracking, sparse 3D point cloud generation, and landmark triangulation in real time.'
        }
      ]
    },
    'modal-prakash': {
      title: 'PRAKASH — Digital Test · Treat · Track System for Anemia Control',
      context: 'ICMR Grant Scale-Up (INR 1.10 Crore) • Koppal District (40+ Health Facilities)',
      overview: 'Architected and deployed an end-to-end public health tracking platform digitizing anemia screening, clinical diagnostic classification, targeted treatment initiation, and longitudinal follow-up across 40+ healthcare centers in Koppal district.',
      points: [
        'District-level real-time dashboard visualizing anemia burden, screening coverage, and geographic heat maps across Koppal.',
        'Individual Beneficiary Tracker managing patient enrollment, diagnostic records, hemoglobin monitoring, and automated follow-up recalls.',
        'ASHA Coordination Board tracking worker-level screening compliance, field visit logs, and performance metrics across primary health centers.',
        'Supported securing the ₹1.10 Crore ICMR grant extension through proven field deployment stability and robust data integrity.'
      ],
      stack: ['Python', 'PostgreSQL / MySQL', 'Data Pipelines', 'GIS Heatmaps', 'Field Healthcare Tech', 'KPI Analytics'],
      screenshots: [
        {
          src: 'assets/projects/prakash_district_dashboard.png',
          title: 'District-Level Dashboard & Anemia Geo-Heat Map',
          desc: 'District-wide overview of anemia screening burden, testing rates, and geospatial cluster analysis across Koppal district.'
        },
        {
          src: 'assets/projects/prakash_beneficiary_tracker.jpg',
          title: 'Individual Beneficiary Tracker — Screening & Follow-up',
          desc: 'Detailed patient-level tracking module showing screening records, diagnostic Hb values, treatment stages, and longitudinal follow-up schedules.'
        },
        {
          src: 'assets/projects/prakash_asha_board.jpg',
          title: 'ASHA Coordination Board — Compliance Monitoring',
          desc: 'Healthcare worker performance tracking, field submission logs, and geographic coverage monitoring for public health teams.'
        },
        {
          src: 'assets/projects/prakash_asha_card.png',
          title: 'ASHA Field Worker Digital Card Interface',
          desc: 'Streamlined mobile/tablet interface for community health workers to record doorstep patient screenings and symptoms.'
        },
        {
          src: 'assets/projects/prakash_track_workflow.jpg',
          title: 'Longitudinal Treatment Protocol & Patient Tracking',
          desc: 'Active monitoring of iron supplement adherence, follow-up lab dates, and clinical recovery status.'
        },
        {
          src: 'assets/projects/prakash_analytics_view.jpg',
          title: 'High-Level District Healthcare KPI Analytics',
          desc: 'Aggregated clinical outcome trends, demographic breakdowns, and inter-facility screening comparison metrics.'
        }
      ]
    },
    'modal-otms': {
      title: 'OTMS — Operation Theatre Information Management System',
      context: 'St. John’s Medical College & Hospital — Live Production System',
      overview: 'Developed a centralized surgical operations tracking system providing real-time visibility into surgery statuses, room turnover, and surgeon allocations across 24 concurrent operation theatres.',
      points: [
        'Consolidated live tracking across 24 concurrent surgical suites, eliminating paper whiteboards and verbal check-ins.',
        'Real-time surgery phase tracking (pre-op, induction, incision, closure, post-op recovery) to optimize turnaround times.',
        'Operational analytics dashboard visualizing case volumes, emergency surgery queues, and theatre utilization rates.',
        'Deployed on high-visibility displays in surgical corridors and administrative offices for active daily coordination.'
      ],
      stack: ['Python', 'SQL', 'Plotly Dash', 'Hospital Information Systems (HIS)', 'Operational Analytics'],
      screenshots: [
        {
          src: 'assets/projects/otms_live_board.png',
          title: 'Live 24-OT Operations Tracker & Suite Status',
          desc: 'Real-time multi-suite tracking board displaying active procedures, surgical teams, and phase milestones across 24 operation theatres.'
        },
        {
          src: 'assets/projects/otms_metrics.png',
          title: 'OT Operational Analytics & Utilization Metrics',
          desc: 'Comprehensive analytics displaying daily surgical case loads, theatre utilization percentages, and procedure duration trends.'
        },
        {
          src: 'assets/projects/otms_unit_status.png',
          title: 'Unit-Level Live Status & Turnaround Tracker',
          desc: 'Granular view of individual surgical units showing patient transitions, turnover intervals, and sanitization status.'
        },
        {
          src: 'assets/projects/otms_workflow.png',
          title: 'Theatre Scheduling & Emergency Queue Board',
          desc: 'Master scheduling view coordinating elective procedures with incoming emergency cases.'
        }
      ]
    },
    'modal-bed': {
      title: 'St. John’s Bed Monitoring System',
      context: 'St. John’s Medical College & Hospital — Production Capacity System',
      overview: 'Engineered an enterprise bed census and capacity tracking platform providing hospital administration and emergency triage with real-time bed availability across all inpatient departments.',
      points: [
        'Real-time bed availability monitoring across General Wards, Semi-Private Rooms, ICUs, and specialized care units.',
        'Eliminated communication delays between emergency admissions, ward nursing stations, and billing/discharge desks.',
        'Automated occupancy calculations, discharge forecasting, and bed turnaround alerts to reduce admission wait times.',
        'High-reliability architecture integrated with hospital clinical workflows and utilized 24/7.'
      ],
      stack: ['Python', 'SQL', 'Data Pipelines', 'Plotly Dash', 'Healthcare Operations'],
      screenshots: [
        {
          src: 'assets/projects/bed_monitoring_overview.png',
          title: 'Real-Time Bed Monitoring Dashboard Overview',
          desc: 'Consolidated hospital census dashboard showing real-time occupied, vacant, blocked, and preparing beds across all wings.'
        },
        {
          src: 'assets/projects/bed_monitoring_wards.png',
          title: 'Granular Ward & Departmental Bed Census',
          desc: 'Department-by-department breakdown of bed status across Medicine, Surgery, Pediatrics, and Intensive Care Units.'
        },
        {
          src: 'assets/projects/bed_monitoring_occupancy.png',
          title: 'Live Occupancy & Admission Readiness Tracker',
          desc: 'Instant visibility for emergency staff to allocate incoming admissions to ready beds without telephone delay.'
        },
        {
          src: 'assets/projects/bed_monitoring_capacity.png',
          title: 'Bed Turnover Analytics & Capacity Forecasting',
          desc: 'Turnaround duration tracking between patient discharge, housekeeping sanitization, and new admission readiness.'
        }
      ]
    },
    'modal-temptrack': {
      title: 'Temp Track — IoT-Based Temperature Monitoring System',
      context: 'End-to-End Time-Series Telemetry & Alerting System',
      overview: 'Developed a robust IoT monitoring platform to continuously ingest, validate, store, and visualize time-series sensor telemetry, triggering instant automated alerts when thresholds are breached.',
      points: [
        'Continuous real-time sensor data ingestion with local network caching to prevent packet loss during outages.',
        'Dynamic threshold-triggered alerting workflows to notify operational teams immediately of abnormal thermal excursions.',
        'Interactive telemetry dashboard for historical trend analysis, variance inspection, and compliance auditing.'
      ],
      stack: ['Python', 'Time-Series DB', 'IoT Telemetry', 'Plotly Dash / Web UI', 'Threshold Alerting'],
      screenshots: [
        {
          src: 'assets/projects/temptrack_dashboard.png',
          title: 'Temp Track Telemetry Dashboard & Alert Thresholds',
          desc: 'Live time-series temperature curves, multi-sensor status monitors, and automated excursion alert thresholds.'
        }
      ]
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
    }
  };

  // Backward compatibility alias
  projectDetails['modal-hospital'] = projectDetails['modal-otms'];
  projectDetails['modal-iot'] = projectDetails['modal-temptrack'];

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  function openModal(key) {
    const data = projectDetails[key];
    if (!data) return;

    const hasScreenshots = Array.isArray(data.screenshots) && data.screenshots.length > 0;
    const firstShot = hasScreenshots ? data.screenshots[0] : null;

    let galleryHtml = '';
    if (hasScreenshots) {
      galleryHtml = `
        <div class="modal-gallery">
          <div class="modal-gallery-hero-wrap">
            <img id="modalHeroImg" src="${firstShot.src}" alt="${firstShot.title}" class="modal-hero-img">
            <a id="modalHeroZoom" href="${firstShot.src}" target="_blank" rel="noopener noreferrer" class="modal-zoom-btn" title="Open full high-resolution image in new tab">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              <span>Full Resolution ↗</span>
            </a>
            ${data.screenshots.length > 1 ? `<span class="modal-img-counter" id="modalImgCounter">1 / ${data.screenshots.length}</span>` : ''}
          </div>
          <div class="modal-caption-bar">
            <div class="modal-caption-title" id="modalImgTitle">${firstShot.title}</div>
            <div class="modal-caption-desc" id="modalImgDesc">${firstShot.desc}</div>
          </div>
          ${data.screenshots.length > 1 ? `
          <div class="modal-thumbnails-strip">
            ${data.screenshots.map((s, idx) => `
              <button class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}" title="${s.title}">
                <img src="${s.src}" alt="${s.title}">
                <span class="modal-thumb-idx">${idx + 1}</span>
              </button>
            `).join('')}
          </div>
          ` : ''}
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--accent); margin-bottom: 6px;">${data.context}</div>
      <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 14px; color: var(--text-main); line-height: 1.3;">${data.title}</h3>
      
      ${galleryHtml}

      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">${data.overview}</p>
      
      <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-main); margin-bottom: 8px;">Key Technical Highlights:</div>
      <ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px;">
        ${data.points.map(p => `
          <li style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5; padding-left: 14px; position: relative;">
            <span style="position: absolute; left: 0; color: var(--accent);">•</span>${p}
          </li>
        `).join('')}
      </ul>

      <div style="font-size: 0.78rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px;">Tech Stack:</div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${data.stack.map(s => `
          <span style="font-family: var(--font-mono); font-size: 0.76rem; background-color: var(--bg-subtle); color: var(--text-muted); padding: 3px 9px; border-radius: 4px; border: 1px solid var(--border-color);">${s}</span>
        `).join('')}
      </div>
    `;

    // Wire up thumbnail switcher inside modal if multiple screenshots exist
    if (hasScreenshots && data.screenshots.length > 1) {
      const thumbBtns = modalBody.querySelectorAll('.modal-thumb-btn');
      const heroImg = modalBody.querySelector('#modalHeroImg');
      const heroZoom = modalBody.querySelector('#modalHeroZoom');
      const imgTitle = modalBody.querySelector('#modalImgTitle');
      const imgDesc = modalBody.querySelector('#modalImgDesc');
      const imgCounter = modalBody.querySelector('#modalImgCounter');

      thumbBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          const shot = data.screenshots[idx];
          if (!shot) return;

          thumbBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          heroImg.style.opacity = '0.3';
          setTimeout(() => {
            heroImg.src = shot.src;
            heroImg.alt = shot.title;
            heroZoom.href = shot.src;
            imgTitle.textContent = shot.title;
            imgDesc.textContent = shot.desc;
            if (imgCounter) imgCounter.textContent = `${idx + 1} / ${data.screenshots.length}`;
            heroImg.style.opacity = '1';
          }, 150);
        });
      });
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach modal trigger to both buttons and media cards
  function attachModalTriggers() {
    const triggers = document.querySelectorAll('.project-modal-btn, .project-media-wrap');
    triggers.forEach(el => {
      el.addEventListener('click', (e) => {
        // Prevent default if it's a link or button inside
        const targetKey = el.getAttribute('data-target');
        if (targetKey) {
          e.preventDefault();
          openModal(targetKey);
        }
      });
    });
  }

  attachModalTriggers();

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

