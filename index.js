// Livjot Singh Portfolio JavaScript - High-Trust Fintech UI (impli.mp4 inspired)

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
        pct += Math.random() * 5 + 2;
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

    setTimeout(hideNow, 4000);
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized with Fintech UI aesthetics');

    // ── LENIS SMOOTH SCROLL ──────────────────────────────────────────
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            mouseMultiplier: 1
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // ── NAVBAR SCROLL & ACTIVE LINKS ─────────────────────────────────
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbarWrapper?.classList.add('scrolled');
        } else {
            navbarWrapper?.classList.remove('scrolled');
        }
    });

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
            drawRadarChart(); // Redraw chart with theme colors
        });
    }

    // ── KINETIC CURSOR ──────────────────────────────────────────────
    const cursorDot = document.getElementById('cursorDot');
    const cursorFollower = document.getElementById('cursorFollower');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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
        const radius = 80;

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

            // Label position
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

        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
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
            ctx.strokeStyle = '#10b981';
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
                driftToggleBtn.style.background = '#10b981';
                driftToggleBtn.style.color = '#000000';
                driftAlertCard.style.borderColor = 'rgba(16, 185, 129, 0.2)';
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

    function renderProjects(categoryFilter = 'all') {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = '';

        const filtered = categoryFilter === 'all' 
            ? defaultProjects 
            : defaultProjects.filter(p => p.category === categoryFilter);

        filtered.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
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

    // Initial render
    renderProjects();

    // Fetch from GitHub API if available
    fetch('https://api.github.com/users/livbedi2006/repos?sort=updated&per_page=6')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                // Map real repos into our structure
                const apiProjects = data.map(repo => ({
                    name: repo.name.replace(/-/g, ' ').toUpperCase(),
                    description: repo.description || 'Open source engineering repository.',
                    category: (repo.language && repo.language.toLowerCase().includes('python')) ? 'ai' : 'web',
                    language: repo.language || 'Code',
                    stars: repo.stargazers_count || 0,
                    repoUrl: repo.html_url
                }));
                // Combine or replace default projects cleanly
                if (apiProjects.length > 0) {
                    defaultProjects.unshift(...apiProjects);
                    renderProjects('all');
                }
            }
        })
        .catch(err => console.log('GitHub API offline, using curated fallback repositories:', err));

    // ── REVEAL ON SCROLL ANIMATIONS ─────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});