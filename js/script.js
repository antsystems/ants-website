// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS-like animations
    initAnimations();
    
    // Initialize countdown timer
    initCountdown();
    
    // Initialize FAQ toggles
    initFaqToggles();
    
    // Initialize sticky header
    initStickyHeader();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize contact form (if on contact page)
    if (document.getElementById('contact-form')) {
        initContactForm();
    }
});

// Initialize AOS-like animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Set up IntersectionObserver to detect when elements enter the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each animated element
    animatedElements.forEach(el => {
        observer.observe(el);
        
        // Add delay if specified
        if (el.dataset.aosDelay) {
            el.style.transitionDelay = `${el.dataset.aosDelay}ms`;
        }
    });
}

// Initialize countdown timer
function initCountdown() {
    const countdownTimer = document.getElementById('countdown-timer');
    if (!countdownTimer) return;
    
    // Set the launch date - 45 days from now
    const now = new Date();
    const launchDate = new Date();
    launchDate.setDate(now.getDate() + 45);
    launchDate.setHours(0, 0, 0, 0);
    
    // Update the countdown
    function updateCountdown() {
        const currentTime = new Date();
        const difference = launchDate - currentTime;
        
        // If the countdown is over
        if (difference <= 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }
        
        // Calculate time remaining
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update the DOM
        document.getElementById('days').innerText = days < 10 ? `0${days}` : days;
        document.getElementById('hours').innerText = hours < 10 ? `0${hours}` : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? `0${minutes}` : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? `0${seconds}` : seconds;
    }
    
    // Update the countdown initially and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize FAQ toggles
function initFaqToggles() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const toggleIcon = otherItem.querySelector('.toggle-icon');
                    toggleIcon.textContent = '+';
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
            const toggleIcon = item.querySelector('.toggle-icon');
            toggleIcon.textContent = item.classList.contains('active') ? '-' : '+';
        });
    });
}

// Initialize sticky header
function initStickyHeader() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    const navContainer = document.querySelector('nav');
    const navMenu = document.querySelector('nav ul');
    
    // Add the mobile menu toggle button to the header
    header.querySelector('.container').insertBefore(mobileMenuToggle, navContainer);
    
    // Toggle mobile menu when clicked
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Toggle menu icon (X or hamburger)
        mobileMenuToggle.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (document.body.classList.contains('menu-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when a menu item is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicked outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// Initialize contact form
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        // Prevent default form submission for AJAX handling
        e.preventDefault();
        
        // Show loading state on button
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Submit form with fetch API
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success notification
                showNotification('success', 'Thank you for your message! We will get back to you soon.');
                form.reset();
            } else {
                // Show error notification
                response.json().then(data => {
                    if (data.errors) {
                        showNotification('error', 'Oops! There was a problem: ' + data.errors.map(error => error.message).join(', '));
                    } else {
                        showNotification('error', 'Oops! There was a problem submitting your form. Please try again later.');
                    }
                });
            }
        })
        .catch(error => {
            showNotification('error', 'Oops! There was a network error. Please try again later.');
            console.error(error);
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
}

// Show notification function
function showNotification(type, message, duration = 5000) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon based on notification type
    let icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            ${message}
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification with a slight delay for transition effect
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add click event to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-close after duration
    if (duration) {
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    }
}

// Close notification function
function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 500); // Wait for transition to complete
} 