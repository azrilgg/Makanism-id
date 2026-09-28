/* =============================
   Makanism ID - Script.js
   Powered by GSAP & Three.js
   ============================= */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initThreeJS();
    initAnimations();
    initMenuTabs();
    initStats();
    initNavbar();
    initContact3D();
    initPageTransitions();
    initSpecialModal();
    initReservation();
});

/* =============================
   LOADER & HERO ENHANCED
   ============================= */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    // Skip loader if we arrived via an internal page transition link
    if (sessionStorage.getItem('pageTransition') === 'true') {
        loader.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.style.overflowX = 'hidden';
        return;
    }

    const tl = gsap.timeline();
    const counter = document.getElementById('loader-count');
    const progressBar = document.querySelector('.loader-progress');

    document.body.style.overflow = 'hidden';

    let count = { val: 1 }; // Start from 1
    tl.to(count, {
        val: 100,
        duration: 3, // Slower duration to look at the process
        ease: 'power3.inOut',
        onUpdate: function () {
            if (counter) counter.innerHTML = Math.round(count.val);
        }
    })
    .to(progressBar, {
        width: '100%',
        duration: 3,
        ease: 'power3.inOut'
    }, '<') // Sync with counter
    .to('.loader-content', {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: 'power2.in'
    }, '+=0.3')
    .to('.loader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
            ScrollTrigger.refresh();
        }
    }, '-=0.1')
    .from('.hero-desc', {
        opacity: 0,
        y: 30,
        duration: 1
    }, '-=0.5')
    .from('.hero-btns', {
        opacity: 0,
        y: 30,
        duration: 1
    }, '-=0.7');
}

/* =============================
   CUSTOM CURSOR
   ============================= */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });

    const links = document.querySelectorAll('a, button, .menu-tab, .faq-question, .contact-card-3d');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 2.5,
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                borderColor: 'transparent',
                duration: 0.3
            });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: '#d4af37',
                duration: 0.3
            });
        });
    });
}

/* =============================
   THREE.JS BACKGROUND
   ============================= */
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xd4af37,
        transparent: true,
        opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 2;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.0008;
        particlesMesh.rotation.x += 0.0005;

        // Parallax Effect
        particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* =============================
   GSAP ANIMATIONS
   ============================= */
function initAnimations() {
    // Section Headers Reveal
    gsap.utils.toArray('.section-tag, .section-title').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out'
        });
    });

    // About/Story Parallax (only if the element exists)
    if (document.querySelector('.about-visual')) {
        gsap.to('.image-reveal img', {
            scrollTrigger: {
                trigger: '.about-visual',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: -100,
            ease: 'none'
        });
    }

    // Generic reveal for cards and list items
    gsap.utils.toArray('.detail-item, .phi-item, .blog-card, .special-card, .s-stat').forEach((box, i) => {
        gsap.from(box, {
            scrollTrigger: {
                trigger: box,
                start: 'top 95%',
            },
            opacity: 0,
            y: 30,
            duration: 1,
            delay: (i % 3) * 0.1,
            ease: 'power3.out'
        });
    });
}

/* =============================
   CONTACT 3D INTERACTION
   ============================= */
function initContact3D() {
    const card = document.querySelector('.contact-card-3d');
    const container = document.querySelector('.card-3d-wrapper');
    if (!card || !container) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    });

    container.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
        });
    });
}

/* =============================
   UTILITIES
   ============================= */
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const items = document.querySelectorAll('.menu-item-v2');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');
            items.forEach(item => {
                const cat = item.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    gsap.to(item, { scale: 1, opacity: 1, display: 'flex', duration: 0.4 });
                } else {
                    gsap.to(item, { scale: 0.9, opacity: 0, display: 'none', duration: 0.4 });
                }
            });
            ScrollTrigger.refresh();
        });
    });
}

function initStats() {
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = +stat.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: 'power2.out'
                });
            }
        });
    });
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const fsMenu = document.querySelector('.fs-menu');
    const fsLinks = document.querySelectorAll('.fs-link');
    const fsBg = document.getElementById('fsMenuBg');

    // Scroll class for navbar (only on pages that have .navbar)
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (!menuToggle || !fsMenu) return;

    let menuOpen = false;

    menuToggle.addEventListener('click', () => {
        menuOpen = !menuOpen;
        menuToggle.classList.toggle('active');
        
        const isMobile = window.innerWidth <= 992;

        if (menuOpen) {
            fsMenu.classList.add('active');
            gsap.to('.fs-nav-links a', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2
            });
            if (isMobile) {
                gsap.to('.fs-info', {
                    y: 0,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.4
                });
            } else {
                gsap.to('.fs-info', {
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.4
                });
            }
        } else {
            closeMenu();
        }
    });

    function closeMenu() {
        menuOpen = false;
        const isMobile = window.innerWidth <= 992;
        menuToggle.classList.remove('active');
        gsap.to('.fs-nav-links a', {
            y: 50,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.in'
        });
        if (isMobile) {
            gsap.to('.fs-info', {
                y: '100%',
                x: 0,
                duration: 0.6,
                ease: 'power3.in'
            });
        } else {
            gsap.to('.fs-info', {
                x: '100%',
                duration: 0.6,
                ease: 'power3.in'
            });
        }
        setTimeout(() => {
            fsMenu.classList.remove('active');
        }, 600);
    }

    fsLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const bg = link.getAttribute('data-bg');
            if (bg) {
                fsBg.style.opacity = 0;
                setTimeout(() => {
                    fsBg.src = bg;
                    fsBg.style.opacity = 0.15;
                }, 300);
            }
        });

        link.addEventListener('click', closeMenu);
    });

    // FAQ
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            q.parentElement.classList.toggle('active');
        });
    });
}

function initPageTransitions() {
    const links = document.querySelectorAll('.transition-link');
    const transitionEl = document.querySelector('.page-transition');
    const transitionLogo = document.querySelector('.page-transition-logo');

    if (!transitionEl || !transitionLogo) return;

    // --- OUTGOING: clicking a link triggers the curtain sweep ---
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.href;

            // Mark that we are doing a transition so the next page knows
            sessionStorage.setItem('pageTransition', 'true');

            gsap.set(transitionEl, { y: '100%' });
            const tl = gsap.timeline({
                onComplete: () => {
                    window.location.href = target;
                }
            });

            tl.to(transitionEl, {
                y: '0%',
                duration: 0.4,
                ease: 'power3.inOut'
            })
            .to(transitionLogo, {
                opacity: 1,
                duration: 0.15
            }, '-=0.15');
        });
    });

    // --- INCOMING: only play the reveal if we came from a transition ---
    const cameFromTransition = sessionStorage.getItem('pageTransition') === 'true';
    sessionStorage.removeItem('pageTransition');

    if (cameFromTransition) {
        // We arrived via a transition link — reveal the page
        gsap.set(transitionEl, { y: '0%' });
        gsap.set(transitionLogo, { opacity: 1 });

        const tl = gsap.timeline();
        tl.to(transitionLogo, {
            opacity: 0,
            duration: 0.15,
            delay: 0.05
        })
        .to(transitionEl, {
            y: '-100%',
            duration: 0.4,
            ease: 'power3.inOut'
        }, '-=0.05');
    } else {
        // Normal load / refresh — just hide it instantly, no animation
        gsap.set(transitionEl, { y: '-100%' });
        gsap.set(transitionLogo, { opacity: 0 });
    }
}

/* =============================
   SPECIAL MODAL DATA & LOGIC
   ============================= */
function initSpecialModal() {
    const specialData = {
        wagyu: {
            title: "Wagyu A5 Truffle",
            badge: "Chef's Favorite",
            price: "Rp 1.2jt",
            img: "image/steak.jpg",
            desc: "Experience the epitome of luxury dining. Our imported Japanese A5 Wagyu is carefully seared to absolute perfection, ensuring a melt-in-your-mouth texture. It is elegantly served with a rich black truffle reduction and garnished with edible 24k gold flakes for a truly unforgettable culinary journey.",
            prepTime: "45 min",
            calories: "850 kcal",
            serves: "1 Person",
            origin: "Kobe, Japan",
            ingredients: ["A5 Wagyu Beef", "Black Truffle", "24k Gold Flakes", "Sea Salt", "Butter"],
            chefNote: "The key to this dish is the resting period. We allow the Wagyu to rest for exactly half its cooking time to ensure the juices redistribute perfectly.",
            pairing: "Pairs exceptionally well with a full-bodied Cabernet Sauvignon or a vintage Bordeaux.",
            allergen: "Contains dairy (butter). Truffle may be an allergen to some."
        },
        salmon: {
            title: "Atlantic Salmon",
            badge: "Best Seller",
            price: "Rp 450k",
            img: "image/salmon.jpg",
            desc: "A celebration of oceanic flavors. Our Atlantic Salmon is pan-seared to achieve a crispy skin while maintaining a tender, flaky interior. It's delicately glazed with a sweet and savory miso reduction and rests on a bed of light, airy asparagus foam.",
            prepTime: "30 min",
            calories: "620 kcal",
            serves: "1 Person",
            origin: "North Atlantic",
            ingredients: ["Atlantic Salmon", "Miso Paste", "Asparagus", "Mirin", "Sake"],
            chefNote: "We source our salmon sustainably. The asparagus foam adds a vegetal brightness that cuts through the rich, fatty nature of the salmon.",
            pairing: "Highly recommended with a crisp Sauvignon Blanc or a dry Riesling.",
            allergen: "Contains fish, soy (miso), and alcohol (mirin/sake reduction)."
        },
        lava: {
            title: "Golden Lava",
            badge: "New",
            price: "Rp 180k",
            img: "image/kue.jpg",
            desc: "A decadent finale to your meal. This dark chocolate fondant reveals a warm, molten center infused with salted caramel and dusted with gold powder. Served alongside a quenelle of artisanal Madagascar vanilla bean gelato to balance the intense chocolate flavor.",
            prepTime: "25 min",
            calories: "480 kcal",
            serves: "1 Person",
            origin: "Makanism Patisserie",
            ingredients: ["Dark Chocolate (70%)", "Salted Caramel", "Vanilla Bean", "Flour", "Eggs", "Gold Dust"],
            chefNote: "Timing is everything. We bake this for exactly 11 minutes at 200°C to achieve the perfect gooey center while keeping the outside spongy.",
            pairing: "Best enjoyed with an Espresso Martini or a late-harvest dessert wine.",
            allergen: "Contains gluten, dairy, and eggs. May contain traces of nuts."
        }
    };

    const modal = document.getElementById('specialModal');
    if (!modal) return;
    const overlay = modal.querySelector('.special-modal-overlay');
    const closeBtn = document.getElementById('modalClose');

    const elements = {
        title: document.getElementById('modalTitle'),
        badge: document.getElementById('modalBadge'),
        price: document.getElementById('modalPrice'),
        img: document.getElementById('modalImg'),
        desc: document.getElementById('modalDesc'),
        prepTime: document.getElementById('modalPrepTime'),
        calories: document.getElementById('modalCalories'),
        serves: document.getElementById('modalServes'),
        origin: document.getElementById('modalOrigin'),
        ingredients: document.getElementById('modalIngredients'),
        chefNote: document.getElementById('modalChefNote'),
        pairing: document.getElementById('modalPairing'),
        allergen: document.getElementById('modalAllergen')
    };

    const openBtns = document.querySelectorAll('.btn-view-detail, .special-card');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent double firing if clicking button inside card
            e.stopPropagation();
            const specialKey = btn.getAttribute('data-special') || btn.closest('.special-card').getAttribute('data-special');
            if (specialKey && specialData[specialKey]) {
                const data = specialData[specialKey];
                
                // Populate data
                elements.title.textContent = data.title;
                elements.badge.textContent = data.badge;
                elements.price.textContent = data.price;
                elements.img.src = data.img;
                elements.img.alt = data.title;
                elements.desc.textContent = data.desc;
                elements.prepTime.textContent = data.prepTime;
                elements.calories.textContent = data.calories;
                elements.serves.textContent = data.serves;
                elements.origin.textContent = data.origin;
                elements.chefNote.textContent = data.chefNote;
                elements.pairing.textContent = data.pairing;
                elements.allergen.textContent = data.allergen;

                // Populate ingredients tags
                elements.ingredients.innerHTML = '';
                data.ingredients.forEach(ing => {
                    const span = document.createElement('span');
                    span.className = 'ingredient-tag';
                    span.textContent = ing;
                    elements.ingredients.appendChild(span);
                });

                // Open modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}

/* =============================
   RESERVATION LOGIC
   ============================= */
function initReservation() {
    const form = document.getElementById('formReservasi');
    const statusEl = document.getElementById('bookingStatus');
    const overlay = document.getElementById('resSuccessOverlay');
    const content = document.getElementById('resContent');
    const btnAnother = document.getElementById('btnBookAnother');

    if (!form || !statusEl || !overlay) return;

    // Check Open/Close Status based on current hour
    const updateStatus = () => {
        const now = new Date();
        const hour = now.getHours();
        
        const inputs = form.querySelectorAll('input');
        const btnSubmit = document.getElementById('btnSubmitBooking');
        
        // Open hours: 1 PM (13:00) to 7 PM (19:00)
        if (hour >= 13 && hour < 19) {
            statusEl.textContent = 'Status: Open';
            statusEl.className = 'booking-status open';
            
            inputs.forEach(input => input.disabled = false);
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Confirm Secure Reservation';
            }
        } else {
            statusEl.textContent = 'Status: Closed';
            statusEl.className = 'booking-status close';
            
            inputs.forEach(input => input.disabled = true);
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Reservations Closed (1 PM - 7 PM Only)';
            }
        }
    };
    updateStatus();

    // Frontend sanitization to prevent XSS
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // Ensure overlay children start hidden so GSAP can animate them in
    gsap.set(overlay.querySelector('.success-icon'), { scale: 0, rotation: -45, opacity: 0 });
    gsap.set(overlay.querySelectorAll('h3, p, button'), { y: 20, opacity: 0 });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btnSubmit = document.getElementById('btnSubmitBooking');
        if (btnSubmit.disabled) return; // Prevent double-submit
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Securely...';

        // Retrieve and sanitize inputs
        const name = sanitizeHTML(document.getElementById('resName').value);
        const email = sanitizeHTML(document.getElementById('resEmail').value);
        const phone = sanitizeHTML(document.getElementById('resPhone').value);
        const date = sanitizeHTML(document.getElementById('resDate').value);
        const time = sanitizeHTML(document.getElementById('resTime').value);
        const guests = sanitizeHTML(document.getElementById('resGuests').value);

        // Set success message before animation starts
        document.getElementById('successMessage').textContent = 
            `Thank you, ${name}! Your table for ${guests} guest(s) on ${date} at ${time} is securely booked. Confirmation sent to ${email}.`;

        // Simulate secure processing
        setTimeout(() => {
            // Step 1: Fade out the form
            gsap.to(content, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    // Step 2: Show the overlay
                    overlay.classList.add('active');
                    
                    // Step 3: Animate overlay children in sequence
                    const tl = gsap.timeline();
                    tl.to(overlay.querySelector('.success-icon'), { 
                        scale: 1, rotation: 0, opacity: 1, 
                        duration: 0.6, ease: "back.out(1.7)" 
                    })
                    .to(overlay.querySelectorAll('h3, p, button'), { 
                        y: 0, opacity: 1, 
                        duration: 0.4, stagger: 0.12 
                    }, "-=0.2");
                }
            });
        }, 1500);
    });

    // Reset: Book Another Table
    if (btnAnother) {
        btnAnother.addEventListener('click', () => {
            // Fade out overlay children
            const tl = gsap.timeline();
            tl.to(overlay.querySelectorAll('h3, p, button'), { 
                y: -10, opacity: 0, duration: 0.25, stagger: 0.05 
            })
            .to(overlay.querySelector('.success-icon'), { 
                scale: 0, opacity: 0, duration: 0.3 
            }, "-=0.15")
            .call(() => {
                // Hide overlay and reset form
                overlay.classList.remove('active');
                
                // Reset child positions for next animation
                gsap.set(overlay.querySelector('.success-icon'), { scale: 0, rotation: -45, opacity: 0 });
                gsap.set(overlay.querySelectorAll('h3, p, button'), { y: 20, opacity: 0 });

                // Reset form
                form.reset();
                const btnSubmit = document.getElementById('btnSubmitBooking');
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Confirm Secure Reservation';
                
                // Fade content back in
                gsap.to(content, { opacity: 1, duration: 0.4, ease: 'power2.out' });
            });
        });
    }
}
