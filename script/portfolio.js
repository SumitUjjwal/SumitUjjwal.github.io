// ===================================================
// SUMIT UJJWAL PORTFOLIO — portfolio.js
// Production Senior Backend Portfolio Scripts
// ===================================================

/* --- NAV: scrolled class ---- */
(function() {
  var header = document.getElementById('nav-menu');
  if (!header) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* --- NAV: active link highlighting --- */
(function() {
  var sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
  var navLinks = document.querySelectorAll('.nav-links .nav-link');

  function setActive() {
    var scrollY = window.scrollY + 120;
    var current = 'home';
    sections.forEach(function(id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        current = id;
      }
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.classList.contains(current)) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* --- MOBILE NAV ---------------------------------- */
function closeMobileNav() {
  var mobileNav = document.getElementById('mobile-nav');
  var hamBtn = document.getElementById('ham-menu');
  if (mobileNav) {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  }
  if (hamBtn) {
    hamBtn.setAttribute('aria-expanded', 'false');
  }
}

(function() {
  var hamBtn = document.getElementById('ham-menu');
  var mobileNav = document.getElementById('mobile-nav');
  if (!hamBtn || !mobileNav) return;

  hamBtn.addEventListener('click', function() {
    var isOpen = mobileNav.classList.toggle('open');
    hamBtn.setAttribute('aria-expanded', isOpen.toString());
    mobileNav.setAttribute('aria-hidden', (!isOpen).toString());
  });

  // Close on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });
})();

/* --- SKILLS FILTER ------------------------------- */
(function() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var skillCards = document.querySelectorAll('.skills-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      skillCards.forEach(function(card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* --- COPY EMAIL ---------------------------------- */
(function() {
  var btn = document.getElementById('copy-email-btn');
  var feedback = document.getElementById('copy-feedback');
  if (!btn || !feedback) return;

  btn.addEventListener('click', function() {
    var email = 'sumitujjwal@outlook.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function() {
        feedback.textContent = 'Copied to clipboard!';
        setTimeout(function() { feedback.textContent = ''; }, 2500);
      }).catch(function() {
        feedback.textContent = email;
      });
    } else {
      feedback.textContent = email;
    }
  });
})();

/* --- FOOTER YEAR --------------------------------- */
(function() {
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();


/* --- CONTACT FORM HANDLING ----------------------- */
(function() {
  var form = document.getElementById('direct-contact-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function(e) {
    var name = (document.getElementById('contact-input-name') || {}).value || '';
    var email = (document.getElementById('contact-input-email') || {}).value || '';
    var subject = (document.getElementById('contact-input-subject') || {}).value || '';
    var message = (document.getElementById('contact-input-message') || {}).value || '';

    // If local express server is running on port 2020:
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      e.preventDefault();
      status.textContent = 'Sending message to local server...';
      fetch('http://localhost:2020/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        if (data && data.okay) {
          status.style.color = '#22c55e';
          status.textContent = 'Message sent successfully!';
          form.reset();
        } else {
          fallbackMailto(name, email, subject, message);
        }
      }).catch(function() {
        fallbackMailto(name, email, subject, message);
      });
    } else {
      // GitHub Pages static mode: transparently open user's email client
      e.preventDefault();
      fallbackMailto(name, email, subject, message);
    }
  });

  function fallbackMailto(name, email, subject, message) {
    status.style.color = 'var(--accent)';
    status.textContent = 'Opening your email client to send message...';
    var mailtoUrl = 'mailto:sumitujjwal@outlook.com' +
      '?subject=' + encodeURIComponent((subject || 'Portfolio Inquiry') + ' - ' + name) +
      '&body=' + encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message);
    window.location.href = mailtoUrl;
    setTimeout(function() {
      status.textContent = '';
    }, 4000);
  }
})();

/* --- INTERSECTION OBSERVER (Fade in animations) --- */
(function() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var style = document.createElement('style');
  style.textContent = [
    '.fade-target { opacity: 0; transform: translateY(16px); transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }',
    '.fade-target.visible { opacity: 1; transform: translateY(0); }'
  ].join('');
  document.head.appendChild(style);

  var targets = document.querySelectorAll(
    '.project-card, .about-card, .skills-card, .principle-card, .cert-card, .contact-card, .timeline-content, .showcase-card'
  );

  targets.forEach(function(el) { el.classList.add('fade-target'); });

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '60px 0px 60px 0px' });

  targets.forEach(function(el) { io.observe(el); });
})();

/* --- PRODUCTION CASE STUDIES: MODAL CONTROLLER --- */
(function() {
  var caseStudiesData = {
    'asg-lifecycle': {
      category: 'AWS Infrastructure · CI/CD',
      title: 'Deployment Reliability and Auto Scaling Lifecycle',
      summary: 'Production deployments depend on coordination between deployment automation, instance initialization, and load balancer health checks. This case study focuses on diagnosing deployment inconsistencies and improving the reliability of newly launched EC2 instances.',
      diagram: {
        src: 'assets/case-study-asg.svg',
        alt: 'AWS Auto Scaling and CodeDeploy deployment lifecycle architecture diagram showing ALB, ASG target instances, and hook execution sequence',
        caption: 'Architecture Diagram: Auto Scaling lifecycle hook orchestration & ALB traffic draining'
      },
      problem: '<p>When an Auto Scaling Group launches replacement instances, the new instances must receive the correct application version and become healthy before they receive production traffic. Problems with lifecycle configuration, deployment hooks, application initialization, or health check timing can leave instances running outdated or unready application versions.</p><p>In the relevant production troubleshooting work, deployment behavior and instance lifecycle configuration were investigated as part of diagnosing application availability issues.</p>',
      investigation: '<ul>' +
        '<li>Investigated Auto Scaling Group instance launches and replacements.</li>' +
        '<li>Reviewed deployment automation and the interaction between instance lifecycle events and application deployment.</li>' +
        '<li>Examined load balancer health checks and application readiness behavior.</li>' +
        '<li>Reviewed lifecycle hook configuration and deployment sequencing.</li>' +
        '<li>Evaluated whether newly launched instances were receiving the expected application version.</li>' +
        '</ul>',
      decisions: '<ul>' +
        '<li>Coordinated CodeDeploy lifecycle hooks directly with instance startup scripts rather than assuming the application was ready upon OS boot.</li>' +
        '<li>Balanced health check grace periods against premature unhealthy instance termination during service warm-up.</li>' +
        '<li>Evaluated blue/green vs rolling update strategies to ensure capacity was maintained without dropping in-flight requests.</li>' +
        '</ul>',
      solution: '<p>The corrective approach included validating lifecycle hooks, restoring required deployment configuration where missing, ensuring newly launched instances followed the intended deployment process, and verifying the deployment behavior after configuration changes.</p><p>Where warm-up periods, health checks, or traffic-draining behavior were relevant, they were established as essential operational validation steps.</p><p>The objective was achieved: newly launched instances were verified to receive the expected application version and pass required health checks before serving traffic, successfully validating the deployment flow.</p>',
      tech: ['AWS EC2', 'Auto Scaling Groups', 'AWS CodeDeploy', 'Application Load Balancer', 'CloudWatch'],
      lessons: '<p>Instance replacement and deployment automation must be treated as one unified operational workflow. Launch configuration, lifecycle hooks, application readiness, and health checks need to be validated together.</p>'
    },

    'mysql-optimization': {
      category: 'Database Engineering · Performance',
      title: 'MySQL Query Analysis and Index Optimisation',
      summary: 'Investigating slow database queries requires understanding the execution plan, data access patterns, and application-level query generation before changing indexes or rewriting SQL.',
      diagram: {
        src: 'assets/case-study-mysql.svg',
        alt: 'MySQL query execution plan comparison diagram contrasting full table scan before optimization with composite B-Tree index lookup after optimization',
        caption: 'Execution Comparison: EXPLAIN access paths before and after composite B-Tree indexing'
      },
      problem: '<p>Slow database operations can increase API latency, consume database resources, and become more visible under concurrent application traffic. Inefficient joins, large scans, excessive data retrieval, and poorly targeted indexes are potential contributors.</p>',
      investigation: '<ul>' +
        '<li>Used MySQL execution-plan analysis with <code>EXPLAIN</code> to understand query access paths.</li>' +
        '<li>Investigated expensive joins and inefficient query patterns.</li>' +
        '<li>Reviewed filtering conditions, indexing strategies, and data retrieval requirements.</li>' +
        '<li>Examined Entity Framework Core and LINQ query generation where relevant.</li>' +
        '<li>Evaluated database resource utilization and the effect of expensive queries.</li>' +
        '</ul>',
      decisions: '<ul>' +
        '<li>Analyzed composite index column ordering based on equality filter columns first, followed by range conditions and sorting requirements.</li>' +
        '<li>Weighed index maintenance overhead on write operations against query latency reductions on high-frequency read endpoints.</li>' +
        '<li>Evaluated where to restructure LINQ projections versus writing targeted SQL queries to avoid cartesian explosions and unnecessary column scans.</li>' +
        '</ul>',
      solution: '<p>The optimization approach involved identifying query bottlenecks, evaluating suitable indexes, and improving query structure where justified by execution-plan evidence.</p><p>Techniques included implementing targeted composite B-Tree indexes, reducing unnecessary data retrieval, avoiding inefficient joins, and restructuring query access patterns.</p><p>This resulted in verified latency reductions across analytical query endpoints, eliminating full-table scans and decreasing database CPU and memory load under concurrent production traffic.</p>',
      tech: ['MySQL', 'AWS RDS', 'Entity Framework Core', 'LINQ', 'SQL', 'Execution-Plan Analysis (EXPLAIN)'],
      lessons: '<p>Optimize from evidence rather than assumptions. Validate indexes and query changes against actual execution plans, representative data, and application behavior.</p>'
    },

    'clean-architecture': {
      category: 'Backend Architecture · API Design',
      title: 'Clean Architecture API and Background Processing',
      summary: 'Designing maintainable backend services requires separating business logic from infrastructure concerns, making data access predictable, and handling asynchronous operations and failures explicitly.',
      diagram: {
        src: 'assets/case-study-cqrs.svg',
        alt: 'Clean Architecture CQRS pattern diagram showing ASP.NET Core controllers, MediatR command and query split, Redis cache, and MySQL database',
        caption: 'Architectural Diagram: CQRS query/command isolation with MediatR & Redis cache'
      },
      problem: '<p>Backend applications often combine request handling, business rules, persistence, third-party integrations, and background processing. Without clear boundaries, changes become harder to test and failures become more difficult to isolate.</p>',
      investigation: '<ul>' +
        '<li>Built and maintained APIs using C# and ASP.NET Core.</li>' +
        '<li>Applied Clean Architecture principles where appropriate.</li>' +
        '<li>Used Entity Framework Core for relational data access.</li>' +
        '<li>Worked with CQRS-style separation of commands and queries and MediatR where applicable.</li>' +
        '<li>Implemented background jobs and asynchronous processing.</li>' +
        '<li>Integrated external services and notification workflows.</li>' +
        '<li>Considered error handling, dependency injection, and service boundaries.</li>' +
        '</ul>',
      decisions: '<ul>' +
        '<li>Adopted functional <code>Result&lt;T&gt;</code> pattern for business validation and domain failures, eliminating performance overhead and control-flow abuse of exceptions.</li>' +
        '<li>Applied CQRS separation to decouple read queries from write commands, allowing query handlers to optimize projections without mutating state.</li>' +
        '<li>Structured a Redis cache factory providing tenant and feature namespace isolation to prevent key collisions in multi-tenant environments.</li>' +
        '</ul>',
      solution: '<p>The approach emphasized keeping application responsibilities organized, separating request handling from business logic, and making infrastructure dependencies explicit.</p><p>Documented and utilized typed results, structured error handling, background job processing, and cache abstraction.</p><p>This resulted in significant improvements in codebase maintainability, isolated unit testability, and predictable background processing behavior across third-party integration pipelines.</p>',
      tech: ['C#', '.NET', 'ASP.NET Core', 'Entity Framework Core', 'MediatR', 'CQRS', 'Redis', 'Firebase Admin SDK'],
      lessons: '<p>Good architecture should make changes easier to reason about and test. Introduce abstractions and patterns when they solve real problems rather than adding complexity for its own sake.</p>'
    },

    'production-observability': {
      category: 'Production Operations · Reliability',
      title: 'Production Observability and Incident Response',
      summary: 'Effective production troubleshooting depends on connecting application logs, infrastructure metrics, health checks, and deployment history to identify the cause of a failure and validate the recovery.',
      diagram: {
        src: 'assets/case-study-observability.svg',
        alt: 'AWS CloudWatch structured logs and alerting triage architecture diagram showing signals, investigation, and preventive runbooks',
        caption: 'Observability Pipeline: CloudWatch Log Insights triage & upstream socket tuning'
      },
      problem: '<p>Backend services can experience availability and performance problems due to database connection exhaustion, application errors, load balancer health check failures, configuration issues, or infrastructure changes. Incomplete observability increases the time required to identify the source of a problem.</p>',
      investigation: '<ul>' +
        '<li>Investigated application errors and production service failures.</li>' +
        '<li>Analyzed CloudWatch logs and infrastructure metrics.</li>' +
        '<li>Examined Application Load Balancer health checks and HTTP 502 errors.</li>' +
        '<li>Investigated database connectivity and connection-pool issues.</li>' +
        '<li>Reviewed Linux processes, Nginx configuration, and upstream service behavior.</li>' +
        '<li>Used alarms and diagnostic evidence to narrow down possible causes.</li>' +
        '</ul>',
      decisions: '<ul>' +
        '<li>Correlated ALB access log 502/504 spikes with upstream Nginx socket exhaustion and ASP.NET Core connection pool saturation.</li>' +
        '<li>Tuned Nginx upstream keep-alive connections and timeout buffers to prevent premature socket drops during bursty traffic.</li>' +
        '<li>Documented actionable diagnostic runbooks rather than relying on reactive manual service restarts.</li>' +
        '</ul>',
      solution: '<p>The operational approach focused on correlating application and infrastructure evidence, identifying the failure mechanism, applying corrective changes, and validating recovery.</p><p>Standardized structured JSON logging, established CloudWatch metric alarms for error rate and latency spikes, and mapped SNS alerting directly to on-call triage channels.</p><p>Verified service recovery and eliminated intermittent upstream connection errors under bursty workloads, establishing reproducible runbooks for future incident triage.</p>',
      tech: ['AWS CloudWatch', 'Application Load Balancer', 'AWS SNS', 'Nginx', 'Linux', 'Application Logs', 'Infrastructure Monitoring'],
      lessons: '<p>Logs, metrics, alerts, and health checks are most useful when they help engineers move from a symptom to a root cause. Validate recovery and address the underlying failure mechanism rather than relying solely on service restarts.</p>'
    }
  };

  var modal = document.getElementById('case-study-modal');
  if (!modal) return;

  var closeBtn = document.getElementById('modal-close-btn');
  var footerCloseBtn = document.getElementById('modal-footer-close-btn');
  var modalBody = document.getElementById('modal-case-content');
  var categoryEl = document.getElementById('modal-case-category');
  var titleEl = document.getElementById('modal-case-title');
  var summaryEl = document.getElementById('modal-case-summary');
  var diagramImgEl = document.getElementById('modal-case-diagram-img');
  var diagramCaptionEl = document.getElementById('modal-case-diagram-caption');
  var diagramSectionEl = document.querySelector('.modal-diagram-section');
  var problemEl = document.getElementById('modal-case-problem');
  var investigationEl = document.getElementById('modal-case-investigation');
  var decisionsEl = document.getElementById('modal-case-decisions');
  var solutionEl = document.getElementById('modal-case-solution');
  var techEl = document.getElementById('modal-case-tech');
  var lessonsEl = document.getElementById('modal-case-lessons');

  var triggerElement = null;
  var backgroundElements = [
    document.getElementById('nav-menu'),
    document.querySelector('main'),
    document.querySelector('footer')
  ].filter(Boolean);

  function openModal(caseId, sourceBtn) {
    var data = caseStudiesData[caseId];
    if (!data) return;

    triggerElement = sourceBtn || document.activeElement;

    // Populate content
    if (categoryEl) categoryEl.textContent = data.category;
    if (titleEl) titleEl.textContent = data.title;
    if (summaryEl) summaryEl.textContent = data.summary;

    if (data.diagram && diagramImgEl) {
      diagramImgEl.src = data.diagram.src;
      diagramImgEl.alt = data.diagram.alt;
      if (diagramCaptionEl) diagramCaptionEl.textContent = data.diagram.caption;
      if (diagramSectionEl) diagramSectionEl.style.display = 'flex';
    } else if (diagramSectionEl) {
      diagramSectionEl.style.display = 'none';
    }

    if (problemEl) problemEl.innerHTML = data.problem;
    if (investigationEl) investigationEl.innerHTML = data.investigation;
    if (decisionsEl) decisionsEl.innerHTML = data.decisions;
    if (solutionEl) solutionEl.innerHTML = data.solution;
    if (lessonsEl) lessonsEl.innerHTML = data.lessons;

    if (techEl) {
      techEl.innerHTML = '';
      data.tech.forEach(function(item) {
        var pill = document.createElement('span');
        pill.className = 'modal-tech-pill';
        pill.textContent = item;
        techEl.appendChild(pill);
      });
    }

    // Scroll to top of content
    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    // Activate modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Make background content inert for screen readers
    backgroundElements.forEach(function(el) {
      el.setAttribute('aria-hidden', 'true');
    });

    // Move keyboard focus into modal
    setTimeout(function() {
      if (closeBtn) {
        closeBtn.focus();
      } else if (modalBody) {
        modalBody.focus();
      }
    }, 50);
  }

  function closeModal() {
    if (!modal.classList.contains('active')) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Restore background content for screen readers
    backgroundElements.forEach(function(el) {
      el.removeAttribute('aria-hidden');
    });

    // Return focus to triggering button
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
  }

  // Attach button triggers
  var triggerBtns = document.querySelectorAll('.open-case-modal-btn');
  triggerBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var caseId = btn.getAttribute('data-case-id');
      openModal(caseId, btn);
    });
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeModal);

  // Click on backdrop to close (without closing on inside clicks)
  modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.classList.contains('modal-container')) {
      closeModal();
    }
  });

  // Keyboard navigation: Escape key & Focus Trap
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      var focusableSelectors = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      var focusables = Array.prototype.slice.call(modal.querySelectorAll(focusableSelectors));
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

/* --- FUTURISTIC INTERACTIVE DISTRIBUTED MESH CANVAS --- */
(function initCyberNetwork() {
  var canvas = document.getElementById('cyber-network-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Collections
  var nodes = [];
  var packets = [];
  var maxNodes = 75;
  var maxDistance = 135;
  var cursorRadius = 185;

  var mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isHovering: false,
    pulseTimer: 0
  };

  var rafId = null;
  var isVisible = true;

  // Color palette: Amber (#ff9933), Electric Sky (#38bdf8), Crisp Platinum (#f1f5f9)
  var colors = {
    amber: 'rgba(255, 153, 51, ',
    cyan: 'rgba(56, 189, 248, ',
    white: 'rgba(241, 245, 249, '
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    var isMobile = width < 768;
    var targetCount = isMobile
      ? Math.floor(Math.min(30, Math.max(18, (width * height) / 14000)))
      : Math.floor(Math.min(maxNodes, Math.max(35, (width * height) / 18000)));

    maxDistance = isMobile ? 110 : 135;
    cursorRadius = isMobile ? 140 : 185;
    maxDistanceSq = maxDistance * maxDistance;
    cursorRadiusSq = cursorRadius * cursorRadius;

    initNodes(targetCount);
  }

  function Node(x, y) {
    this.x = x || Math.random() * width;
    this.y = y || Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = 1.6 + Math.random() * 1.8;

    var rand = Math.random();
    if (rand < 0.6) {
      this.colorType = 'amber';
      this.color = colors.amber;
    } else if (rand < 0.9) {
      this.colorType = 'cyan';
      this.color = colors.cyan;
    } else {
      this.colorType = 'white';
      this.color = colors.white;
    }

    this.isHub = Math.random() < 0.12;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.03 + Math.random() * 0.02;
  }

  Node.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 10) { this.x = 10; this.vx *= -1; }
    else if (this.x > width - 10) { this.x = width - 10; this.vx *= -1; }
    if (this.y < 10) { this.y = 10; this.vy *= -1; }
    else if (this.y > height - 10) { this.y = height - 10; this.vy *= -1; }

    if (mouse.isHovering) {
      var dx = mouse.x - this.x;
      var dy = mouse.y - this.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < cursorRadius && dist > 1) {
        var force = (1 - dist / cursorRadius) * 0.4;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
    }

    if (this.isHub) {
      this.pulse += this.pulseSpeed;
    }
  };

  Node.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color + (this.isHub ? '0.85)' : '0.65)');
    ctx.fill();

    if (this.isHub) {
      var ringRadius = this.radius + 3 + Math.sin(this.pulse) * 3;
      var ringAlpha = 0.15 + Math.sin(this.pulse) * 0.1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(1, ringRadius), 0, Math.PI * 2);
      ctx.strokeStyle = this.color + ringAlpha + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  function Packet(sourceNode, targetNode) {
    this.source = sourceNode;
    this.target = targetNode;
    this.progress = 0;
    this.speed = 0.012 + Math.random() * 0.015;
    this.color = sourceNode.color;
  }

  Packet.prototype.update = function() {
    this.progress += this.speed;
    return this.progress < 1;
  };

  Packet.prototype.draw = function() {
    var px = this.source.x + (this.target.x - this.source.x) * this.progress;
    var py = this.source.y + (this.target.y - this.source.y) * this.progress;

    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff9933';
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function initNodes(count) {
    nodes = [];
    packets = [];
    for (var i = 0; i < count; i++) {
      nodes.push(new Node());
    }
  }

  function spawnPacket() {
    if (packets.length >= 10 || nodes.length < 2) return;
    var attempts = 0;
    while (attempts < 8) {
      attempts++;
      var i1 = Math.floor(Math.random() * nodes.length);
      var i2 = Math.floor(Math.random() * nodes.length);
      if (i1 === i2) continue;
      var n1 = nodes[i1];
      var n2 = nodes[i2];
      var dx = n1.x - n2.x;
      var dy = n1.y - n2.y;
      var distSq = dx * dx + dy * dy;
      if (distSq < maxDistance * maxDistance) {
        packets.push(new Packet(n1, n2));
        break;
      }
    }
  }

  var maxDistanceSq = maxDistance * maxDistance;
  var cursorRadiusSq = cursorRadius * cursorRadius;
  var lastFrameTime = 0;
  var packetSpawnCounter = 0;

  function render(currentTime) {
    if (!isVisible) return;

    // Battery & CPU optimization: 30fps when idle, 60fps during cursor interaction
    var targetInterval = mouse.isHovering ? 16 : 33;
    if (currentTime && (currentTime - lastFrameTime < targetInterval)) {
      rafId = requestAnimationFrame(render);
      return;
    }
    lastFrameTime = currentTime || 0;

    ctx.clearRect(0, 0, width, height);

    if (mouse.isHovering) {
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;
    }

    var i, j;
    var len = nodes.length;
    for (i = 0; i < len; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    for (i = 0; i < len; i++) {
      var n1 = nodes[i];
      for (j = i + 1; j < len; j++) {
        var n2 = nodes[j];
        var dx = n1.x - n2.x;
        var dy = n1.y - n2.y;
        var distSq = dx * dx + dy * dy;

        // Skip costly Math.sqrt if out of range (>90% rejected immediately)
        if (distSq < maxDistanceSq) {
          var dist = Math.sqrt(distSq);
          var alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = n1.color + alpha + ')';
          ctx.lineWidth = 0.95;
          ctx.stroke();
        }
      }

      if (mouse.isHovering) {
        var cdx = n1.x - mouse.x;
        var cdy = n1.y - mouse.y;
        var cdistSq = cdx * cdx + cdy * cdy;

        if (cdistSq < cursorRadiusSq) {
          var cdist = Math.sqrt(cdistSq);
          var calpha = (1 - cdist / cursorRadius) * 0.46;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(n1.x, n1.y);
          ctx.strokeStyle = n1.color + calpha + ')';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }
    }

    if (mouse.isHovering) {
      mouse.pulseTimer += 0.05;
      var ringR = 10 + Math.sin(mouse.pulseTimer) * 2;

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff9933';
      ctx.shadowColor = '#ff9933';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    packetSpawnCounter++;
    if (packetSpawnCounter % 35 === 0) {
      spawnPacket();
    }

    for (var p = packets.length - 1; p >= 0; p--) {
      var pkt = packets[p];
      if (pkt.update()) {
        pkt.draw();
      } else {
        packets.splice(p, 1);
      }
    }

    rafId = requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', function(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    if (!mouse.isHovering) {
      mouse.isHovering = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(render);
    }
  }, { passive: true });

  var touchFadeTimer = null;
  window.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches.length > 0) {
      if (touchFadeTimer) { clearTimeout(touchFadeTimer); touchFadeTimer = null; }
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
      mouse.isHovering = true;
      if (!rafId) rafId = requestAnimationFrame(render);
    }
  }, { passive: true });

  window.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches.length > 0) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isHovering = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', function() {
    if (touchFadeTimer) clearTimeout(touchFadeTimer);
    touchFadeTimer = setTimeout(function() {
      mouse.isHovering = false;
    }, 1200);
  }, { passive: true });

  document.addEventListener('mouseleave', function() {
    mouse.isHovering = false;
  });

  window.addEventListener('blur', function() {
    mouse.isHovering = false;
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      isVisible = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else {
      isVisible = true;
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    }
  });

  window.addEventListener('resize', resize, { passive: true });

  resize();
  rafId = requestAnimationFrame(render);
})();
