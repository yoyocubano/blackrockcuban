/* ========== BLACKROCKCUBAN PREMIUM VFX JS ========== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll-based Parallax & Variable tracking
    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
        
        // Parallax image
        const heroImg = document.querySelector('.hero-parallax');
        if (heroImg) {
            heroImg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
    });

    // 2. Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it's revealed, we can stop observing it if we want it to stay
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Optimized Mouse Trail (Desktop only)
    if (window.matchMedia('(min-width: 1024px)').matches) {
        let lastX = 0, lastY = 0;
        document.addEventListener('mousemove', (e) => {
            const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
            if (dist < 25) return; // Throttling for performance
            
            lastX = e.clientX; 
            lastY = e.clientY;

            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) particle.remove();
            }, 800);
        });
    }

    // 4. Typewriter Effect for Hero Hashtag
    const hashtag = document.querySelector('.neon-glow-red');
    if (hashtag) {
        const text = hashtag.textContent.trim();
        hashtag.textContent = '';
        hashtag.classList.add('typing');
        
        let i = 0;
        function type() {
            if (i < text.length) {
                hashtag.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        }
        
        // Start typing when section is in view or after a delay
        setTimeout(type, 1000);
    }

    // 5. 3D Tilt interaction enhancement (Optional: JS-based for more control)
    // Currently handled by CSS (.vfx-card)
});
