document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Parallax effect for hero section
    const parallaxBg = document.querySelector('.parallax-bg');
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        parallaxBg.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
    });

    // Animate categories on scroll
    const categoryCards = document.querySelectorAll('.category-card');
    function animateOnScroll() {
        categoryCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                const animationType = card.getAttribute('data-animation');
                card.classList.add('animate__' + animationType);
            }
        });
    }
    
    // Animate testimonials on scroll
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    function checkTestimonials() {
        testimonialCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                card.classList.add('visible');
            }
        });
    }
    
    // Initialize animations
    window.addEventListener('scroll', function() {
        animateOnScroll();
        checkTestimonials();
    });
    
    // Trigger animations on page load if elements are already in view
    animateOnScroll();
    checkTestimonials();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('#navbarNav');
    navbarToggler.addEventListener('click', function() {
        navbarNav.classList.toggle('show');
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarNav.classList.contains('show')) {
                navbarNav.classList.remove('show');
            }
        });
    });
});

