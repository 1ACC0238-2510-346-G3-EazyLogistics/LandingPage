document.addEventListener('DOMContentLoaded', function () {

    // --- Smooth scrolling for navigation links ---
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Calculate position, considering the sticky header height
                    const header = document.getElementById('main-header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10; // 10px buffer

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Header shadow on scroll ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Scroll animations for sections ---
    const animatedSections = document.querySelectorAll('.scroll-animate');
    const animatedChildren = document.querySelectorAll('.scroll-animate-child');

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve after animation if you want it to run only once
                // observer.unobserve(entry.target);
            } else {
                // Optional: remove class if you want animation to repeat on scroll up/down
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Separate observer for children if they need different trigger/threshold or to ensure parent is visible first
    // For simplicity, using the same observer. Can be refined if complex staggering is needed.
    animatedChildren.forEach(child => {
        sectionObserver.observe(child); // Re-use the same observer
    });


    // --- Active navigation link highlighting on scroll ---
    const sectionsForNav = document.querySelectorAll('section[id]'); // Get all sections with an ID
    if (sectionsForNav.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', navHighlighter);

        function navHighlighter() {
            let scrollY = window.pageYOffset;
            const headerHeight = header ? header.offsetHeight : 0;

            sectionsForNav.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - headerHeight - 50; // Adjusted for header and buffer
                let sectionId = current.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('nav a[href*=' + sectionId + ']').classList.add('active');
                } else {
                    document.querySelector('nav a[href*=' + sectionId + ']').classList.remove('active');
                }
            });

            // Special case for top of page (Home)
            const homeLink = document.querySelector('nav a[href="#home"]');
            if (homeLink) {
                if (scrollY < sectionsForNav[0].offsetTop - headerHeight - 50) {
                    // Remove active from all
                    navLinks.forEach(link => link.classList.remove('active'));
                    homeLink.classList.add('active');
                } else if (scrollY === 0 && sectionsForNav[0].id !== 'home') {
                    // If scrolled to top and first section isn't home, make home active
                    navLinks.forEach(link => link.classList.remove('active'));
                    homeLink.classList.add('active');
                }
            }
        }
        navHighlighter(); // Call once on load
    }

});