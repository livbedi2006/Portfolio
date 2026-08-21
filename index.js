import { animate, inView, stagger, hover } from 'motion';
import { init3DHero } from './hero-3d.js';
import { initTextParticles } from './hero-text-particles.js';

// Livjot Singh Portfolio JavaScript - 3D Design & Fintech UI

(function () {
    // ── LOADING SCREEN CONTROLLER ────────────────────────────────────
    const screen = document.getElementById('loadingScreen');
    const label = document.getElementById('loaderPercent');
    const bar = document.getElementById('loaderProgress');
    const term = document.getElementById('terminalOutput');
    let done = false;

    const messages = [
        "INITIALIZING FINTECH KERNEL...",
        "MOUNTING PRIVATE-BANKING GRAPHICS...",
        "LOADING NEURAL NETWORK MODELS...",
        "COMPILING RADAR & DRIFT ANALYTICS...",
        "CONNECTING GITHUB REPOSITORIES...",
        "SYSTEM OPERATIONAL."
    ];
    let msgIdx = 0;

    function hideNow() {
        if (done) return;
        done = true;
        if (screen) screen.classList.add('hidden');
        setTimeout(() => {
            if (screen) screen.style.display = 'none';
        }, 800);
    }

    let pct = 0;
    const timer = setInterval(() => {
        pct += Math.random() * 5 + 3;
        if (pct > 100) pct = 100;

        if (label) label.textContent = Math.floor(pct) + '%';
        if (bar) bar.style.width = pct + '%';

        if (pct > (msgIdx * (100 / messages.length)) && msgIdx < messages.length) {
            if (term) {
                const div = document.createElement('div');
                div.className = 'terminal-line';
                div.textContent = "> " + messages[msgIdx];
                term.appendChild(div);
                if (term.children.length > 4) {
                    term.removeChild(term.firstChild);
                }
            }
            msgIdx++;
        }

        if (pct >= 100) {
            clearInterval(timer);
            setTimeout(hideNow, 300);
        }
    }, 40);

    setTimeout(hideNow, 3500);
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized with Fintech UI aesthetics');

    // ── REVEAL ON SCROLL WITH INTERSECTION OBSERVER & FALLBACK ────────
    function observeReveals() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px 0px 100px 0px', threshold: 0.01 });

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Safety fallback to ensure no element remains invisible
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 800);
    }
    observeReveals();

    // ── INITIALIZE 3D HERO & TEXT PARTICLES ──────────────────────────
    init3DHero();
    const particleEngine = initTextParticles();

    // Glass Card Preset Controls
    const presetBtns = document.querySelectorAll('.glass-preset-btn');
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            try {
                const lines = JSON.parse(btn.getAttribute('data-lines'));
                if (particleEngine && particleEngine.setText) {
                    particleEngine.setText(lines);
                }
            } catch (err) {
                console.error("Error parsing preset lines", err);
            }
        });
    });

    // 3D Glass Space Card Hover Tilt
    const glassCard = document.getElementById('heroGlassCard');
    if (glassCard) {
        glassCard.addEventListener('mousemove', (e) => {
            const rect = glassCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            animate(glassCard, {
                rotateX,
                rotateY,
                scale: 1.01
            }, { duration: 0.2, easing: "ease-out" });
        });
        
        glassCard.addEventListener('mouseleave', () => {
            animate(glassCard, {
                rotateX: 0,
                rotateY: 0,
                scale: 1
            }, { duration: 0.5, easing: "ease-out" });
        });
    }

    // ── 3D BENTO CARD HOVER EFFECTS WITH MOTION.DEV ──────────────────
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Map mouse position to rotation (-10 to 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            animate(card, {
                rotateX,
                rotateY,
                scale: 1.02
            }, { duration: 0.2, easing: "ease-out" });
        });
        
        card.addEventListener('mouseleave', () => {
            animate(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1
            }, { duration: 0.5, easing: "ease-out" });
        });
    });

    // ── LENIS SMOOTH SCROLL ──────────────────────────────────────────
    let activeLenis = null;
    if (typeof Lenis !== 'undefined') {
        activeLenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            mouseMultiplier: 1
        });

        function raf(time) {
            activeLenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ── SMOOTH ANCHOR CLICK NAVIGATION ──────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                if (activeLenis) {
                    activeLenis.scrollTo(targetEl, { offset: -70 });
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ── SCROLLSPY ACTIVE NAV LINK HIGHLIGHTING ────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[data-section]');
    if (sections.length > 0 && navItems.length > 0) {
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(item => {
                        if (item.getAttribute('data-section') === id) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-20% 0px -50% 0px' });

        sections.forEach(sec => scrollSpyObserver.observe(sec));
    }

    // ── ANIMATED STAT COUNTERS ────────────────────────────────────────
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (statNums.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(entry.target.getAttribute('data-target'));
                    const rawText = entry.target.textContent;
                    const duration = 1500;
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const currentVal = (progress * target).toFixed(target % 1 === 0 ? 0 : 1);
                        
                        if (rawText.includes('+') && rawText.includes('Yrs')) {
                            entry.target.textContent = currentVal + '+ Yrs';
                        } else if (rawText.includes('+')) {
                            entry.target.textContent = currentVal + '+';
                        } else if (rawText.includes('%')) {
                            entry.target.textContent = currentVal + '%';
                        } else {
                            entry.target.textContent = currentVal;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(num => counterObserver.observe(num));
    }

    // ── NAVBAR SCROLL & MOBILE HAMBURGER ─────────────────────────────
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbarWrapper?.classList.add('scrolled');
        } else {
            navbarWrapper?.classList.remove('scrolled');
        }
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    // ── THEME TOGGLE ────────────────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            drawRadarChart();
        });
    }

    // ── KINETIC CURSOR ──────────────────────────────────────────────
    const cursorDot = document.getElementById('cursorDot');
    const cursorFollower = document.getElementById('cursorFollower');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let cursorActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorActive) {
            cursorActive = true;
            document.body.classList.add('cursor-ready');
        }
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        if (cursorFollower) {
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ── INTERACTIVE CANVAS SKILL RADAR CHART ───────────────────────
    function drawRadarChart() {
        const canvas = document.getElementById('skillRadarCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 60;

        ctx.clearRect(0, 0, width, height);

        const skills = [
            { name: 'ML/AI', value: 0.88 },
            { name: 'NLP', value: 0.90 },
            { name: 'Vision', value: 0.85 },
            { name: 'Web', value: 0.92 },
            { name: 'Cloud', value: 0.75 },
            { name: 'Algorithms', value: 0.85 }
        ];

        const numSides = skills.length;
        const angleStep = (Math.PI * 2) / numSides;

        // Draw concentric grid polygons
        const isDark = html.getAttribute('data-theme') !== 'light';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        const textColor = isDark ? '#94a3b8' : '#475569';

        for (let level = 1; level <= 4; level++) {
            const levelRadius = (radius / 4) * level;
            ctx.beginPath();
            for (let i = 0; i < numSides; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + levelRadius * Math.cos(angle);
                const y = centerY + levelRadius * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axes & labels
        ctx.font = '10px JetBrains Mono';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = gridColor;
            ctx.stroke();

            const labelX = centerX + (radius + 18) * Math.cos(angle);
            const labelY = centerY + (radius + 18) * Math.sin(angle);
            ctx.fillText(skills[i].name, labelX, labelY);
        }

        // Draw data shape
        ctx.beginPath();
        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const r = radius * skills[i].value;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();

        ctx.fillStyle = 'rgba(106, 60, 255, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#6A3CFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw vertices dots
        for (let i = 0; i < numSides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const r = radius * skills[i].value;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#6A3CFF';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    drawRadarChart();

    // ── DRIFT ALERT TOGGLE BUTTON ────────────────────────────────────
    const driftToggleBtn = document.getElementById('driftToggleBtn');
    const driftAlertCard = document.getElementById('driftAlertCard');
    if (driftToggleBtn && driftAlertCard) {
        driftToggleBtn.addEventListener('click', () => {
            if (driftToggleBtn.textContent === 'Active') {
                driftToggleBtn.textContent = 'Optimized';
                driftToggleBtn.style.background = '#ffffff';
                driftToggleBtn.style.color = '#000000';
                driftAlertCard.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            } else {
                driftToggleBtn.textContent = 'Active';
                driftToggleBtn.style.background = '#6A3CFF';
                driftToggleBtn.style.color = '#000000';
                driftAlertCard.style.borderColor = 'rgba(106, 60, 255, 0.2)';
            }
        });
    }

    // ── DEMO MODAL CONTROLLER ───────────────────────────────────────
    const demoModal = document.getElementById('demoModal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            demoModal?.classList.add('active');
        });
    });

    modalCloseBtn?.addEventListener('click', () => {
        demoModal?.classList.remove('active');
    });

    demoModal?.addEventListener('click', (e) => {
        if (e.target === demoModal) {
            demoModal.classList.remove('active');
        }
    });

    // ── GITHUB PROJECTS FETCH & RENDERING ───────────────────────────
    const projectsGrid = document.getElementById('projectsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    const defaultProjects = [
        {
            name: "AI Exam Invigilation System",
            description: "Real-time automated proctoring application utilizing computer vision, pose estimation, and face tracking algorithms.",
            category: "ai",
            language: "Python / OpenCV",
            stars: 12,
            repoUrl: "https://github.com/livbedi2006"
        },
        {
            name: "NLP Plagiarism Detector",
            description: "Advanced semantic text comparison tool leveraging TF-IDF vectorization and cosine similarity metrics.",
            category: "ai",
            language: "Python / NLTK",
            stars: 18,
            repoUrl: "https://github.com/livbedi2006"
        },
        {
            name: "Fintech Portfolio Web App",
            description: "Ultra-responsive dark grain private-banking UI featuring interactive dashboard previews, metrics, and radar charts.",
            category: "web",
            language: "JavaScript / CSS3",
            stars: 24,
            repoUrl: "https://github.com/livbedi2006"
        },
        {
            name: "Model Drift Monitoring Suite",
            description: "Lightweight Python utility for tracking concept drift and dataset shift in real-time machine learning pipelines.",
            category: "tools",
            language: "Python / Scikit-Learn",
            stars: 8,
            repoUrl: "https://github.com/livbedi2006"
        },
        {
            name: "Neural Network Visualizer",
            description: "Interactive HTML5 canvas tool to visualize layer weights, activations, and backpropagation gradients.",
            category: "web",
            language: "JavaScript / HTML5",
            stars: 15,
            repoUrl: "https://github.com/livbedi2006"
        },
        {
            name: "Automated Data Pipeline Engine",
            description: "High-throughput asynchronous ETL pipeline generator designed for Machine Learning feature engineering.",
            category: "tools",
            language: "Python / GCP",
            stars: 10,
            repoUrl: "https://github.com/livbedi2006"
        }
    ];

    function renderProjects(categoryFilter = 'ai') {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        const filtered = categoryFilter === 'all' 
            ? defaultProjects 
            : defaultProjects.filter(p => p.category === categoryFilter);

        filtered.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card reveal active';
            card.innerHTML = `
                <div class="project-mockup">
                    <div class="mockup-inner">
                        <span class="project-type-badge">${project.category.toUpperCase()}</span>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        <span class="project-tag">${project.language}</span>
                        <span class="project-tag">★ ${project.stars}</span>
                    </div>
                    <div class="project-links">
                        <a href="${project.repoUrl}" target="_blank" class="project-link">
                            <span>View Source</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                        </a>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
        
        // Re-initialize motion reveals for dynamically added elements
        setTimeout(() => {
            const newCards = projectsGrid.querySelectorAll('.project-card.reveal:not([data-inview])');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -50px 0px' });
            
            newCards.forEach(card => {
                observer.observe(card);
                card.setAttribute('data-inview', 'true');
                
                // Add hover effect using motion.dev
                hover(card, 
                    () => animate(card, { scale: 1.02, y: -5 }, { duration: 0.3, easing: "ease-out" }),
                    () => animate(card, { scale: 1, y: 0 }, { duration: 0.3, easing: "ease-out" })
                );
            });
        }, 100);
    }

    // Filter listener
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderProjects(filter);
        });
    });

    // Helper to get currently active filter
    const getActiveFilter = () => document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'ai';

    // Initial render
    renderProjects(getActiveFilter());

    // Fetch from GitHub API if available
    fetch('https://api.github.com/users/livbedi2006/repos?sort=updated&per_page=6')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const apiProjects = data.map(repo => ({
                    name: repo.name.replace(/-/g, ' ').toUpperCase(),
                    description: repo.description || 'Open source engineering repository.',
                    category: (repo.language && repo.language.toLowerCase().includes('python')) ? 'ai' : 'web',
                    language: repo.language || 'Code',
                    stars: repo.stargazers_count || 0,
                    repoUrl: repo.html_url
                }));
                if (apiProjects.length > 0) {
                    defaultProjects.unshift(...apiProjects);
                    renderProjects(getActiveFilter());
                }
            }
        })
        .catch(err => console.log('GitHub API fallback in use:', err));
});