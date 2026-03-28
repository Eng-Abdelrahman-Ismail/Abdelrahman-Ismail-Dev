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

    // --- Smooth Scroll Navigation ---
    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const navList = document.querySelector('.navbar ul');
    const header = document.querySelector('.header');
    const sections = Array.from(document.querySelectorAll('.section-content[id]'));
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getHeaderOffset = () => {
        const headerHeight = header ? header.offsetHeight : 0;
        return Math.max(110, headerHeight + 18);
    };

    const syncHeaderOffset = () => {
        document.documentElement.style.setProperty('--header-offset', `${getHeaderOffset()}px`);
    };

    const setActiveNav = (sectionId) => {
        navLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const setActiveSection = (sectionId) => {
        sections.forEach((section) => {
            section.classList.toggle('active-section', section.id === sectionId);
        });
    };

    const scrollToSection = (sectionId, updateHash = true) => {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            return;
        }

        const top = targetSection.getBoundingClientRect().top + window.scrollY - getHeaderOffset() + 12;
        window.scrollTo({
            top: Math.max(0, top),
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        setActiveNav(sectionId);
        setActiveSection(sectionId);

        if (updateHash && history.pushState) {
            history.pushState(null, '', `#${sectionId}`);
        }
    };

    const updateSectionTracking = () => {
        if (!sections.length) {
            return;
        }

        const checkpoint = window.scrollY + getHeaderOffset() + (window.innerHeight * 0.18);
        let currentSectionId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= checkpoint) {
                currentSectionId = section.id;
            }
        });

        setActiveNav(currentSectionId);
        setActiveSection(currentSectionId);
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                return;
            }

            event.preventDefault();
            scrollToSection(href.substring(1));
        });
    });

    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                });
            }, {
                threshold: 0.16,
                rootMargin: '0px 0px -12% 0px'
            });

            revealElements.forEach((element) => revealObserver.observe(element));
        } else {
            revealElements.forEach((element) => element.classList.add('active'));
        }
    }

    const resetNavScrollStart = () => {
        if (!navList || window.innerWidth > 767) {
            return;
        }
        navList.scrollLeft = 0;
    };

    syncHeaderOffset();
    resetNavScrollStart();
    updateSectionTracking();

    const initialHash = window.location.hash ? decodeURIComponent(window.location.hash.substring(1)) : '';
    if (initialHash && document.getElementById(initialHash)) {
        setTimeout(() => scrollToSection(initialHash, false), 80);
    }

    window.addEventListener('resize', () => {
        syncHeaderOffset();
        resetNavScrollStart();
        updateSectionTracking();
    });

    window.addEventListener('load', syncHeaderOffset, { once: true });
    window.addEventListener('scroll', updateSectionTracking, { passive: true });
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash ? decodeURIComponent(window.location.hash.substring(1)) : '';
        if (hash && document.getElementById(hash)) {
            scrollToSection(hash, false);
        }
    });


    // --- Lightbox Logic (Certificates + Zoom) ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-lightbox');
        const certImageBoxes = document.querySelectorAll('.cert-img-box');
        const controlButtons = lightbox.querySelectorAll('.lightbox-btn');
        const certCards = document.querySelectorAll('.certificate-card');

        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        const minScale = 1;
        const maxScale = 3;

        const applyTransform = () => {
            if (!lightboxImg) return;
            lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        };

        const resetTransform = () => {
            scale = 1;
            translateX = 0;
            translateY = 0;
            applyTransform();
        };

        const zoomBy = (delta) => {
            scale = Math.min(maxScale, Math.max(minScale, scale + delta));
            applyTransform();
        };

        const openLightboxWithImage = (img) => {
            if (!img || !lightboxImg) return;
            lightbox.style.display = "flex";
            lightbox.setAttribute('aria-hidden', 'false');
            setTimeout(() => lightbox.classList.add('active'), 10);
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Certificate preview';
            resetTransform();
        };

        certImageBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const img = box.querySelector('img');
                if (img) openLightboxWithImage(img);
            });
        });

        certCards.forEach(card => {
            const info = card.querySelector('.certificate-info');
            if (!info) return;
            let viewBtn = info.querySelector('.cert-view-btn');
            if (!viewBtn) {
                viewBtn = document.createElement('button');
                viewBtn.type = 'button';
                viewBtn.className = 'cert-view-btn';
                viewBtn.textContent = 'VIEW CERTIFICATE';
                const tag = info.querySelector('.cert-tag');
                if (tag) {
                    info.insertBefore(viewBtn, tag);
                } else {
                    info.appendChild(viewBtn);
                }
            }
            viewBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const img = card.querySelector('.cert-img-box img');
                if (img) openLightboxWithImage(img);
            });
        });

        controlButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                if (action === 'zoom-in') zoomBy(0.2);
                if (action === 'zoom-out') zoomBy(-0.2);
                if (action === 'reset') resetTransform();
            });
        });

        if (lightboxImg) {
            lightboxImg.addEventListener('wheel', (e) => {
                e.preventDefault();
                zoomBy(e.deltaY < 0 ? 0.12 : -0.12);
            });

            lightboxImg.addEventListener('pointerdown', (e) => {
                if (scale <= 1) return;
                isDragging = true;
                lightbox.classList.add('dragging');
                dragStartX = e.clientX - translateX;
                dragStartY = e.clientY - translateY;
                lightboxImg.setPointerCapture(e.pointerId);
            });

            lightboxImg.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                translateX = e.clientX - dragStartX;
                translateY = e.clientY - dragStartY;
                applyTransform();
            });

            const endDrag = () => {
                isDragging = false;
                lightbox.classList.remove('dragging');
            };

            lightboxImg.addEventListener('pointerup', endDrag);
            lightboxImg.addEventListener('pointercancel', endDrag);
        }

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
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
