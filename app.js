document.addEventListener('DOMContentLoaded', () => {
  // --- PRELOADER ANIMATION SYSTEM ---
  const preloader = document.getElementById('sitePreloader');
  const counterEl = document.getElementById('preloaderCounter');
  const fillEl = document.getElementById('preloaderProgressFill');
  const statusEl = document.getElementById('preloaderStatus');
  const rocket = document.getElementById('preloaderRocket');
  const rocketContainer = document.getElementById('preloaderRocketContainer');

  if (preloader && !sessionStorage.getItem('brandora_preloaded')) {
    // Lock scroll immediately on preloading start
    document.body.classList.add('preloading-active');

    let count = 0;
    const duration = 2.4; // Total count duration in seconds

    const statuses = [
      { threshold: 0, text: "CONNECTING TO SERVERS..." },
      { threshold: 25, text: "LOADING CONTENT ASSETS..." },
      { threshold: 50, text: "RENDERING WEBGL SPACE..." },
      { threshold: 75, text: "PREPARING ROCKET THRUSTERS..." },
      { threshold: 90, text: "FINAL ENGINE CHECK..." },
      { threshold: 100, text: "READY TO LAUNCH!" }
    ];

    const updateStatus = (currentCount) => {
      let activeStatus = statuses[0].text;
      for (const s of statuses) {
        if (currentCount >= s.threshold) {
          activeStatus = s.text;
        }
      }
      statusEl.textContent = activeStatus;
    };

    // Make sure GSAP is loaded
    if (typeof gsap === 'undefined') {
      // Fallback if GSAP fails to load
      preloader.classList.add('hidden-overlay');
      document.body.classList.remove('preloading-active');
      return;
    }

    const counterProxy = { value: 0 };
    
    // Main GSAP Timeline for Cinematic Reveal
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.classList.add('hidden-overlay');
        document.body.classList.remove('preloading-active');
        document.body.classList.add('preloading-done');
        sessionStorage.setItem('brandora_preloaded', 'true');
      }
    });

    // 1. Counter animation
    tl.to(counterProxy, {
      value: 100,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        count = Math.floor(counterProxy.value);
        counterEl.textContent = String(count).padStart(2, '0');
        fillEl.style.width = `${count}%`;
        updateStatus(count);
        
        // Rumble effects
        rocket.className = 'preloader-rocket'; 
        if (count >= 85) rocket.classList.add('rumble-3');
        else if (count >= 50) rocket.classList.add('rumble-2');
        else if (count >= 20) rocket.classList.add('rumble-1');
      }
    });

    // 2. Launch sequence
    tl.add(() => {
      statusEl.textContent = "IGNITION & LAUNCH!";
      preloader.classList.add('launching');
    }, "+=0.1");

    // Fly rocket up
    tl.to(rocketContainer, {
      y: -800,
      duration: 0.8,
      ease: "power4.in"
    }, "+=0.2");

    // Split open the gates / panels
    tl.to('.panel-left', {
      xPercent: -100,
      duration: 1.2,
      ease: "power3.inOut"
    }, "-=0.2");
    
    tl.to('.panel-right', {
      xPercent: 100,
      duration: 1.2,
      ease: "power3.inOut"
    }, "<");

    tl.to('.preloader-content', {
      opacity: 0,
      scale: 1.5,
      duration: 0.8,
      ease: "power2.in"
    }, "<");

    tl.to('.preloader-stars', {
      opacity: 0,
      duration: 1
    }, "<0.2");

  } else {
    // Loader was skipped (handled via CSS/inline script or page reload check)
    if (preloader) {
      preloader.classList.add('hidden-overlay');
    }
    document.body.classList.remove('preloading-active');
    document.body.classList.add('preloading-done');
  }

  // 1. Sticky Navigation & Scroll Progress Indicator
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check on load

  // 2. Mobile Menu Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // 3. Reveal-on-Scroll Animations using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once animation is run to avoid repeat triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 4. Testimonials Slider Deck Carousel
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  if (track && prevBtn && nextBtn) {
    let index = 0;
    const cards = Array.from(track.children);
    
    const updateSlider = () => {
      let cardWidthPercent = 33.333; // Default 3 columns
      if (window.innerWidth <= 768) {
        cardWidthPercent = 100; // 1 column
      } else if (window.innerWidth <= 1024) {
        cardWidthPercent = 50; // 2 columns
      }

      const offsetPercent = index * (cardWidthPercent + 2.5); // Card size + proportional gap
      track.style.transform = `translateX(-${offsetPercent}%)`;
    };

    nextBtn.addEventListener('click', () => {
      let limit = cards.length - 3;
      if (window.innerWidth <= 768) {
        limit = cards.length - 1;
      } else if (window.innerWidth <= 1024) {
        limit = cards.length - 2;
      }

      if (index < limit) {
        index++;
      } else {
        index = 0; // Loop back
      }
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
      } else {
        let limit = cards.length - 3;
        if (window.innerWidth <= 768) {
          limit = cards.length - 1;
        } else if (window.innerWidth <= 1024) {
          limit = cards.length - 2;
        }
        index = limit; // Loop to end
      }
      updateSlider();
    });

    window.addEventListener('resize', () => {
      index = 0; // reset index to prevent visual breaks
      updateSlider();
    });
  }

  // 5. Portfolio Category Filter Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active state on Buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          // Animation transition out
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          
          setTimeout(() => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
              item.style.display = 'block';
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.style.display = 'none';
            }
          }, 300);
        });
      });
    });
  }

  // 6. Services Page Content Tabs Accordion
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
      });
    });
  }

  // 7. Dynamic Plans Page Billing Switcher (Monthly / Annually)
  const billingSwitch = document.getElementById('billingSwitch');
  const prices = document.querySelectorAll('.pricing-price .price-val');
  const periods = document.querySelectorAll('.pricing-price .price-period');

  if (billingSwitch && prices.length > 0) {
    billingSwitch.addEventListener('change', () => {
      const isAnnual = billingSwitch.checked;
      
      prices.forEach(price => {
        const monthlyVal = price.getAttribute('data-monthly');
        const annualVal = price.getAttribute('data-annual');
        
        // Add fade out animation class
        price.style.opacity = '0';
        price.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
          price.textContent = isAnnual ? annualVal : monthlyVal;
          price.style.opacity = '1';
          price.style.transform = 'translateY(0)';
        }, 200);
      });

      periods.forEach(period => {
        period.style.opacity = '0';
        setTimeout(() => {
          period.textContent = isAnnual ? '/yr' : '/mo';
          period.style.opacity = '1';
        }, 200);
      });
    });
  }

  // 8. Dynamic Modal Window & Floating Booking Actions
  const modalOverlay = document.getElementById('strategyModal');
  const modalClose = document.querySelector('.modal-close-btn');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const timeSlots = document.querySelectorAll('.time-slot-btn');
  const bookConfirmBtn = document.getElementById('bookConfirmBtn');

  if (modalOverlay) {
    const openModal = () => {
      modalOverlay.classList.add('open');
      document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };

    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Time Slot Select logic
    let selectedTime = null;
    timeSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = slot.textContent;
      });
    });

    // Confirm booking logic
    if (bookConfirmBtn) {
      bookConfirmBtn.addEventListener('click', () => {
        const dateInput = document.getElementById('bookingDate');
        if (!dateInput.value) {
          showToast('Please select a preferred date.', 'error');
          return;
        }
        if (!selectedTime) {
          showToast('Please select a preferred time slot.', 'error');
          return;
        }

        showToast(`Consultation requested successfully for ${dateInput.value} at ${selectedTime}!`, 'success');
        closeModal();
      });
    }
  }

  // 9. Floating Contact Form Client-side Validator
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve field components
      const name = document.getElementById('contactName').value.trim();
      const company = document.getElementById('contactCompany').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields (*).', 'error');
        return;
      }

      // Simple Email Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Success workflow
      showToast('Thank you! Your message has been sent successfully.', 'success');
      contactForm.reset();
    });
  }

  // 10. Newsletter Form Submissions
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('.newsletter-input');
      if (emailInput && emailInput.value.trim()) {
        showToast('Successfully subscribed to insights!', 'success');
        emailInput.value = '';
      }
    });
  });

  // 11. Toast Notifications Utility
  function showToast(message, type = 'success') {
    // Check if container exists, else construct
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    // Icon construction based on type
    const icon = type === 'error' 
      ? '<svg style="width:20px;height:20px;stroke:#ef4444;stroke-width:2.5;fill:none;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
      : '<svg style="width:20px;height:20px;stroke:#10b981;stroke-width:2.5;fill:none;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Fade out and remove element after timer finishes
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  // 12. Robust Background Video Autoplay & Error Diagnostic Helper
  const bgVideo = document.querySelector('.hero-video-bg');
  if (bgVideo && typeof bgVideo.play === 'function') {
    // Add event listener to capture media loading errors
    bgVideo.addEventListener('error', (e) => {
      const err = bgVideo.error;
      let errMsg = "Unknown video error";
      if (err) {
        switch (err.code) {
          case 1: errMsg = "Video load aborted."; break;
          case 2: errMsg = "Network error while loading video."; break;
          case 3: errMsg = "Video decoding failed (codec unsupported)."; break;
          case 4: errMsg = "Video format or codec is not supported by this browser."; break;
        }
        console.error("BACKGROUND VIDEO ERROR:", errMsg, err);
        showToast(`Video Error: ${errMsg}`, "error");
      }
    });

    const attemptPlay = () => {
      bgVideo.muted = true;
      bgVideo.defaultMuted = true;
      bgVideo.play().catch(error => {
        console.log("Autoplay was prevented by browser restrictions, playing on user interaction.", error);
        const playVideoOnInteraction = () => {
          bgVideo.muted = true;
          bgVideo.defaultMuted = true;
          bgVideo.play().catch(e => console.log("Interaction play failed:", e));
          document.removeEventListener('click', playVideoOnInteraction);
          document.removeEventListener('touchstart', playVideoOnInteraction);
        };
        document.addEventListener('click', playVideoOnInteraction);
        document.addEventListener('touchstart', playVideoOnInteraction);
      });
    };

    attemptPlay();
  }

  // --- MAGNETIC CUSTOM CURSOR & FIRE TRAIL ---
  const initCursor = () => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    // Create cursor trail elements (Emerald Fire)
    const colors = [
      "#00df82", "#00d57c", "#00ca76", "#00c070", "#00b56a", 
      "#00ab64", "#00a05d", "#009657", "#008b51", "#00814b", 
      "#007645", "#006c3f", "#006139", "#005733", "#004c2c", 
      "#004226", "#003720", "#002d1a", "#002214", "#00180e"
    ];
    
    const circles = [];
    for (let i = 0; i < 20; i++) {
      const circle = document.createElement('div');
      circle.classList.add('cursor-trail');
      circle.style.backgroundColor = colors[i] || '#00df82';
      document.body.appendChild(circle);
      circles.push({ el: circle, x: window.innerWidth/2, y: window.innerHeight/2 });
    }

    const coords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Setup GSAP QuickTo for the outline
    const xToOutline = gsap.quickTo(cursorOutline, "x", {duration: 0.25, ease: "power3"});
    const yToOutline = gsap.quickTo(cursorOutline, "y", {duration: 0.25, ease: "power3"});

    let isHoveringText = false;

    window.addEventListener("mousemove", (e) => {
      coords.x = e.clientX;
      coords.y = e.clientY;
      xToOutline(e.clientX);
      yToOutline(e.clientY);

      // Event delegation for text hover - highly reliable for dynamic/split text
      const target = e.target;
      if (target && target.closest) {
        const isText = target.closest('p, h1, h2, h3, h4, h5, h6, li, span, input, textarea, .text-hover');
        const isButton = target.closest('button, a, .btn, .magnetic');

        if (isText && !isButton) {
          if (!isHoveringText) {
            isHoveringText = true;
            cursorOutline.classList.add('cursor-invert');
            circles.forEach(c => c.el.style.display = 'none');
          }
        } else {
          if (isHoveringText) {
            isHoveringText = false;
            cursorOutline.classList.remove('cursor-invert');
            circles.forEach(c => c.el.style.display = 'block');
          }
        }
      }
    });

    const animateTrail = () => {
      let x = coords.x;
      let y = coords.y;

      circles.forEach((circleObj, index) => {
        circleObj.el.style.left = x - 8 + "px"; // 16px width/height, so -8px to center
        circleObj.el.style.top = y - 8 + "px";
        
        // Scale down as we go down the trail
        const scale = (circles.length - index) / circles.length;
        circleObj.el.style.transform = `scale(${scale})`;
        
        circleObj.x = x;
        circleObj.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.x - x) * 0.3; // Interpolation delay
        y += (nextCircle.y - y) * 0.3;
      });

      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    // Magnetic effect for links and buttons
    const magneticElements = document.querySelectorAll('a, button, .btn');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(0, 223, 130, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
        gsap.to(el, {x: 0, y: 0, duration: 0.4, ease: "power3.out"});
      });
      
      // The actual magnetic pull
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.25;
        const deltaY = (e.clientY - centerY) * 0.25;
        
        gsap.to(el, {x: deltaX, y: deltaY, duration: 0.2, ease: "power2.out"});
      });
    });
  };
  
  if (typeof gsap !== 'undefined') {
    initCursor();
  }

  // --- GSAP TEXT & SCROLL ANIMATIONS ---
  const initAnimations = () => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Split text for all major headings
    const splitElements = document.querySelectorAll('h1, h2:not(.modal-title)');
    
    splitElements.forEach((el) => {
      // Prevent double splitting
      if (el.classList.contains('is-split')) return;
      el.classList.add('is-split');

      // Create SplitType instance
      const text = new SplitType(el, { types: 'words, chars' });

      // Setup initial state to prevent flash of unstyled text
      gsap.set(text.chars, { opacity: 0, y: 50, rotationX: -90, transformOrigin: "bottom center" });

      // Create scroll-triggered animation for characters
      gsap.to(text.chars, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%", 
        },
        y: 0,
        opacity: 1,
        rotationX: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
    });

    // Fade-in up for standard content sections
    const fadeElements = document.querySelectorAll('.service-card, .portfolio-card, .btn:not(header .btn), .footer-col');
    fadeElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  };

  if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
    // Small timeout to ensure fonts and DOM are fully ready before splitting
    setTimeout(initAnimations, 100);
  }

  // --- HAND GESTURE DETECTION (MediaPipe) ---
  const initHandTracking = async () => {
    const btn = document.getElementById('hand-tracking-btn');
    if (!btn) return;

    const statusText = btn.querySelector('.hand-status');
    const video = document.getElementById('webcam-feed');
    let gestureRecognizer = null;
    let webcamRunning = false;
    let lastVideoTime = -1;
    let isCooldown = false; // For click debouncing

    // Check if webcam access is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("getUserMedia() is not supported by your browser");
      btn.style.display = 'none';
      return;
    }

    // Load MediaPipe Model
    const loadModel = async () => {
      try {
        statusText.textContent = "Loading...";
        statusText.classList.add('loading');
        
        // MediaPipe Tasks Vision dynamic import
        const visionModule = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs");
        const { GestureRecognizer, FilesetResolver } = visionModule;

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        return true;
      } catch (err) {
        console.error("Failed to load GestureRecognizer", err);
        statusText.textContent = "Error";
        statusText.classList.remove('loading');
        return false;
      }
    };

    // Predict WebCam loop
    const predictWebcam = async () => {
      if (!webcamRunning) return;

      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        
        const results = gestureRecognizer.recognizeForVideo(video, performance.now());
        
        if (results.landmarks && results.landmarks.length > 0) {
          // Get the index finger tip (landmark 8)
          const indexFingerTip = results.landmarks[0][8];
          
          // Map coordinates to screen
          // Webcam is usually mirrored, so we invert X.
          const x = (1 - indexFingerTip.x) * window.innerWidth;
          const y = indexFingerTip.y * window.innerHeight;

          // We must dispatch the synthetic mousemove on the element under the finger 
          // so hover effects and GSAP logic trigger naturally.
          const elementUnderFinger = document.elementFromPoint(x, y) || document.body;
          
          const moveEvent = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
          });
          elementUnderFinger.dispatchEvent(moveEvent);

          // Check for clicks (Closed_Fist)
          if (results.gestures.length > 0 && results.gestures[0].length > 0) {
            const gestureCategory = results.gestures[0][0].categoryName;
            
            if (gestureCategory === "Closed_Fist" && !isCooldown) {
              isCooldown = true;
              
              // Add a click effect to the cursor (scale down quickly)
              const cursorOutline = document.querySelector('.cursor-outline');
              if (cursorOutline) {
                gsap.to(cursorOutline, {scale: 0.5, duration: 0.1, yoyo: true, repeat: 1});
              }

              // Simulate click
              const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
              });
              elementUnderFinger.dispatchEvent(clickEvent);

              // Cooldown to prevent multiple clicks per second
              setTimeout(() => { isCooldown = false; }, 1000);
            }
          }
        }
      }
      
      // Keep looping
      if (webcamRunning) {
        requestAnimationFrame(predictWebcam);
      }
    };

    // Toggle button logic
    btn.addEventListener('click', async () => {
      if (!gestureRecognizer) {
        const loaded = await loadModel();
        if (!loaded) return;
      }

      if (!webcamRunning) {
        // Start Webcam
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
          video.srcObject = stream;
          video.addEventListener('loadeddata', () => {
            webcamRunning = true;
            btn.classList.add('active');
            statusText.textContent = "Active";
            statusText.classList.remove('loading');
            document.body.classList.add('hand-tracking-active');
            predictWebcam();
          });
        } catch (err) {
          console.error("Camera access denied or failed", err);
          statusText.textContent = "Denied";
          statusText.classList.remove('loading');
        }
      } else {
        // Stop Webcam
        webcamRunning = false;
        btn.classList.remove('active');
        statusText.textContent = "Off";
        document.body.classList.remove('hand-tracking-active');
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }
      }
    });
  };

  // Wait for window load to ensure MediaPipe CDN script has parsed completely
  window.addEventListener('load', initHandTracking);
});
