// Portfolio JavaScript

// =========================================================
// LOADING SCREEN
// NOTE: The loading screen is dismissed by a CSS animation
// (loaderDismiss) as the PRIMARY mechanism. JS is a bonus.
// =========================================================

(function () {
    var screen  = document.getElementById('loadingScreen');
    var label   = document.getElementById('loaderPercent');
    var done    = false;

    function hideNow() {
        if (done) return;
        done = true;
        if (screen) screen.classList.add('hidden');
        setTimeout(function () {
            if (screen) screen.style.display = 'none';
        }, 800);
    }

    // Animate 0 -> 100 counter using setInterval (16ms = ~60fps)
    var pct = 0;
    var timer = setInterval(function () {
        pct++;
        if (label) label.textContent = pct + '%';
        if (pct >= 100) {
            clearInterval(timer);
            setTimeout(hideNow, 150);
        }
    }, 16);   // 100 steps x 16ms = ~1600ms total

    // Failsafe: force-hide after 4 seconds no matter what
    setTimeout(hideNow, 4000);
    window.addEventListener('load', hideNow);
}());


// ─── Main Portfolio Initialisation ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio...');

    // ── Theme Toggle ──────────────────────────────────────────────
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
        });
    }

    // ── Trailing Cursor ───────────────────────────────────────────
    const cursorDot   = document.getElementById('cursorDot');
    const trailColors = ['#3b82f6','#60a5fa','#6366f1','#818cf8','#0ea5e9','#38bdf8'];
    let lastTrailX = 0, lastTrailY = 0;
    const MIN_DIST = 12;
    let cursorReady = false;

    document.addEventListener('mousemove', function(e) {
        var x = e.clientX;
        var y = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = x + 'px';
            cursorDot.style.top  = y + 'px';

            // On very first move: reveal dot + hide native cursor
            if (!cursorReady) {
                cursorReady = true;
                document.body.classList.add('custom-cursor');
                cursorDot.style.opacity = '1';
                cursorDot.style.transition =
                    'left 0.06s ease, top 0.06s ease, ' +
                    'width 0.2s ease, height 0.2s ease, ' +
                    'background 0.25s ease, opacity 0.3s ease';
            }
        }

        // Trail particles
        var dx = x - lastTrailX;
        var dy = y - lastTrailY;
        if (Math.sqrt(dx*dx + dy*dy) > MIN_DIST) {
            spawnTrail(x, y);
            lastTrailX = x;
            lastTrailY = y;
        }
    });

    function spawnTrail(x, y) {
        var p = document.createElement('div');
        p.className = 'trail-particle';
        var color = trailColors[Math.floor(Math.random() * trailColors.length)];
        var size = (4 + Math.random() * 4).toFixed(1);
        p.style.cssText =
            'left:' + x + 'px;' +
            'top:' + y + 'px;' +
            'background:' + color + ';' +
            'box-shadow:0 0 6px ' + color + ';' +
            'width:' + size + 'px;' +
            'height:' + size + 'px;';
        document.body.appendChild(p);
        p.addEventListener('animationend', function() { p.remove(); });
    }

    // Cursor grows on hover over interactive elements
    var interactives = document.querySelectorAll(
        'a, button, .filter-btn, .skill-card, .project-card, .social-link, .contact-card, .tag'
    );
    interactives.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            if (cursorDot) cursorDot.classList.add('hovering');
        });
        el.addEventListener('mouseleave', function() {
            if (cursorDot) cursorDot.classList.remove('hovering');
        });
    });

    // Hide dot when mouse leaves the viewport
    document.addEventListener('mouseleave', function() {
        if (cursorDot) cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
        if (cursorDot && cursorReady) cursorDot.style.opacity = '1';
    });



    // ── Scroll Reveal Observer ────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    // ── Hero entrance animations ──────────────────────────────────
    const heroBadge    = document.querySelector('.hero-badge');
    const heroTitle    = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats    = document.querySelector('.hero-stats');
    const heroCta      = document.querySelector('.hero-cta');
    const heroVisual   = document.querySelector('.hero-visual');

    [heroBadge, heroTitle, heroSubtitle, heroStats, heroCta].forEach((el, i) => {
        if (!el) return;
        el.style.opacity   = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition= 'opacity 0.7s ease, transform 0.7s ease';
        setTimeout(() => {
            el.style.opacity   = '1';
            el.style.transform = 'none';
        }, 400 + i * 130);
    });

    if (heroVisual) {
        heroVisual.style.opacity   = '0';
        heroVisual.style.transform = 'translateX(30px)';
        heroVisual.style.transition= 'opacity 0.9s ease, transform 0.9s ease';
        setTimeout(() => {
            heroVisual.style.opacity   = '1';
            heroVisual.style.transform = 'none';
        }, 700);
    }


    // Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0 && navItems.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === current) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Animated Counter for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    };
    
    // Intersection Observer for Stats Animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
    
    // GitHub Projects Fetch
    const GITHUB_USERNAME = 'livbedi2006';
    const projectsGrid = document.getElementById('projectsGrid');
    
    const languageColors = {
        'Python': '#3572A5',
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'Java': '#b07219',
        'SQL': '#e38c17',
        null: '#8b949e'
    };
    
    const getProjectCategory = (project) => {
        const name = project.name.toLowerCase();
        const desc = (project.description || '').toLowerCase();
        
        if (name.includes('ml') || name.includes('machine') || name.includes('ai') || 
            desc.includes('machine learning') || desc.includes('nlp') || desc.includes('ai')) {
            return 'ai';
        }
        if (name.includes('web') || name.includes('portal') || name.includes('site') ||
            project.language === 'HTML' || project.language === 'JavaScript' || project.language === 'TypeScript') {
            return 'web';
        }
        return 'tools';
    };
    
    const createProjectCard = (project) => {
        const category = getProjectCategory(project);
        const languageColor = languageColors[project.language] || languageColors.null;
        const description = project.description || 'A personal project showcasing development skills.';
        const stars = project.stargazers_count;
        const forks = project.forks_count;
        
        return `
            <div class="project-card" data-category="${category}">
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <div class="project-links">
                        <a href="${project.html_url}" target="_blank" class="project-link" title="View on GitHub">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <p class="project-description">${description}</p>
                <div class="project-meta">
                    <div class="project-language">
                        <span class="language-dot" style="background: ${languageColor}"></span>
                        <span>${project.language || 'Other'}</span>
                    </div>
                    <div class="project-stats">
                        <span>⭐ ${stars}</span>
                        <span>🔱 ${forks}</span>
                    </div>
                </div>
            </div>
        `;
    };
    
    const fetchGitHubProjects = async () => {
        // Default fallback projects in case GitHub API fails
        const fallbackProjects = [
            {
                name: 'AI Exam Invigilation System',
                description: 'An AI-powered system for automated exam monitoring using computer vision and machine learning to detect cheating behavior.',
                html_url: 'https://github.com/livbedi2006',
                language: 'Python',
                stargazers_count: 0,
                forks_count: 0,
                fork: false
            },
            {
                name: 'Plagiarism Detector',
                description: 'NLP-based plagiarism detection system using TF-IDF and cosine similarity to identify similar content across documents.',
                html_url: 'https://github.com/livbedi2006',
                language: 'Python',
                stargazers_count: 0,
                forks_count: 0,
                fork: false
            },
            {
                name: 'Portfolio Website',
                description: 'Personal portfolio website with modern design, animations, and GitHub integration showcasing projects and skills.',
                html_url: 'https://github.com/livbedi2006',
                language: 'HTML',
                stargazers_count: 0,
                forks_count: 0,
                fork: false
            },
            {
                name: 'Netflix Clone',
                description: 'A Netflix-inspired streaming platform clone with cloud deployment on Google Cloud Platform and optimized UI.',
                html_url: 'https://github.com/livbedi2006',
                language: 'JavaScript',
                stargazers_count: 0,
                forks_count: 0,
                fork: false
            },
            {
                name: 'Telegram Bot',
                description: 'Interactive Telegram bot for automated responses and jokes, enhancing user engagement through AI features.',
                html_url: 'https://github.com/livbedi2006',
                language: 'Python',
                stargazers_count: 0,
                forks_count: 0,
                fork: false
            }
        ];
    
        if (!projectsGrid) {
            console.error('Projects grid not found');
            return;
        }
    
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
            
            if (!response.ok) {
                throw new Error('GitHub API request failed');
            }
            
            const projects = await response.json();
            
            // Filter out forked repos and profile readme
            const filteredProjects = projects.filter(project => 
                !project.fork && 
                project.name !== GITHUB_USERNAME
            );
            
            // If no projects from GitHub, use fallback
            const projectsToDisplay = filteredProjects.length > 0 ? filteredProjects : fallbackProjects;
            
            projectsGrid.innerHTML = projectsToDisplay.map(createProjectCard).join('');
            
            // Add animation to cards
            const cards = projectsGrid.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            // Use fallback projects on error
            projectsGrid.innerHTML = fallbackProjects.map(createProjectCard).join('');
            
            const cards = projectsGrid.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    };
    
    // Initialize Projects
    fetchGitHubProjects();
    
    // Project Filter Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const cards = projectsGrid.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Skill Bar Animation on Scroll
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillsObserver.observe(bar));
    
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.about-content, .about-visual, .skill-card, .contact-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    console.log('Portfolio initialized successfully!');
});