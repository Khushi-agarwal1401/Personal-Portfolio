document.addEventListener('DOMContentLoaded', () => {

    // ---- Light / Dark theme toggle ----
    // The pre-paint script in <head> already set the initial data-theme.
    const rootEl = document.documentElement;
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        rootEl.setAttribute('data-theme', theme);

        // The sun/moon icon visibility is handled purely in CSS;
        // here we only keep the accessible state in sync.
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.setAttribute('aria-pressed', String(isDark));
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        });

        if (themeMeta) themeMeta.setAttribute('content', isDark ? '#16161a' : '#a78bfa');

        // Keep the radar chart gradient stops in sync with the active palette
        refreshRadarGradients();
    }

    // Sync the toggle UI with whatever the pre-paint script decided
    applyTheme(rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    let themeSwitchTimer = null;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem('theme', next); } catch (e) { /* private mode etc. */ }

            // Cinematic cross-fade via the View Transitions API where available
            if (document.startViewTransition && !reducedMotionQuery.matches) {
                document.startViewTransition(() => applyTheme(next));
            } else {
                applyTheme(next);
                // Fallback: brief CSS cross-fade so colors don't snap
                rootEl.classList.add('theme-switching');
                clearTimeout(themeSwitchTimer);
                themeSwitchTimer = setTimeout(() => rootEl.classList.remove('theme-switching'), 350);
            }
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
                closeMobileMenu();
            }
        });
    });

    // ---- Mobile hamburger menu ----
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('header');

    function closeMobileMenu() {
        if (!navbar || !hamburger) return;
        navbar.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    if (hamburger && navbar) {
        hamburger.addEventListener('click', (e) => {
            const isOpen = navbar.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            // Keyboard activation (detail === 0): move focus into the menu
            if (isOpen && e.detail === 0) {
                const firstLink = navbar.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });

        // Close the menu when clicking anywhere outside the header
        document.addEventListener('click', (e) => {
            if (!header || !header.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close the menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    // ---- Scrollspy: highlight the nav link of the section in view ----
    const sectionIds = [...navLinks]
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.startsWith('#') && href.length > 1)
        .map(href => href.slice(1));
    const spySections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 140;
        let currentId = sectionIds[0];

        spySections.forEach((section, i) => {
            // Document-coordinate position (robust even with positioned ancestors)
            const docTop = section.getBoundingClientRect().top + window.pageYOffset;
            if (docTop <= scrollPos) {
                currentId = sectionIds[i];
            }
        });

        // If we've reached the very bottom, force the last section active
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 4) {
            currentId = sectionIds[sectionIds.length - 1];
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    // ---- Scroll-to-top button ----
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.setAttribute('id', 'scrollTopBtn');
    scrollTopBtn.setAttribute('aria-label', 'Scroll back to top');
    scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    let ticking = false;
    const onScroll = () => {
        // Compact navbar on scroll (only on pages that have one)
        if (header) header.classList.toggle('scrolled', window.pageYOffset > 60);

        scrollTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';

        // Coalesce scroll events into one measurement per frame (avoid layout thrash)
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                updateActiveNav();
                updateProgressBar();
                ticking = false;
            });
        }
    };

    // ---- Reading progress bar (JS fallback for browsers without scroll-driven animations) ----
    const progressBar = document.querySelector('.reading-progress');
    const supportsScrollTimeline = CSS.supports && CSS.supports('animation-timeline: scroll(root)');
    const updateProgressBar = () => {
        if (!progressBar || supportsScrollTimeline) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.pageYOffset / max) : 0;
        progressBar.style.transform = `scaleX(${p})`;
    };
    updateProgressBar();

    // ---- Magnetic hover effect (fine pointers only, respects reduced motion) ----
    if (window.matchMedia('(pointer: fine)').matches && !reducedMotionQuery.matches) {
        document.querySelectorAll('.magnetic').forEach(el => {
            let rafId = null;
            el.addEventListener('mousemove', (e) => {
                if (rafId) return;
                rafId = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const dx = e.clientX - rect.left - rect.width / 2;
                    const dy = e.clientY - rect.top - rect.height / 2;
                    el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
                    rafId = null;
                });
            });
            el.addEventListener('mouseleave', () => {
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                el.style.transform = '';
            });
        });
    }

    // ---- Skills Radar Charts (SVG hexagon charts with animated fill) ----
    const radarSkills = {
        tech: [['HTML', 72], ['CSS', 72], ['JavaScript', 70], ['Python', 48], ['MySQL', 48], ['C++', 45]],
        soft: [['Communication', 85], ['Teamwork', 80], ['Leadership', 75], ['Adaptability', 88], ['Problem Solving', 82], ['Curiosity', 90]]
    };
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // Point on a circle: angle measured from 12 o'clock, clockwise
    function radarVertex(cx, cy, r, index, count) {
        const angle = ((index * 360) / count - 90) * (Math.PI / 180);
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
    }

    function polygonPoints(cx, cy, r, count, values) {
        return values.map((v, i) => {
            const [x, y] = radarVertex(cx, cy, (r * v) / 100, i, count);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
    }

    function buildRadar(container, key) {
        const skills = radarSkills[key];
        const n = skills.length;
        const cx = 160, cy = 120, R = 76, labelR = 94; // viewBox 320x240

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 320 240');
        svg.setAttribute('aria-hidden', 'true');

        // Gradient def (stop colors refreshed on theme change)
        const defs = document.createElementNS(SVG_NS, 'defs');
        const grad = document.createElementNS(SVG_NS, 'linearGradient');
        grad.setAttribute('id', `radarGrad-${key}`);
        grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
        grad.setAttribute('x2', '1'); grad.setAttribute('y2', '1');
        grad.appendChild(document.createElementNS(SVG_NS, 'stop')).setAttribute('offset', '0%');
        grad.appendChild(document.createElementNS(SVG_NS, 'stop')).setAttribute('offset', '100%');
        defs.appendChild(grad);
        svg.appendChild(defs);

        const grid = document.createElementNS(SVG_NS, 'g');
        grid.setAttribute('class', 'radar-grid');

        // Concentric hexagon rings (25 / 50 / 75 / 100%)
        [0.25, 0.5, 0.75, 1].forEach((level) => {
            const ring = document.createElementNS(SVG_NS, 'polygon');
            ring.setAttribute('points', polygonPoints(cx, cy, R * level, n, Array(n).fill(100)));
            ring.setAttribute('class', 'radar-grid-line' + (level === 1 ? ' radar-ring-outer' : ''));
            grid.appendChild(ring);
        });

        // Axis spokes
        for (let i = 0; i < n; i++) {
            const [x, y] = radarVertex(cx, cy, R, i, n);
            const line = document.createElementNS(SVG_NS, 'line');
            line.setAttribute('x1', cx); line.setAttribute('y1', cy);
            line.setAttribute('x2', x.toFixed(1)); line.setAttribute('y2', y.toFixed(1));
            line.setAttribute('class', 'radar-axis');
            grid.appendChild(line);
        }

        // Data polygon: gradient fill + self-drawing outline
        const fill = document.createElementNS(SVG_NS, 'polygon');
        fill.setAttribute('class', 'radar-fill');
        fill.setAttribute('fill', `url(#radarGrad-${key})`);
        fill.setAttribute('fill-opacity', '0.4');
        fill.setAttribute('points', polygonPoints(cx, cy, R, n, skills.map(s => s[1])));

        const outline = document.createElementNS(SVG_NS, 'polygon');
        outline.setAttribute('class', 'radar-outline');
        outline.setAttribute('points', fill.getAttribute('points'));

        // Perimeter of the data polygon, used for the draw-on dash animation
        let perimeter = 0;
        for (let i = 0; i < n; i++) {
            const [x1, y1] = radarVertex(cx, cy, (R * skills[i][1]) / 100, i, n);
            const [x2, y2] = radarVertex(cx, cy, (R * skills[(i + 1) % n][1]) / 100, (i + 1) % n, n);
            perimeter += Math.hypot(x2 - x1, y2 - y1);
        }
        outline.style.setProperty('--dash', perimeter.toFixed(1));

        // Vertex dots (staggered pop-in via inline transition delay)
        skills.forEach((s, i) => {
            const [x, y] = radarVertex(cx, cy, (R * s[1]) / 100, i, n);
            const dot = document.createElementNS(SVG_NS, 'circle');
            dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
            dot.setAttribute('r', '4');
            dot.setAttribute('class', 'radar-dot');
            dot.style.transitionDelay = `${(0.45 + i * 0.09).toFixed(2)}s`;
            grid.appendChild(dot);
        });

        // Skill labels around the outside
        skills.forEach((s, i) => {
            const angle = ((i * 360) / n - 90) * (Math.PI / 180);
            const [x, y] = radarVertex(cx, cy, labelR, i, n);
            const cosA = Math.cos(angle), sinA = Math.sin(angle);
            const text = document.createElementNS(SVG_NS, 'text');
            text.setAttribute('class', 'radar-label');
            text.setAttribute('x', x.toFixed(1));
            text.setAttribute('y', y.toFixed(1));
            text.setAttribute('text-anchor', cosA > 0.35 ? 'start' : cosA < -0.35 ? 'end' : 'middle');
            // Push labels below/above the top/bottom vertices so they stay in the viewBox
            if (sinA < -0.6) text.setAttribute('dy', '12');
            else if (sinA > 0.6) text.setAttribute('dy', '-5');
            text.textContent = s[0];
            grid.appendChild(text);
        });

        grid.insertBefore(fill, grid.querySelector('.radar-dot') || null);
        grid.insertBefore(outline, grid.querySelector('.radar-dot') || null);
        svg.appendChild(grid);
        container.appendChild(svg);
    }

    // Re-read the --radar-a / --radar-b tokens so gradient stops follow the theme.
    // (JS-driven rather than CSS stop-color vars: older Safari doesn't re-render
    // CSS-variable gradient stops when the variable changes.)
    function refreshRadarGradients() {
        const styles = getComputedStyle(document.documentElement);
        const a = styles.getPropertyValue('--radar-a').trim() || '#a78bfa';
        const b = styles.getPropertyValue('--radar-b').trim() || '#f472b6';
        document.querySelectorAll('.radar-chart svg linearGradient').forEach((grad) => {
            const stops = grad.children;
            if (stops[0]) stops[0].setAttribute('stop-color', a);
            if (stops[1]) stops[1].setAttribute('stop-color', b);
        });
    }

    document.querySelectorAll('.radar-chart').forEach((chart) => {
        const key = chart.getAttribute('data-radar');
        if (key && radarSkills[key]) buildRadar(chart, key);
    });
    refreshRadarGradients();

    // ---- Hero typewriter (rotating roles, static first role for reduced motion) ----
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        const typedRoles = ['Web Developer', 'Problem Solver', 'Tech Entrepreneur', 'Future Innovator'];
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const typeStep = () => {
            const current = typedRoles[roleIndex];
            typewriter.textContent = current.slice(0, charIndex);

            let delay = deleting ? 45 : 90;
            if (!deleting) {
                if (charIndex < current.length) {
                    charIndex += 1;
                } else {
                    delay = 1800; // hold the completed role
                    deleting = true;
                }
            } else if (charIndex > 0) {
                charIndex -= 1;
            } else {
                delay = 400; // pause before the next role
                deleting = false;
                roleIndex = (roleIndex + 1) % typedRoles.length;
            }

            setTimeout(typeStep, delay);
        };

        if (reducedMotionQuery.matches) {
            typewriter.textContent = typedRoles[0];
        } else {
            typeStep();
        }
    }

    // ---- Footer year ----
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Set initial state (e.g. after refreshing mid-page)
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    // Scroll reveal animations for page sections & card grids
    const revealTargets = [...new Set([
        document.querySelector('#home'),
        ...document.querySelectorAll('.all'),
        ...document.querySelectorAll('.vision-info-card'),
        ...document.querySelectorAll('.why-vision'),
        ...document.querySelectorAll('.cards')
    ])].filter(Boolean);

    revealTargets.forEach(el => el.classList.add('section-hidden'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything immediately
        revealTargets.forEach(el => el.classList.add('fade-in'));
    }

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
