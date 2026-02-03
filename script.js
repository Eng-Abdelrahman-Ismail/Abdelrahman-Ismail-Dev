document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Particles.js (From Reference) ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#00d2ff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00d2ff", "opacity": 0.2, "width": 1 },
                // Slower speed for "Premium" feel
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    }

    // --- Tab Switching Logic (From Reference) ---
    // Matches the behavior of the live site: https://eng-abdelrahman-ismail.github.io/
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');

    const showSection = (sectionId) => {
        // 1. Hide all sections
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.style.display = 'none'; // Force hide
        });

        // 2. Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Use setTimeout to allow display:block to apply before animation
            setTimeout(() => {
                targetSection.classList.add('active-section');

                // Trigger reveal animations inside this section
                const reveals = targetSection.querySelectorAll('.reveal, .reveal-left, .reveal-right');
                reveals.forEach(el => el.classList.add('active'));
            }, 10);
        }

        // 3. Update active state in navbar
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // 4. Scroll to top
        window.scrollTo(0, 0);
    };

    // Add click event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Show 'home' by default
    showSection('home');


    // --- Lightbox Logic (From Reference) ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-lightbox');
        const certImageBoxes = document.querySelectorAll('.cert-img-box');

        certImageBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const img = box.querySelector('img');
                if (img) {
                    lightbox.style.display = "flex";
                    setTimeout(() => lightbox.classList.add('active'), 10);
                    lightboxImg.src = img.src;
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = "none";
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- Counter Animation (For Resume/Stats) ---
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observerOptions = { threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const speed = 200;
                    const increment = target / speed;

                    const updateCount = () => {
                        const count = +counter.innerText;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + increment);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);
        counters.forEach(c => observer.observe(c));
    }

    // --- Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');

    if (cursor && cursorDot) {
        const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;

        if (supportsFinePointer) {
            document.body.classList.add('custom-cursor-enabled');

            let cursorVisible = false;
            const setCursorPosition = (x, y) => {
                cursor.style.left = `${x}px`;
                cursor.style.top = `${y}px`;
                cursorDot.style.left = `${x}px`;
                cursorDot.style.top = `${y}px`;
            };

            const showCursor = () => {
                if (!cursorVisible) {
                    cursorVisible = true;
                    cursor.style.opacity = '1';
                    cursorDot.style.opacity = '1';
                }
            };

            document.addEventListener('pointermove', (event) => {
                if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
                    return;
                }
                showCursor();
                setCursorPosition(event.clientX, event.clientY);
            });

            document.addEventListener('pointerleave', () => {
                cursor.style.opacity = '0';
                cursorDot.style.opacity = '0';
                cursorVisible = false;
                document.body.classList.remove('hovering');
            });

            const hoverSelector = 'a, button, .clickable, .magnetic-button, .nav-link, .featured-project-card-new, .premium-project-card, .tool-card';
            document.addEventListener('pointerover', (event) => {
                const target = event.target;
                if (target && target.closest(hoverSelector)) {
                    document.body.classList.add('hovering');
                }
            });

            document.addEventListener('pointerout', (event) => {
                const target = event.target;
                if (!target || !target.closest(hoverSelector)) {
                    return;
                }
                if (event.relatedTarget && event.relatedTarget.closest(hoverSelector)) {
                    return;
                }
                document.body.classList.remove('hovering');
            });
        } else {
            cursor.style.display = 'none';
            cursorDot.style.display = 'none';
        }
    }
});
