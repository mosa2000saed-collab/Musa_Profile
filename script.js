document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. DOM Elements
    // ==========================================================================
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('main-header');
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title-text');
    const toastDesc = document.getElementById('toast-desc-text');
    const statCards = document.querySelectorAll('.stat-card');
    const currentYearSpan = document.getElementById('current-year');
    const addSocialBtn = document.getElementById('add-social-btn');
    const socialIconsContainer = document.getElementById('social-icons-container');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // 2. Dark / Light Mode Toggle
    // ==========================================================================
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme) {
        body.className = savedTheme;
    } else if (prefersLight) {
        body.className = 'light-theme';
    } else {
        body.className = 'dark-theme';
    }

    // Handle theme toggle click
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
            showToast('تم تفعيل الوضع الفاتح', 'تصفح مريح للعين في الأجواء المضيئة.', false);
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            showToast('تم تفعيل الوضع الداكن', 'تصفح مريح للعين وتقليل استهلاك الطاقة.', false);
        }
    });

    // ==========================================================================
    // 3. Mobile Navigation Menu
    // ==========================================================================
    const toggleMobileMenu = () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when clicking outside the menu
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // ==========================================================================
    // 4. Header Scroll Effect & ScrollSpy
    // ==========================================================================
    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // ScrollSpy: highlight active section link
        let currentSectionId = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // accounting for header height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 5. Typewriter Effect
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    const words = ['مطور برمجيات', 'شغوف بالتقنية والابتكار', 'محلل ومحل مشكلات'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 150;

    const typeEffect = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 75; // deleting is faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 150;
        }

        // Logic for word changes
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingDelay = 1500; // pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingDelay = 500; // pause before typing next word
        }

        setTimeout(typeEffect, typingDelay);
    };

    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // 6. Statistics Counter Animation
    // ==========================================================================
    const animateCounter = (card) => {
        const numElement = card.querySelector('.stat-number');
        const targetValue = parseInt(card.getAttribute('data-stat-target'), 10);
        let startValue = 0;
        const duration = 2000; // 2 seconds animation
        const stepTime = Math.max(Math.floor(duration / targetValue), 15);
        
        const counter = setInterval(() => {
            startValue += Math.ceil(targetValue / 100) || 1;
            if (startValue >= targetValue) {
                numElement.textContent = targetValue;
                clearInterval(counter);
            } else {
                numElement.textContent = startValue;
            }
        }, stepTime);
    };

    // IntersectionObserver for counters
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, {
        threshold: 0.5
    });

    statCards.forEach(card => {
        counterObserver.observe(card);
    });

    // ==========================================================================
    // 7. Toast Notification Handler
    // ==========================================================================
    let toastTimeout;
    const showToast = (title, message, isSuccess = true) => {
        clearTimeout(toastTimeout);
        toastTitle.textContent = title;
        toastDesc.textContent = message;
        
        // Adjust border/shadow color depending on status
        if (isSuccess) {
            toast.style.borderColor = 'var(--accent-color)';
            toast.style.boxShadow = 'var(--shadow-lg), 0 10px 30px var(--accent-glow)';
            toast.querySelector('.toast-icon-wrapper').style.color = 'var(--accent-color)';
            toast.querySelector('.toast-icon-wrapper').style.backgroundColor = 'var(--accent-glow)';
        } else {
            toast.style.borderColor = 'var(--primary-color)';
            toast.style.boxShadow = 'var(--shadow-lg), 0 10px 30px var(--primary-glow)';
            toast.querySelector('.toast-icon-wrapper').style.color = 'var(--primary-color)';
            toast.querySelector('.toast-icon-wrapper').style.backgroundColor = 'var(--primary-glow)';
        }

        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // ==========================================================================
    // 8. Contact Form Handling
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = 'جاري الإرسال... <span class="cursor">|</span>';
            
            // Simulate sending email
            setTimeout(() => {
                // Reset loading state
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = originalBtnContent;
                
                // Show success toast
                showToast('تم إرسال الرسالة بنجاح!', 'شكراً لك، سأرد على بريدك الإلكتروني قريباً.');
                
                // Reset form fields
                contactForm.reset();
            }, 1500);
        });
    }

    // ==========================================================================
    // 9. Download CV Button Micro-interaction
    // ==========================================================================
    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', (e) => {
            // Log interaction, show a nice notification
            showToast('بدء تحميل السيرة الذاتية', 'يجري تحميل ملف السيرة الذاتية التجريبي الآن.', false);
        });
    }

    // ==========================================================================
    // 10. Dynamic Interaction: Add Future Social Media Platform
    // ==========================================================================
    if (addSocialBtn) {
        addSocialBtn.addEventListener('click', () => {
            // Ask user for social name
            const platformName = prompt('أدخل اسم المنصة الاجتماعية الجديدة (مثل: Twitter, Telegram):');
            
            if (platformName && platformName.trim() !== '') {
                const platformLink = prompt(`أدخل رابط حسابك على ${platformName}:`, 'https://');
                
                if (platformLink && platformLink.trim() !== '') {
                    // Create element
                    const newBtn = document.createElement('a');
                    newBtn.href = platformLink;
                    newBtn.target = '_blank';
                    newBtn.rel = 'noopener noreferrer';
                    newBtn.className = 'social-icon-btn';
                    newBtn.title = platformName;
                    newBtn.ariaLabel = platformName;
                    
                    // Simple dynamic icon based on character or fallback SVG
                    newBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="svg-icon">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    `;
                    
                    // Add hover custom styling based on simple names
                    const cleanName = platformName.toLowerCase().trim();
                    if (cleanName.includes('twitter') || cleanName.includes('x')) {
                        newBtn.addEventListener('mouseenter', () => newBtn.style.backgroundColor = '#1da1f2');
                    } else if (cleanName.includes('telegram')) {
                        newBtn.addEventListener('mouseenter', () => newBtn.style.backgroundColor = '#0088cc');
                    } else if (cleanName.includes('instagram')) {
                        newBtn.addEventListener('mouseenter', () => newBtn.style.backgroundColor = '#e1306c');
                    }
                    
                    // Append before the add button
                    socialIconsContainer.insertBefore(newBtn, addSocialBtn);
                    
                    // Notify success
                    showToast('تمت إضافة المنصة!', `تمت إضافة رابط ${platformName} بنجاح إلى القائمة.`);
                }
            }
        });
    }

    // ==========================================================================
    // 11. Scroll To Top Button Logic
    // ==========================================================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
