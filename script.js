document.addEventListener('DOMContentLoaded', () => {
    // Device Detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
        document.body.classList.add('is-mobile');
        console.log('Device detected: Mobile');
    } else {
        document.body.classList.add('is-pc');
        console.log('Device detected: PC');
    }

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    const hoverElements = document.querySelectorAll('a, button, h1, h2, h3, p, span, .widget-card, .link-card, .contributor-pill, label, .setting-item');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
        });
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('p, span, h1, h2, h3, h4, h5, h6, a, button, input, label, .widget-title, .widget-desc, .value, .label')) {
            cursorOutline.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.matches('p, span, h1, h2, h3, h4, h5, h6, a, button, input, label, .widget-title, .widget-desc, .value, .label')) {
            cursorOutline.classList.remove('cursor-hover');
        }
    });

    const hoverables = document.querySelectorAll('a, .hotspot');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
            cursorOutline.style.backgroundColor = 'rgba(215, 25, 32, 0.1)';
            cursorOutline.style.borderColor = 'var(--color-red)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'rgba(0,0,0,0.5)';
        });
    });

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        const originalText = glitchText.getAttribute('data-text');
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';

        glitchText.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                glitchText.innerText = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    }

    const specs = document.querySelectorAll('.spec-item .value, .tech-data, .tech-stat .value');
    const specObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.innerText;
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
                let iterations = 0;

                const interval = setInterval(() => {
                    target.innerText = finalValue
                        .split('')
                        .map((letter, index) => {
                            if (index < iterations) return finalValue[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');

                    if (iterations >= finalValue.length) clearInterval(interval);
                    iterations += 1 / 5;
                }, 50);
                specObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    specs.forEach(spec => specObserver.observe(spec));

    const techOverlays = document.querySelectorAll('.tech-overlay');
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.3 });

    techOverlays.forEach(overlay => {
        techObserver.observe(overlay.parentElement);
    });

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    if (settingsBtn && settingsMenu) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn) {
                settingsMenu.classList.remove('active');
            }
        });
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const setting = btn.dataset.setting;
            const value = btn.dataset.value;

            const group = btn.parentElement;
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (setting === 'theme') {
                applyTheme(value);
            } else if (setting === 'accent') {
                applyAccent(value);
            }
        });
    });

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('widgets_theme', theme);
    }

    function applyAccent(accent) {
        const root = document.documentElement;
        if (accent === 'yellow') {
            root.style.setProperty('--accent-color', 'var(--color-yellow)');
        } else {
            root.style.setProperty('--accent-color', 'var(--color-red)');
        }
        localStorage.setItem('widgets_accent', accent);

        // Update cursor color immediately
        const newColor = getComputedStyle(root).getPropertyValue('--accent-color').trim();
        cursorDot.style.backgroundColor = newColor;
        cursorDot.style.boxShadow = `0 0 10px ${newColor}`;
    }

    function loadPreferences() {
        const savedTheme = localStorage.getItem('widgets_theme') || 'dark';
        const savedAccent = localStorage.getItem('widgets_accent') || 'yellow';

        applyTheme(savedTheme);
        applyAccent(savedAccent);

        // Reset all first
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));

        const themeBtn = document.querySelector(`.toggle-btn[data-setting="theme"][data-value="${savedTheme}"]`);
        if (themeBtn) themeBtn.classList.add('active');

        const accentBtn = document.querySelector(`.toggle-btn[data-setting="accent"][data-value="${savedAccent}"]`);
        if (accentBtn) accentBtn.classList.add('active');
    }

    const widgetData = [
        { image: "alarm(1).png", name: "Alarm (1)", description: "Wake up on time with this sleek, minimalist alarm widget." },
        { image: "calendar(1).png", name: "Calendar (1)", description: "Keep track of your schedule with this elegant calendar view." },
        { image: "calendar(2).png", name: "Calendar (2)", description: "Stay organized with this alternative calendar layout." },
        { image: "clock(1).png", name: "Clock (1)", description: "A classic analog clock face for your home screen." },
        { image: "clock(2).png", name: "Clock (2)", description: "Modern digital timekeeping with a unique twist." },
        { image: "clock(3).png", name: "Clock (3)", description: "Minimalist clock design focusing on essential readability." },
        { image: "clock+calendar(1).png", name: "Clock + Calendar (1)", description: "Time and date combined in a compact, informative widget." },
        { image: "daysinyear(1).png", name: "Days In Year (1)", description: "Visualise your year's progress at a glance." },
        { image: "flash(1).png", name: "Flash (1)", description: "Quick access to your device's flashlight." },
        { image: "fun(1).png", name: "Fun (1)", description: "A touch of whimsy for your daily interaction." },
        { image: "game(1).png", name: "Game (1)", description: "Quick entertainment right on your home screen." },
        { image: "gemini(1).png", name: "Gemini (1)", description: "AI assistance powered by Google's Gemini." },
        { image: "google(1).png", name: "Google (1)", description: "Instant access to Google Search." },
        { image: "hydration(1).png", name: "Hydration (1)", description: "Track your daily water intake effortlessly." },
        { image: "hydration(2).png", name: "Hydration (2)", description: "Stay hydrated with this visual water tracker." },
        { image: "learning(1).png", name: "Learning (1)", description: "Daily facts and snippets to expand your knowledge." },
        { image: "learning(2).png", name: "Learning (2)", description: "Daily inspiration with a curated collection of quotes." },
        { image: "mediaplayer(1).png", name: "Media Player (1)", description: "Control your music with style." },
        { image: "mediaplayer(2).png", name: "Media Player (2)", description: "Album art and controls in perfect harmony." },
        { image: "mediaplayer(3).png", name: "Media Player (3)", description: "Compact media controls for on-the-go listening." },
        { image: "mediaplayer(4).png", name: "Media Player (4)", description: "Expanded view for the ultimate music experience." },
        { image: "mediaplayer(5).png", name: "Media Player (5)", description: "Full-featured player widget for audiophiles." },
        { image: "note(1).png", name: "Note (1)", description: "Jot down quick thoughts and reminders." },
        { image: "note(2).png", name: "Note (2)", description: "Keep your important notes pinned and visible." },
        { image: "nothingpedia(1).png", name: "Nothingpedia (1)", description: "Your gateway to the Nothing ecosystem knowledge base." },
        { image: "playground(1).png", name: "Playground (1)", description: "Experiment with interactive elements." },
        { image: "pomodoro(1).png", name: "Pomodoro (1)", description: "Boost productivity with the Pomodoro technique." },
        { image: "power(1).png", name: "Power (1)", description: "Monitor your battery levels in style." },
        { image: "quickview(1).png", name: "Quick View (1)", description: "Essential information at a glance." },
        { image: "quickview(2).png", name: "Quick View (2)", description: "More details, same quick accessibility." },
        { image: "stocktracker(1).png", name: "Stock Tracker (1)", description: "Keep an eye on your favorite stocks." },
        { image: "stopwatch.png", name: "Stopwatch", description: "Precision timing for any activity." },
        { image: "storage(1).png", name: "Storage (1)", description: "Monitor your device storage usage." },
        { image: "volume(1).png", name: "Volume (1)", description: "Quick volume adjustments." },
        { image: "weather(1).png", name: "Weather (1)", description: "Current conditions and forecast." },
        { image: "workout(1).png", name: "Workout (1)", description: "Track your fitness progress." }
    ];

    const marqueeRow1 = document.getElementById('marquee-row-1');
    const marqueeRow2 = document.getElementById('marquee-row-2');

    const modal = document.getElementById('widget-modal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    function openModal(imageName, title, desc) {
        modalImg.src = `assets/${imageName}`;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function createWidgetCard(data, index) {
        const card = document.createElement('div');
        card.className = 'widget-card';

        card.addEventListener('click', () => {
            openModal(data.image, data.name, data.description);
        });

        const imgContainer = document.createElement('div');
        imgContainer.className = 'widget-image-container';

        const img = document.createElement('img');
        img.src = `assets/${data.image}`;
        img.alt = data.name;
        img.loading = 'lazy';

        imgContainer.appendChild(img);

        const info = document.createElement('div');
        info.className = 'widget-info';

        const title = document.createElement('h3');
        title.innerText = data.name;

        const desc = document.createElement('p');
        desc.innerText = data.description;

        info.appendChild(title);
        info.appendChild(desc);

        card.appendChild(imgContainer);
        card.appendChild(info);

        return card;
    }

    if (marqueeRow1 && marqueeRow2) {
        const midPoint = Math.ceil(widgetData.length / 2);
        const firstSet = widgetData.slice(0, midPoint);
        const secondSet = widgetData.slice(midPoint);

        [...firstSet, ...firstSet].forEach((data, i) => {
            marqueeRow1.appendChild(createWidgetCard(data, i % firstSet.length));
        });

        [...secondSet, ...secondSet].forEach((data, i) => {
            marqueeRow2.appendChild(createWidgetCard(data, midPoint + (i % secondSet.length)));
        });
    }

    // Countdown Logic
    const targetDate = new Date('December 9, 2026 00:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Countdown finished
            document.getElementById('days').innerText = "000";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = days.toString().padStart(3, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    loadPreferences();
});
