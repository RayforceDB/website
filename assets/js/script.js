/**
 * RayforceDB Website JavaScript
 * Handles interactivity: tabs, copy buttons, navigation, and animations
 */

// Store fetched GitHub stars for use across the site
let githubStarsCache = {};

document.addEventListener('DOMContentLoaded', () => {
    initCodeTabs();
    initCopyButtons();
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    fetchGitHubStars().then(() => {
        initTypewriter();
    });
});

/**
 * Code Tab Switching
 */
function initCodeTabs() {
    const tabs = document.querySelectorAll('.code-tab');
    const panels = document.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.dataset.panel === targetPanel) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Copy to Clipboard Functionality
 */
function initCopyButtons() {
    // Copy buttons in code blocks
    const codeButtons = document.querySelectorAll('.code-copy');
    codeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeBlock = button.closest('.code-block');
            const code = codeBlock.querySelector('pre code').innerText;
            await copyToClipboard(code, button);
        });
    });

    // Install command copy button
    const installCopy = document.querySelector('.install-copy');
    if (installCopy) {
        installCopy.addEventListener('click', async () => {
            const cmd = document.querySelector('.install-cmd').innerText;
            await copyToClipboard(cmd, installCopy);
        });
    }
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalContent = button.innerHTML;
        button.innerHTML = button.classList.contains('install-copy') 
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>`
            : 'Copied!';
        button.style.color = '#4ADE80';
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.color = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle || !navLinks) return;

    // Create mobile nav container
    const mobileNav = document.createElement('div');
    mobileNav.className = 'nav-mobile';
    mobileNav.innerHTML = navLinks.innerHTML;
    document.querySelector('.nav').appendChild(mobileNav);

    // Add styles for mobile nav
    const style = document.createElement('style');
    style.textContent = `
        .nav-mobile {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 14, 23, 0.98);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(27, 54, 93, 0.3);
            padding: 1rem 2rem 2rem;
            flex-direction: column;
            gap: 0.5rem;
        }
        .nav-mobile.active {
            display: flex;
        }
        .nav-mobile a {
            padding: 0.75rem 0;
            font-size: 1rem;
            color: var(--text-secondary);
            border-bottom: 1px solid rgba(27, 54, 93, 0.3);
        }
        .nav-mobile a:last-child {
            border-bottom: none;
            margin-top: 0.5rem;
        }
        .nav-mobile-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .nav-mobile-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .nav-mobile-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-triggered Animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .animate-on-scroll:nth-child(1) { transition-delay: 0ms; }
        .animate-on-scroll:nth-child(2) { transition-delay: 100ms; }
        .animate-on-scroll:nth-child(3) { transition-delay: 200ms; }
        .animate-on-scroll:nth-child(4) { transition-delay: 300ms; }
        .animate-on-scroll:nth-child(5) { transition-delay: 400ms; }
        .animate-on-scroll:nth-child(6) { transition-delay: 500ms; }
    `;
    document.head.appendChild(style);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .ecosystem-card, .testimonial-card, .section-header'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Navigation Background on Scroll
 */
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 14, 23, 0.95)';
    } else {
        nav.style.background = 'rgba(10, 14, 23, 0.8)';
    }
    
    lastScroll = currentScroll;
});

/**
 * Fetch GitHub stars for all repositories
 */
async function fetchGitHubStars() {
    const repos = [
        'RayforceDB/rayforce',
        'RayforceDB/rayforce-py',
        'RayforceDB/rayforce-rs',
        'RayforceDB/rayforce-vscode',
        'RayforceDB/rayforce-wasm'
    ];

    const fetchPromises = repos.map(async (repo) => {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (response.ok) {
                const data = await response.json();
                githubStarsCache[repo] = data.stargazers_count;
                
                // Update all elements with this repo's stars
                const elements = document.querySelectorAll(`.github-stars[data-repo="${repo}"]`);
                elements.forEach(el => {
                    el.textContent = data.stargazers_count;
                });
            }
        } catch (error) {
            console.warn(`Failed to fetch stars for ${repo}:`, error);
        }
    });

    await Promise.all(fetchPromises);
}

/**
 * Get total stars across all repos
 */
function getTotalStars() {
    return Object.values(githubStarsCache).reduce((sum, stars) => sum + (stars || 0), 0);
}

/**
 * Typewriter effect for hero section
 */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const phrases = [
        'Executable size: <1MB',
        'Written in pure C',
        'Zero external dependencies',
        'Cross-platform: Linux, macOS, Windows',
        'Runs in browser via WebAssembly',
        'LISP-like query syntax',
        'MIT Licensed & Open Source',
        'Fits entirely in CPU cache',
        'Built for financial markets'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const typeSpeed = 50;      // Speed of typing
    const deleteSpeed = 30;    // Speed of deleting
    const pauseTime = 2000;    // Time to pause after typing
    const pauseBeforeDelete = 1500;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isPaused) {
            setTimeout(type, pauseTime);
            isPaused = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            // Deleting characters
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500);
                return;
            }
        } else {
            // Typing characters
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isPaused = true;
                setTimeout(type, pauseBeforeDelete);
                return;
            }
        }

        const speed = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(type, speed);
    }

    // Start the typewriter effect
    setTimeout(type, 1000);
}

