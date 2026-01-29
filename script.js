document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Particles.js ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00d2ff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00d2ff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }

    // --- Tab Switching Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');

    // Function to show a section
    const showSection = (sectionId) => {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active-section');
        });

        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active-section');
        }

        // Update active state in navbar
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Scroll to the top of the page
        window.scrollTo(0, 0);
    };

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const sectionId = link.getAttribute('href').substring(1); // Get section ID from href
            showSection(sectionId);
        });
    });

    // Show the 'home' section by default on page load
    showSection('home');

    // --- Enhanced Animation Effects ---
    // Add hover effect listeners to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;

        item.addEventListener('mouseenter', () => {
            // Add extra glow effect
            item.style.filter = 'brightness(1.2)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.filter = 'brightness(1)';
        });
    });

    // Animate service cards on scroll
    // --- Enhanced Staggered Scroll Animation ---
    const staggeredObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const staggeredObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const index = target.getAttribute('data-index');
                // Add delay based on index for staggered effect
                target.style.transitionDelay = `${index * 0.1}s`;
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
                staggeredObserver.unobserve(target);
            }
        });
    }, staggeredObserverOptions);

    // Apply to Services, Projects, and Certificates
    const animatedCards = document.querySelectorAll('.service-card-new, .featured-project-card-new, .certificate-card, .contact-card');
    animatedCards.forEach((card, index) => {
        // Reset index for each section ideally, but global index works for flow too. 
        // Better: use relative index within parent.
        const parent = card.parentElement;
        const siblings = Array.from(parent.children).filter(c => c.classList.contains(card.classList[0])); // simple filter
        const relativeIndex = siblings.indexOf(card);

        card.setAttribute('data-index', relativeIndex !== -1 ? relativeIndex : index % 5);

        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        staggeredObserver.observe(card);
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn-featured-primary-new, .btn-featured-secondary-new').forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // --- Lightbox Logic ---
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
                    lightboxImg.src = img.src;
                    // Add entrance animation
                    lightboxImg.style.animation = 'none';
                    setTimeout(() => {
                        lightboxImg.style.animation = 'scaleAndRotate 0.4s ease-out';
                    }, 10);
                }
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = "none";
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Smooth Scroll for Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- Add Parallax Effect ---
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            heroImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        });
    }

    // --- Smart Attendance Card Special Effects ---
    const smartAttendanceCard = document.querySelector('.featured-project-standalone:nth-of-type(2) .featured-project-card-new');
    if (smartAttendanceCard) {
        smartAttendanceCard.addEventListener('mouseenter', () => {
            const img = smartAttendanceCard.querySelector('img');
            if (img) {
                img.style.filter = 'drop-shadow(0 0 25px rgba(0, 200, 255, 0.8))';
            }
        });

        smartAttendanceCard.addEventListener('mouseleave', () => {
            const img = smartAttendanceCard.querySelector('img');
            if (img) {
                img.style.filter = 'drop-shadow(0 0 10px rgba(0, 150, 255, 0.3))';
            }
        });
    }

    // --- Page Load Animation ---
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // --- Vanilla Tilt Initialization ---
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".certificate-card, .featured-project-card-new, .service-card-new, .stat-card, .contact-card, .experience-card, .product-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }

    // --- Custom Cursor Logic ---
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .card, .btn, .nav-link, .featured-project-card-new, .certificate-card, .service-card-new').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-hover');
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, revealOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- Magnetic Buttons Effect ---
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            // Adjust the strength of the magnetism
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Project Preview Modal Logic ---
    window.openProjectPreview = (title, desc, imgSrc, videoSrc, pdfLink, videoLink, btn1Label, btn2Label) => {
        const modal = document.getElementById('project-preview-modal');
        const modalImg = document.getElementById('project-modal-img');
        const modalVideo = document.getElementById('project-modal-video');
        const modalTitle = document.getElementById('project-modal-title');
        const modalDesc = document.getElementById('project-modal-desc');
        const modalActions = document.getElementById('project-modal-actions');

        // Set Content
        modalTitle.textContent = title;
        modalDesc.textContent = desc;

        // Handle Media
        if (videoSrc) {
            modalImg.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.src = videoSrc;
        } else {
            modalVideo.style.display = 'none';
            modalVideo.pause();
            modalImg.style.display = 'block';
            modalImg.src = imgSrc || 'assets/images/default-project.jpg';
        }

        // Generate Buttons
        modalActions.innerHTML = ''; // Clear previous

        if (pdfLink) {
            const btn = document.createElement('a');
            btn.href = pdfLink;
            btn.target = "_blank";
            btn.className = "btn-featured-secondary-new magnetic-button";
            btn.innerHTML = `<i class="fas fa-file-pdf"></i> ${btn1Label || 'View Report'}`;
            modalActions.appendChild(btn);
        }

        if (videoLink) { // External video link or alternative action
            const btn = document.createElement('a');
            btn.href = videoLink;

            // Determine Label and Icon
            const label = btn2Label || (videoLink.toLowerCase().endsWith('.mp4') ? 'Download Video' : 'Watch Demo');
            let icon = 'fa-play';
            if (label.toLowerCase().includes('download')) icon = 'fa-download';
            else if (label.toLowerCase().includes('report')) icon = 'fa-file-alt';
            else if (label.toLowerCase().includes('presentation')) icon = 'fa-chart-line';

            if (label.toLowerCase().includes('download')) {
                btn.setAttribute('download', '');
            } else {
                btn.target = "_blank";
            }

            btn.className = "btn-featured-primary-new magnetic-button";
            btn.innerHTML = `<i class="fas ${icon}"></i> ${label}`;
            modalActions.appendChild(btn);
        }

        // Show Modal
        modal.style.display = 'flex';
        // Small delay for transition
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    };

    // Close Logic
    const projectModal = document.getElementById('project-preview-modal');
    if (projectModal) {
        const closeBtn = projectModal.querySelector('.project-modal-close');

        const closeProjectModal = () => {
            projectModal.classList.remove('show');
            const modalVideo = document.getElementById('project-modal-video');
            if (modalVideo) modalVideo.pause();

            setTimeout(() => {
                projectModal.style.display = 'none';
            }, 300);
        };

        closeBtn.addEventListener('click', closeProjectModal);
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    // --- Legacy Code Modal Logic (Restored) ---
    window.openCodeModal = () => {
        const modal = document.getElementById('codeModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    };

    window.closeCodeModal = () => {
        const modal = document.getElementById('codeModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    window.closeAdvancedCodeModal = () => {
        const modal = document.getElementById('advancedCodeModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Close on outside click for Code Modal
    const codeModal = document.getElementById('codeModal');
    if (codeModal) {
        codeModal.addEventListener('click', (e) => {
            if (e.target === codeModal) closeCodeModal();
        });
    }
});
