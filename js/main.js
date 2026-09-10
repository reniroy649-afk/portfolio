/* ==========================================================================
   RENI ROY - PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Custom Cursor Follower
    initCustomCursor();

    // 2. Initialize Hero Dynamic Typewriter
    initTypewriter();

    // 3. Initialize Navbar Scroll Listener & Mobile Menu
    initNavigation();

    // 4. Render & Filter Portfolio Cards
    renderPortfolioCards('all');
    initPortfolioFilters();

    // 5. Initialize Case Study Modal Controller
    initModalController();

    // 6. Initialize Skills Tabs & Matrix
    initSkillsTabs();

    // 7. Initialize Scroll Reveal Observer
    initScrollReveal();

    // 8. Initialize Contact Form & Scroll Top
    initContactAndFooter();

    // 9. Initialize Lightbox Image Viewer
    initImageViewer();

    // 10. Check URL params for direct project deep-linking
    checkUrlParams();
});

/* Custom Cursor Follower */
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    if (!cursorDot || !cursorCircle) return;

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function animateCircle() {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
        requestAnimationFrame(animateCircle);
    }
    animateCircle();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .glass-card, .filter-btn');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('hovering-link'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('hovering-link'));
    });
}

/* Typewriter Effect */
function initTypewriter() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = [
        'UI/UX & Interactive Interfaces',
        'Motion Graphics & Graphic Design',
        'Visual Design & Brand Storytelling'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 45;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2200; // Pause at full phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before typing new phrase
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 800);
}

/* Navigation & Mobile Drawer */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const toggleMobileMenu = () => {
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));
}

/* Portfolio Render & Filter */
/* Portfolio Render & Filter */
function renderPortfolioCards(filter = 'all') {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid || typeof projectsData === 'undefined') return;

    grid.innerHTML = '';

    const filteredProjects = filter === 'all'
        ? projectsData
        : projectsData.filter(p => p.category === filter);

    filteredProjects.forEach((project) => {
        const card = document.createElement('article');
        const isMotion = project.category === 'motion' || project.isMotionShowcase;
        card.className = `portfolio-card glass-card reveal active ${isMotion ? 'motion-featured-card' : ''}`;
        card.setAttribute('data-id', project.id);

        const motionIndicator = isMotion
            ? ``
            : '';

        card.innerHTML = `
            <div class="card-media">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                ${motionIndicator}
                <div class="card-overlay">
                    <span class="view-case-study-btn">
                        <i class="ph ${isMotion ? 'ph-play' : 'ph-eye'}"></i> ${isMotion ? 'View Project' : 'View Project'}
                    </span>
                </div>
            </div>
            <div class="card-info">
                <div class="card-meta">
                    <span class="card-category-tag">${project.categoryName}</span>
                    <span class="card-badge-pill">${project.badge}</span>
                </div>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-desc">${project.shortDesc}</p>
                <div class="card-tools">
                    ${project.tools.slice(0, 3).map(tool => `<span class="mini-tool-tag">${tool}</span>`).join('')}
                    ${project.tools.length > 3 ? `<span class="mini-tool-tag">+${project.tools.length - 3}</span>` : ''}
                </div>
            </div>
        `;

        card.addEventListener('click', () => openProjectModal(project.id));
        grid.appendChild(card);
    });
}

function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            renderPortfolioCards(filterValue);
        });
    });
}

/* Case Study Modal Controller */
function initModalController() {
    const overlay = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close-btn');

    if (!overlay) return;

    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjectModal);
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId || (p.aliases && p.aliases.includes(projectId)));
    if (!project) return;

    const overlay = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalContent');
    if (!overlay || !modalBody) return;

    const hasVideos = project.visuals && project.visuals.some(v => v.videoId || v.videoUrl || v.video);
    let mediaHTML = '';

    if (hasVideos) {
        const initialVideo = project.visuals[0];
        const initialVideoId = initialVideo.videoId || (initialVideo.video ? initialVideo.video.split('/').pop().split('?')[0] : '5KSvGKIOR2A');
        const initialVideoUrl = `https://www.youtube.com/embed/${initialVideoId}?autoplay=1&rel=0`;

        mediaHTML = `
            <div class="motion-theater-container">
                <!-- Main Theater Player Screen -->
                <div class="motion-player-wrapper">
                    <div class="player-glow-accent"></div>
                    <iframe id="activeMotionPlayer" 
                            src="${initialVideoUrl}" 
                            title="${initialVideo.title}" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen>
                    </iframe>
                </div>

                <!-- Active Video Details Bar -->
                <div class="active-video-details glass-card" id="activeVideoDetails">
                    <div class="active-video-info">
                        <div class="active-video-badge-row">
                            <span class="video-badge-pill" id="activeVideoBadge">${initialVideo.badge || 'Featured Reel'}</span>
                            <span class="video-tag-pill" id="activeVideoTag">${initialVideo.tag || 'Motion Graphics'}</span>
                        </div>
                        <h3 class="active-video-title" id="activeVideoTitle">${initialVideo.title}</h3>
                        <p class="active-video-desc" id="activeVideoDesc">${initialVideo.desc || ''}</p>
                        <div class="active-video-tools" id="activeVideoTools">
                            ${(initialVideo.tools || ['After Effects', 'Premiere Pro']).map(t => `<span class="mini-tool-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                    <a id="activeVideoYoutubeLink" href="https://www.youtube.com/watch?v=${initialVideoId}" target="_blank" class="btn btn-outline btn-watch-yt" aria-label="Watch on YouTube">
                        <i class="ph ph-youtube-logo"></i> Watch on YouTube
                    </a>
                </div>

                <!-- Interactive Playlist / Reel Selector -->
                <div class="motion-playlist-header">
                    <h4><i class="ph ph-film-strip"></i> Select Motion Reel (${project.visuals.length} Videos)</h4>
                    <span class="playlist-tip">Click any reel below to play instantly</span>
                </div>

                <div class="motion-playlist-grid">
                    ${project.visuals.map((v, idx) => {
            const vidId = v.videoId || (v.video ? v.video.split('/').pop().split('?')[0] : '');
            const isActive = idx === 0 ? 'active' : '';
            return `
                            <button class="playlist-card glass-card ${isActive}" data-video-id="${vidId}" data-index="${idx}" aria-label="Play ${v.title}">
                                <div class="playlist-card-badge">
                                    <span class="reel-number">0${idx + 1}</span>
                                    <span class="reel-tag">${v.badge || 'Reel'}</span>
                                </div>
                                <div class="playlist-card-content">
                                    <h5 class="playlist-card-title">${v.title}</h5>
                                    <p class="playlist-card-desc">${v.tag || ''}</p>
                                </div>
                                <div class="playlist-play-icon">
                                    <i class="ph-fill ph-play"></i>
                                </div>
                            </button>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    } else if (project.sections && project.sections.length > 0) {
        mediaHTML = `
            <div class="project-sections-container">
                ${project.sections.map(sec => `
                    <div class="project-details">
                        <div class="project-details-header">
                            <h3>${sec.title}</h3>
                            <span class="gallery-count-pill">${sec.items.length} ${sec.items.length === 1 ? 'Design' : 'Designs'}</span>
                        </div>
                        <div class="${sec.layout || 'grid-gallery'}">
                            ${sec.items.map(item => `
                                <img src="${item.img}" alt="${item.alt || item.title || 'Graphic Design'}" data-title="${item.title || sec.title}" loading="lazy" />
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (project.youtubeId) {
        mediaHTML = `
            <div class="modal-media-wrapper">
                <iframe src="https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0" 
                        title="${project.title}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
            </div>
        `;
    } else if (project.visuals && project.visuals.length > 0) {
        mediaHTML = `
            <div class="modal-gallery-grid">
                ${project.visuals.map(v => `
                    <div class="modal-gallery-item glass-card">
                        <img src="${v.img}" alt="${v.title || project.title}" data-title="${v.title || project.title}" loading="lazy">
                        ${v.title ? `<div class="gallery-caption">${v.title}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    let pipelineHTML = '';
    if (project.pipeline && project.pipeline.length > 0) {
        pipelineHTML = `
            <div class="modal-pipeline-section">
                <h4 class="pipeline-section-title"><i class="ph ph-git-commit"></i> Motion Production Pipeline</h4>
                <div class="pipeline-grid">
                    ${project.pipeline.map(step => `
                        <div class="pipeline-step-card glass-card">
                            <div class="pipeline-step-header">
                                <span class="pipeline-step-num">${step.step}</span>
                                <h5 class="pipeline-step-title">${step.title}</h5>
                            </div>
                            <p class="pipeline-step-desc">${step.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div class="modal-header-meta">
            <span class="modal-category">${project.categoryName} • ${project.badge}</span>
            <h2 class="modal-title">${project.title}</h2>
            <p class="modal-subtitle">${project.subtitle}</p>
        </div>

        ${mediaHTML}

        <div class="modal-body-content">
            <div class="modal-desc-col">
                <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--primary-cyan);">Project Overview</h3>
                <p style="font-size: 1rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 24px;">${project.fullDesc}</p>
                
                ${pipelineHTML}

                <h4 style="font-size: 1.15rem; margin-top: 30px; margin-bottom: 14px; color: #ffffff;">Key Highlights & Deliverables</h4>
                <ul class="modal-features-list">
                    ${project.features.map(f => `<li><i class="ph ph-check-circle"></i> ${f}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-specs-card glass-card">
                <div class="spec-group">
                    <div class="spec-label">Domain Category</div>
                    <div class="spec-value">${project.categoryName}</div>
                </div>
                <div class="spec-group" style="margin-top: 20px;">
                    <div class="spec-label">Tools & Software</div>
                    <div class="card-tools" style="margin-top: 8px;">
                        ${project.tools.map(t => `<span class="tag-chip" style="background: rgba(0, 242, 254, 0.1); border-color: rgba(0, 242, 254, 0.3); color: var(--primary-cyan); font-weight: 600;">${t}</span>`).join('')}
                    </div>
                </div>
                <div class="spec-group" style="margin-top: 20px;">
                    <div class="spec-label">Experience Context</div>
                    <div class="spec-value">Kyurius Tech Studios</div>
                </div>
                <div class="spec-group" style="margin-top: 20px;">
                    <div class="spec-label"></div>
                    <div class="spec-value"></div>
                </div>
            </div>
        </div>
    `;

    // Attach interactive video playlist switching if multi-video
    if (hasVideos) {
        const playlistCards = modalBody.querySelectorAll('.playlist-card');
        const iframePlayer = modalBody.querySelector('#activeMotionPlayer');
        const videoTitleEl = modalBody.querySelector('#activeVideoTitle');
        const videoBadgeEl = modalBody.querySelector('#activeVideoBadge');
        const videoTagEl = modalBody.querySelector('#activeVideoTag');
        const videoDescEl = modalBody.querySelector('#activeVideoDesc');
        const videoToolsEl = modalBody.querySelector('#activeVideoTools');
        const ytLinkEl = modalBody.querySelector('#activeVideoYoutubeLink');

        playlistCards.forEach(card => {
            card.addEventListener('click', () => {
                playlistCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const index = parseInt(card.getAttribute('data-index'), 10);
                const videoData = project.visuals[index];
                const vidId = card.getAttribute('data-video-id');

                if (iframePlayer) {
                    iframePlayer.src = `https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0`;
                }
                if (videoTitleEl) videoTitleEl.textContent = videoData.title;
                if (videoBadgeEl) videoBadgeEl.textContent = videoData.badge || 'Reel';
                if (videoTagEl) videoTagEl.textContent = videoData.tag || 'Motion Graphics';
                if (videoDescEl) videoDescEl.textContent = videoData.desc || '';
                if (ytLinkEl) ytLinkEl.href = `https://www.youtube.com/watch?v=${vidId}`;
                if (videoToolsEl && videoData.tools) {
                    videoToolsEl.innerHTML = videoData.tools.map(t => `<span class="mini-tool-tag">${t}</span>`).join('');
                }
            });
        });
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const overlay = document.getElementById('projectModal');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Stop playing embedded videos when closing
    const modalBody = document.getElementById('modalContent');
    if (modalBody) {
        modalBody.innerHTML = '';
    }
}

/* Skills Matrix Interactive Switcher */
function initSkillsTabs() {
    const skillCards = document.querySelectorAll('.skill-category-card');
    const skillContainers = document.querySelectorAll('.skills-group-content');

    if (skillCards.length === 0) return;

    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            const groupTarget = card.getAttribute('data-skill-group');
            skillCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            skillContainers.forEach(container => {
                if (container.id === groupTarget || groupTarget === 'all-skills') {
                    container.style.display = 'grid';
                } else {
                    container.style.display = 'none';
                }
            });
        });
    });
}

/* Intersection Observer Scroll Reveal */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/* Contact Form & Scroll Top Button */
function initContactAndFooter() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3500);
        });
    }

    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* Lightbox Image Viewer System */
function initImageViewer() {
    const viewer = document.getElementById('image-viewer');
    const fullImage = document.getElementById('full-image');
    const closeBtn = document.querySelector('#image-viewer .close');

    if (!viewer || !fullImage) return;

    // Delegated click handler on document for any .project-details img, .grid-gallery img, .grid-gallery2 img, .modal-gallery-item img
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'IMG' && (
            target.closest('.project-details') ||
            target.closest('.grid-gallery') ||
            target.closest('.grid-gallery2') ||
            target.closest('.character-gallery') ||
            target.closest('.game-ui-gallery') ||
            target.closest('.modal-gallery-item')
        )) {
            const src = target.getAttribute('src');
            const title = target.getAttribute('data-title') || target.getAttribute('alt') || '';
            fullImage.src = src;

            const captionEl = document.getElementById('image-viewer-caption');
            if (captionEl) {
                captionEl.textContent = title && title !== 'Poster Design' ? title : '';
            }

            viewer.classList.add('active');
            viewer.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    const closeViewer = () => {
        viewer.classList.remove('active');
        viewer.style.display = 'none';
        const projectModal = document.getElementById('projectModal');
        if (!projectModal || !projectModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeViewer);
    }

    viewer.addEventListener('click', (e) => {
        if (e.target === viewer || e.target === closeBtn) {
            closeViewer();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viewer.classList.contains('active')) {
            closeViewer();
            e.stopPropagation();
        }
    });
}

/* URL Parameter Deep-Linking */
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || urlParams.get('project');
    if (projectId) {
        setTimeout(() => {
            openProjectModal(projectId);
        }, 350);
    }
}

