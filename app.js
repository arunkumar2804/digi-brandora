document.addEventListener('DOMContentLoaded', () => {
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
      ? '<svg style="width:20px;height:20px;stroke:#ef4444;stroke-width:2.5;fill:none;flex-shrink:0;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>'
      : '<svg style="width:20px;height:20px;stroke:#10b981;stroke-width:2.5;fill:none;flex-shrink:0;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>';

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

  
});
