document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio Loaded Successfully!');

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Removed custom Form Submission Handler to allow formsubmit.co to handle it naturally.

    // Add a simple scroll-to-top button feature directly via JS (creating element)
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('id', 'scrollTopBtn');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: none;
        background: #245fff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 1000;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(scrollTopBtn);

    const header = document.querySelector('header');

    const onScroll = () => {
        // Compact navbar on scroll
        header.classList.toggle('scrolled', window.pageYOffset > 60);

        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    };

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
