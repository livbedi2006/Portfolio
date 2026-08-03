// Portfolio JavaScript

// =========================================================
// LOADING SCREEN
// NOTE: The loading screen is dismissed by a CSS animation
// (loaderDismiss) as the PRIMARY mechanism. JS is a bonus.
// =========================================================

(function () {
    var screen  = document.getElementById('loadingScreen');
    var label   = document.getElementById('loaderPercent');
    var bar     = document.getElementById('loaderProgress');
    var term    = document.getElementById('terminalOutput');
    var done    = false;

    var messages = [
        "INITIALIZING KERNEL...",
        "MOUNTING FILE SYSTEMS...",
        "LOADING NEURAL NETWORKS...",
        "ESTABLISHING WEBGL CONTEXT...",
        "COMPILING SHADERS...",
        "RENDERING PARTICLES...",
        "SYSTEM READY."
    ];
    var msgIdx = 0;

    function hideNow() {
        if (done) return;
        done = true;
        if (screen) screen.classList.add('hidden');
        setTimeout(function () {
            if (screen) screen.style.display = 'none';
        }, 800); // Wait for curtains to slide apart
    }

    var pct = 0;
    var timer = setInterval(function () {
        pct += Math.random() * 4; // Random leaps for hacker feel
        if (pct > 100) pct = 100;
        
        if (label) label.textContent = Math.floor(pct) + '%';
        if (bar) bar.style.width = pct + '%';
        
        // Add terminal messages based on percentage
        if (pct > (msgIdx * (100 / messages.length)) && msgIdx < messages.length) {
            if (term) {
                var div = document.createElement('div');
                div.className = 'terminal-line';
                div.textContent = "> " + messages[msgIdx];
                term.appendChild(div);
                // Keep only last 4 lines
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
    }, 45);

    setTimeout(hideNow, 5000);
    window.addEventListener('load', function() {
        if (!done && pct > 80) {
            pct = 100;
        }
    });
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

    // ── Kinetic Cursor ───────────────────────────────────────────
    const cursorDot = document.getElementById('cursorDot');
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    let cursorReady = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!cursorReady) {
            cursorReady = true;
            document.body.classList.add('custom-cursor');
            if (cursorDot) cursorDot.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        }
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.6;
        cursorY += (mouseY - cursorY) * 0.6;
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        if (cursorDot) {
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        }
        if (cursorFollower) {
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor grows on hover over interactive elements
    var interactives = document.querySelectorAll(
        'a, button, .filter-btn, .skill-card, .project-card, .social-link, .contact-card, .tag, .bento-card'
    );
    interactives.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            if (cursorDot) cursorDot.classList.add('hovering');
            if (cursorFollower) cursorFollower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', function() {
            if (cursorDot) cursorDot.classList.remove('hovering');
            if (cursorFollower) cursorFollower.classList.remove('hovering');
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
            
            // Apply default active filter
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            if (activeFilterBtn) activeFilterBtn.click();
            
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            // Use fallback projects on error
            projectsGrid.innerHTML = fallbackProjects.map(createProjectCard).join('');
            
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            if (activeFilterBtn) activeFilterBtn.click();
        }
    };
    
    // Initialize Projects
    fetchGitHubProjects();
    
    // Project Filter & Coverflow Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentGalleryIndex = 0;
    let visibleCards = [];
    
    function updateGallery() {
        if (visibleCards.length === 0) return;
        
        visibleCards.forEach((card, index) => {
            card.className = 'project-card'; // Reset classes
            card.style.display = 'flex';
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease';
            
            if (index === currentGalleryIndex) {
                card.classList.add('active');
            } else if (index === currentGalleryIndex - 1) {
                card.classList.add('prev');
            } else if (index === currentGalleryIndex + 1) {
                card.classList.add('next');
            } else if (index < currentGalleryIndex - 1) {
                card.classList.add('prev-hidden');
            } else {
                card.classList.add('next-hidden');
            }
        });
    }

    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentGalleryIndex > 0) {
                currentGalleryIndex--;
                updateGallery();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentGalleryIndex < visibleCards.length - 1) {
                currentGalleryIndex++;
                updateGallery();
            }
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const allCards = projectsGrid.querySelectorAll('.project-card');
            
            visibleCards = Array.from(allCards).filter(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    return true;
                } else {
                    card.style.display = 'none';
                    card.className = 'project-card';
                    return false;
                }
            });
            
            currentGalleryIndex = 0;
            updateGallery();
        });
    });
    
    // Skill Bar Animation on Scroll
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
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

    // Bento Card Glow Effect
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.about-content, .about-visual, .skill-card, .contact-card');
    
    const revealElementsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                revealElementsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealElementsObserver.observe(el));
    
    // Typing Effect for Hero Section
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".typing-cursor");

    if(typedTextSpan && cursorSpan) {
        const textArray = ["Livjot Singh", "Machine Learning\n  Developer", "AI Engineer"];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } 
            else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } 
            else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if(textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }

        if(textArray.length) setTimeout(type, newTextDelay + 250);
    }
    
    console.log('Portfolio initialized successfully!');
});