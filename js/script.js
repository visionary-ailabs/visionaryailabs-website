// Visionary AI Labs - Animation Logic

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initHeroAnimations();
    initParallax();
    initMetricsCounter();
    randomizeGoldLines(); // Randomize line positions on load
});

// 1. Scroll & View Animation System
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // If it's a section title, trigger the underline/reveal
                if (entry.target.classList.contains('section-title')) {
                    // Custom title logic if needed
                }
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        document.querySelector('.scroll-progress-bar').style.width = scrolled + "%";
    });
}

// 2. Hero Animations
function initHeroAnimations() {
    const letterGroups = document.querySelectorAll('.fade-letter-group');

    letterGroups.forEach((group, index) => {
        setTimeout(() => {
            group.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
            group.style.opacity = "1";
            group.style.transform = "translateY(0)";
        }, 300 + (index * 150)); // Staggered delay

        // Initial state set in JS to avoid FOUC if JS fails, 
        // normally handled in CSS but explicit control here for staggering
        group.style.opacity = "0";
        group.style.transform = "translateY(20px)";
        group.style.display = "inline-block";
        group.style.marginRight = "0.2em";
    });
}

// 3. Parallax Tilt (Simple version for Mockups)
function initParallax() {
    const cards = document.querySelectorAll('.app-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Rotate values
            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            const visual = card.querySelector('.app-visual');
            if (visual) {
                visual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            const visual = card.querySelector('.app-visual');
            if (visual) {
                visual.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            }
        });
    });
}

// 4. Metrics Counter
function initMetricsCounter() {
    const metrics = document.querySelectorAll('.metric-value.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Simple count up logic
                const target = parseFloat(entry.target.getAttribute('data-target'));
                if (target) {
                    animateValue(entry.target, 0, target, 2000);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(m => observer.observe(m));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Format based on standard (if decimal needed)
        const isDecimal = end % 1 !== 0;
        obj.innerHTML = isDecimal ? (progress * (end - start) + start).toFixed(1) : Math.floor(progress * (end - start) + start);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
