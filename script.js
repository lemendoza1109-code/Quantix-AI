// Intersection Observer for fade-up animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Counter animation for stat numbers
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.innerText;
                if(text.includes('10x')) {
                    animateValue(element, 0, 10, 2000, 'x');
                } else if (text.includes('98%')) {
                    animateValue(element, 0, 98, 2000, '%');
                } else if (text.includes('+40%')) {
                    animateValue(element, 0, 40, 2000, '%', '+');
                }
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    function animateValue(obj, start, end, duration, suffix = '', prefix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            
            obj.innerHTML = prefix + Math.floor(easeOutProgress * (end - start) + start) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
