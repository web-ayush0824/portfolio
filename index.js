// Navigation functionality
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const navLinkItems = document.querySelectorAll('.nav-link');

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Navbar scroll effect
let lastScroll = 0;
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update scroll progress bar
    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    }
    
    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavOnScroll);

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-category')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .info-card, .contact-method');
animateElements.forEach(el => observer.observe(el));

// Contact form handling — sends a real email via FormSubmit (no backend required)
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(contactForm);

    fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
    })
        .then((response) => {
            if (response.ok) {
                showNotification("Thanks! Your message has been sent — I'll get back to you soon.");
                contactForm.reset();
            } else {
                throw new Error('Request failed');
            }
        })
        .catch(() => {
            showNotification('Something went wrong sending your message. Please email me directly at ayush.soni.web@gmail.com.', true);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
});

// Notification system
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${isError ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Cursor trail effect (subtle)
let dots = [];
const maxDots = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        createDot(e.pageX, e.pageY);
    }
});

function createDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(249, 115, 22, 0.3);
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        z-index: 9999;
        animation: dotFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(dot);
    dots.push(dot);
    
    if (dots.length > maxDots) {
        const oldDot = dots.shift();
        oldDot.remove();
    }
    
    setTimeout(() => {
        dot.remove();
        dots = dots.filter(d => d !== dot);
    }, 1000);
}

// Add cursor dot animation
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes dotFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(cursorStyle);

// Project cards hover effect enhancement
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Code window typing animation
const codeContent = document.querySelector('.code-content code');
if (codeContent) {
    const originalContent = codeContent.innerHTML;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                codeContent.innerHTML = '';
                let i = 0;
                const interval = setInterval(() => {
                    if (i < originalContent.length) {
                        codeContent.innerHTML = originalContent.substring(0, i + 1);
                        i++;
                    } else {
                        clearInterval(interval);
                    }
                }, 20);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(codeContent);
}

// Stats counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// Animate stats when they come into view
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.match(/\d+/)[0]);
            animateCounter(entry.target, number);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// Lazy loading for images (if added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(activateNavOnScroll, 10));

// Accessibility: Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Focus trap for mobile menu
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const modal = document.getElementById('navLinks');

modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && modal.classList.contains('active')) {
        const focusable = modal.querySelectorAll(focusableElements);
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
});

// Add loading state to buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations
    document.body.classList.add('loaded');
    
    // Preload critical resources
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
});