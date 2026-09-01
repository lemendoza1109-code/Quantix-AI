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
    document.querySelectorAll('a[href^="#"]:not(#open-form-btn)').forEach(anchor => {
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
                } else if (text.includes('-30%')) {
                    animateValue(element, 0, 30, 2000, '%', '-');
                } else if (text.includes('+25%')) {
                    animateValue(element, 0, 25, 2000, '%', '+');
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

    // Lead form modal
    const WEBHOOK_URL = 'https://eduardo555.app.n8n.cloud/webhook/quantix-lead-form';
    const overlay = document.getElementById('form-modal-overlay');
    const openBtn = document.getElementById('open-form-btn');
    const closeBtn = document.getElementById('close-form-btn');
    const form = document.getElementById('lead-form');
    const submitBtn = document.getElementById('lead-form-submit');
    const statusEl = document.getElementById('lead-form-status');

    function openModal(e) {
        if (e) e.preventDefault();
        statusEl.textContent = '';
        statusEl.className = 'form-status';
        overlay.classList.add('open');
        overlay.scrollTop = 0;
        const modal = overlay.querySelector('.form-modal');
        if (modal) modal.scrollTop = 0;
    }

    function closeModal() {
        overlay.classList.remove('open');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            statusEl.textContent = '';
            statusEl.className = 'form-status';

            const data = Object.fromEntries(new FormData(form).entries());

            try {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                statusEl.textContent = '¡Gracias! Te contactaremos muy pronto.';
                statusEl.className = 'form-status success';
                form.reset();
                setTimeout(closeModal, 2000);
            } catch (err) {
                statusEl.textContent = 'Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.';
                statusEl.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar';
            }
        });
    }
});
