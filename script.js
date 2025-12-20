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
});

/* =============================
   LOADER & HERO ENHANCED
   ============================= */
function initLoader() {
    const tl = gsap.timeline();

    // Disable scrolling during loader
    document.body.style.overflow = 'hidden';

    tl.from('.loader-main-logo', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
        .from('.loader-sub', {
            opacity: 0,
            y: 10,
            duration: 0.5
        }, '-=0.3')
        .to('.loader-progress', {
            width: '100%',
            duration: 2.5,
            ease: 'slow(0.7, 0.7, false)'
        }, '-=0.5')
        .to('.loader-logo-wrapper', {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.inOut'
        })
        .to('.loader', {
            yPercent: -100,
            duration: 1.2,
            ease: 'expo.inOut',
            onComplete: () => {
                document.body.style.overflow = 'auto';
                document.body.style.overflowX = 'hidden';
                ScrollTrigger.refresh();
            }
        }, '-=0.4')
        // Hero elements are triggered via CSS animations or simple entries
        // But we can refine them here if needed
        .from('.hero-desc', {
            opacity: 0,
            y: 30,
            duration: 1
        }, '-=0.5')
        .from('.hero-btns', {
            opacity: 0,
            y: 30,
            duration: 1
        }, '-=0.8');
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

    // About/Story Parallax
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
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // FAQ
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            q.parentElement.classList.toggle('active');
        });
    });
}
