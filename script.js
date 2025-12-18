/**
 * RayforceDB Website JavaScript
 * Handles interactivity and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initCodeTabs();
    initCopyButtons();
    initScrollAnimations();
    initNavScroll();
});

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const nav = document.querySelector('.nav');
    const links = document.querySelector('.nav-links');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            toggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        if (links) {
            links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('nav-open');
                    toggle.classList.remove('active');
                });
            });
        }
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const nav = document.querySelector('.nav');
                const navHeight = nav ? nav.offsetHeight : 0;
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
 * Code tabs functionality
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
 * Copy to clipboard functionality
 */
function initCopyButtons() {
    // Install box copy button
    const installCopy = document.querySelector('.install-copy');
    if (installCopy) {
        installCopy.addEventListener('click', () => {
            const textToCopy = installCopy.dataset.copy || 'pip install rayforce';
            copyToClipboard(textToCopy, installCopy);
        });
    }

    // Code block copy buttons
    const codeCopyButtons = document.querySelectorAll('.code-copy');
    codeCopyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.code-block');
            if (codeBlock) {
                const code = codeBlock.querySelector('code');
                if (code) {
                    copyToClipboard(code.textContent, button);
                }
            }
        });
    });
}

/**
 * Copy text to clipboard with visual feedback
 */
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalContent = button.innerHTML;
        const originalText = button.textContent;

        // Show success feedback
        if (button.classList.contains('code-copy')) {
            button.textContent = 'Copied!';
        } else {
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
            `;
        }

        // Reset after 2 seconds
        setTimeout(() => {
            if (button.classList.contains('code-copy')) {
                button.textContent = originalText;
            } else {
                button.innerHTML = originalContent;
            }
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.highlight-card, .feature-card, .ecosystem-card, .testimonial-card, .community-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${(index % 6) * 0.1}s, transform 0.5s ease ${(index % 6) * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Navigation scroll effect
 */
function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Add visible class styles dynamically
 */
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
