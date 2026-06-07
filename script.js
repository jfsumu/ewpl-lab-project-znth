/* 
========================================================================
   ZnthHost - Web Hosting Business Landing Page - JavaScript Code
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. Sticky Navigation & Active Link Highlight
     ========================================================================= */
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky Navbar state toggling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavOnScroll();
  });

  // Track active section to highlight corresponding nav link
  function highlightNavOnScroll() {
    let scrollPos = window.scrollY + 150; // offset for nav height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Double check active indicators on load
  highlightNavOnScroll();

  /* =========================================================================
     2. Mobile Menu Navigation Slider
     ========================================================================= */
  const hamburger = document.getElementById('hamburger-menu-btn');
  const navMenu = document.getElementById('nav-navigation-menu');
  const mobileNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close mobile navigation drawer when menu links are pressed
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Close mobile navigation if clicking outside the navbar
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });

  /* =========================================================================
     3. Smooth Page Scrolling (Alternative helper)
     ========================================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* =========================================================================
     4. Intersection Observer for Scroll Fade-in Effects
     ========================================================================= */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to trigger animation once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* =========================================================================
     5. Animated Statistics Counters
     ========================================================================= */
  const statNumbers = document.querySelectorAll('.stats-number');
  let countersAnimated = false;

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
      let startValue = 0;
      const duration = 2000; // 2 seconds
      const frameRate = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameRate);
      const increment = target / totalFrames;
      let currentFrame = 0;

      const timer = setInterval(() => {
        currentFrame++;
        startValue += increment;
        
        if (currentFrame >= totalFrames) {
          clearInterval(timer);
          counter.textContent = target.toFixed(decimals) + suffix;
        } else {
          counter.textContent = startValue.toFixed(decimals) + suffix;
        }
      }, frameRate);
    });
  }

  // Observer to trigger counter animation when section is in view
  const statsSection = document.getElementById('stats-counter-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    statsObserver.observe(statsSection);
  }

  /* =========================================================================
     6. Frequently Asked Questions Accordion
     ========================================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const panel = item.querySelector('.faq-panel');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all open FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-panel').style.maxHeight = null;
      });

      // Toggle clicked FAQ
      if (!isActive) {
        item.classList.add('active');
        // Animate height expansion
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* =========================================================================
     7. Contact Form Simulation and Mock Feedback
     ========================================================================= */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitBtnText = submitBtn.querySelector('span');
      const submitBtnIcon = submitBtn.querySelector('i');
      
      // Store original state
      const origText = submitBtnText.textContent;
      
      // Disable inputs and buttons
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending Message...';
      submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin btn-icon';
      
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      // Mock server round-trip latency
      setTimeout(() => {
        // Reset button states
        submitBtn.disabled = false;
        submitBtnText.textContent = origText;
        submitBtnIcon.className = 'fa-solid fa-paper-plane btn-icon';
        
        // Show success status
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Thank you! Your query has been logged. ZnthHost support will reach out within 2 hours.';
        
        // Clear forms
        contactForm.reset();
      }, 1500);
    });
  }

  /* =========================================================================
     8. Purchase Flow & Fake bKash Modal State Machine
     ========================================================================= */
  // Modal DOM elements
  const backdrop = document.getElementById('purchase-modal-backdrop');
  const modalCheckout = document.getElementById('modal-checkout-details');
  const modalBkash = document.getElementById('modal-bkash-gateway');
  const modalLoader = document.getElementById('modal-payment-loader');
  const modalSuccess = document.getElementById('modal-payment-success');

  // Value display nodes
  const checkoutPlanName = document.getElementById('checkout-plan-name');
  const checkoutPlanPrice = document.getElementById('checkout-plan-price');
  const bkashPayAmount = document.getElementById('bkash-pay-amount');
  const receiptPlanName = document.getElementById('receipt-product-name');
  const receiptAmount = document.getElementById('receipt-amount');
  const receiptTxId = document.getElementById('receipt-txid');

  // Input forms
  const checkoutDetailsForm = document.getElementById('checkout-details-form');
  const bkashForm = document.getElementById('bkash-payment-form');

  // Button close elements
  const closeCheckoutBtn = document.getElementById('close-checkout-modal');
  const closeBkashBtn = document.getElementById('close-bkash-modal');
  const cancelBkashBtn = document.getElementById('btn-bkash-cancel');
  const closeReceiptBtn = document.getElementById('btn-receipt-close');

  // Temporary Purchase State Cache
  let currentProduct = {
    name: '',
    price: ''
  };

  // Helper to close all modals and backdrop
  function closeModalSystem() {
    backdrop.classList.remove('open');
    // Remove active class from all modals
    const modals = [modalCheckout, modalBkash, modalLoader, modalSuccess];
    modals.forEach(modal => modal.classList.remove('active-modal'));
    
    // Reset forms
    checkoutDetailsForm.reset();
    bkashForm.reset();
  }

  // Setup click triggers on all plan cards
  const buyBtns = document.querySelectorAll('.buy-now-btn');
  buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pName = btn.getAttribute('data-product');
      const pPrice = btn.getAttribute('data-price');
      
      currentProduct.name = pName;
      currentProduct.price = pPrice;

      // Update Text labels inside checkout details modal
      checkoutPlanName.textContent = pName;
      checkoutPlanPrice.textContent = `৳${pPrice}/month`;

      // Open backdrop
      backdrop.classList.add('open');
      // Set active checkout modal
      modalCheckout.classList.add('active-modal');
    });
  });

  // Action listeners for close button indicators
  closeCheckoutBtn.addEventListener('click', closeModalSystem);
  closeBkashBtn.addEventListener('click', closeModalSystem);
  cancelBkashBtn.addEventListener('click', closeModalSystem);
  closeReceiptBtn.addEventListener('click', closeModalSystem);

  // Close modals if backdrop overlay is clicked (excluding click bubble inside cards)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModalSystem();
    }
  });

  // Step 1: Submit Customer Details Form -> Proceed to bKash UI
  checkoutDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // De-activate details modal
    modalCheckout.classList.remove('active-modal');
    
    // Configure price in bKash header details
    bkashPayAmount.textContent = `৳${currentProduct.price}`;
    
    // Reset and open bKash checkout screen
    bkashForm.reset();
    modalBkash.classList.add('active-modal');
  });

  // Step 2: Confirm Payment Form in bKash -> Processing Loader -> Success
  bkashForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide bkash modal
    modalBkash.classList.remove('active-modal');
    
    // Display processing spin screen
    modalLoader.classList.add('active-modal');
    
    // Simulate server response timer
    setTimeout(() => {
      // Hide loader
      modalLoader.classList.remove('active-modal');
      
      // Generate unique random Transaction ID (Standard 10 character BKash format)
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      let txId = 'BK';
      for(let i = 0; i < 4; i++) {
        txId += letters.charAt(Math.floor(Math.random() * letters.length));
        txId += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      
      // Update receipt records
      receiptPlanName.textContent = currentProduct.name;
      receiptAmount.textContent = `৳${currentProduct.price}.00 BDT`;
      receiptTxId.textContent = txId;
      
      // Display Success Modal
      modalSuccess.classList.add('active-modal');
    }, 2500); // 2.5 second mock latency
  });

});