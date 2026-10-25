/**
 * ============================================================================
 * KAMAR-TAJ: THE REFECTORY — JAVASCRIPT CONTROLLER (Phase 1)
 * ============================================================================
 * 
 * Welcome team! This script contains the frontend logic for:
 * 1. Responsive mobile navigation toggle
 * 2. Student meal registration toggling (Session-based UI demo)
 * 3. Admin QR scanner simulation & live count updates
 * 4. Real-time table search/filtering
 * 5. Toast notification system
 * 
 * NOTE FOR BEGINNERS:
 * - We do NOT have a backend or database in Phase 1.
 * - Changes are stored in memory during your active browser tab.
 * - Refreshing the page resets everything to the default demo state.
 */

// Run when the DOM (HTML structure) is completely loaded
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initStudentInteractions();
  initAdminInteractions();
  initSearchFilter();
  initFeedback();
  initFeatureCarousel();
  initLoginForm();
});

/* ==========================================================================
   LOGIN PAGE: FRONTEND-ONLY FORM DEMO
   ========================================================================== */
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const username = document.getElementById("login-username");
  const usernameLabel = document.getElementById("login-username-label");
  const usernameError = document.getElementById("username-error");
  const password = document.getElementById("login-password");
  const passwordError = document.getElementById("password-error");
  const passwordToggle = document.getElementById("toggle-password");
  const formMessage = document.getElementById("login-message");

  function updateRole() {
    const role = form.querySelector('input[name="login-role"]:checked').value;
    const isStudent = role === "student";
    usernameLabel.textContent = isStudent ? "College roll number" : "Admin email or username";
    username.placeholder = isStudent ? "e.g. KT-2026-CS104" : "Enter your email or username";
    username.setAttribute("aria-label", usernameLabel.textContent);
    usernameError.textContent = "";
    username.removeAttribute("aria-invalid");
    formMessage.textContent = "";
  }

  form.querySelectorAll('input[name="login-role"]').forEach(option => {
    option.addEventListener("change", updateRole);
  });

  passwordToggle.addEventListener("click", () => {
    const isVisible = password.type === "text";
    password.type = isVisible ? "password" : "text";
    passwordToggle.textContent = isVisible ? "Show" : "Hide";
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
    passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const usernameIsEmpty = !username.value.trim();
    const passwordIsEmpty = !password.value;

    usernameError.textContent = usernameIsEmpty ? "Enter your roll number or admin username." : "";
    passwordError.textContent = passwordIsEmpty ? "Enter your password." : "";
    username.setAttribute("aria-invalid", String(usernameIsEmpty));
    password.setAttribute("aria-invalid", String(passwordIsEmpty));
    formMessage.className = "login-message";
    formMessage.textContent = "";

    if (usernameIsEmpty || passwordIsEmpty) {
      formMessage.classList.add("is-error");
      formMessage.textContent = "Please complete the required fields.";
      (usernameIsEmpty ? username : password).focus();
      return;
    }

    formMessage.classList.add("is-notice");
    formMessage.textContent = "Demo only: your credentials were not checked. Authentication will be implemented in a later phase.";
  });

  [username, password].forEach(input => {
    input.addEventListener("input", () => {
      const isUsername = input === username;
      const isEmpty = isUsername ? !input.value.trim() : !input.value;
      (isUsername ? usernameError : passwordError).textContent = isEmpty
        ? (isUsername ? "Enter your roll number or admin username." : "Enter your password.")
        : "";
      input.setAttribute("aria-invalid", String(isEmpty));
      formMessage.textContent = "";
    });
  });
}

/* ==========================================================================
   1. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    // Toggles the 'is-open' class to show/hide navigation on mobile
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when clicking any nav link
  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
    });
  });
}

/* ==========================================================================
   2. STUDENT DASHBOARD: MEAL REGISTRATION (FRONTEND DEMO)
   ========================================================================== */
function initStudentInteractions() {
  const mealButtons = document.querySelectorAll(".btn-toggle-meal");

  mealButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const mealCard = e.target.closest(".meal-card");
      if (!mealCard) return;

      const mealName = mealCard.dataset.mealName || "Meal";
      const statusBadge = mealCard.querySelector(".status-badge");
      const isCurrentlyRegistered = button.classList.contains("is-registered");

      if (isCurrentlyRegistered) {
        // Switch state to Unregistered
        button.classList.remove("is-registered");
        button.classList.add("is-not-registered");
        button.textContent = "Register for " + mealName;

        if (statusBadge) {
          statusBadge.className = "status-badge not-registered";
          statusBadge.textContent = "Not Registered";
        }

        showToast(`Registration cancelled for ${mealName}. (Demo state updated)`, "danger");
      } else {
        // Switch state to Registered
        button.classList.remove("is-not-registered");
        button.classList.add("is-registered");
        button.textContent = "Cancel " + mealName + " Registration";

        if (statusBadge) {
          statusBadge.className = "status-badge registered";
          statusBadge.textContent = "Registered ✓";
        }

        showToast(`Registered successfully for ${mealName}! (Demo state updated)`, "success");
      }

      // Visual reminder banner for presentation
      console.log(`[Demo Interaction]: ${mealName} toggled. Note: Not permanently persisted to database.`);
    });
  });

  // Optional: QR Pass regenerate demo button
  const btnRefreshQR = document.getElementById("btn-refresh-qr");
  if (btnRefreshQR) {
    btnRefreshQR.addEventListener("click", () => {
      const tokenDisplay = document.querySelector(".qr-token-label");
      if (tokenDisplay) {
        const randomCode = "KT-" + Math.floor(1000 + Math.random() * 9000);
        tokenDisplay.textContent = `Token: #${randomCode}`;
        showToast(`Generated new digital meal token: #${randomCode}`, "info");
      }
    });
  }
}

/* ==========================================================================
   3. ADMIN DASHBOARD: SIMULATION & LIVE COUNTERS
   ========================================================================== */
function initAdminInteractions() {
  const btnSimulateScan = document.getElementById("btn-simulate-scan");
  const countServedEl = document.getElementById("stat-served-count");
  const countLeftoverEl = document.getElementById("stat-leftover-count");
  const rosterTableBody = document.getElementById("admin-roster-body");

  // Sample student pool for scanner simulation
  const sampleStudents = [
    { name: "Stephen Strange", roll: "KT-CS-104", meal: "Lunch", room: "B-302" },
    { name: "Wong Kar-wai", roll: "KT-ME-211", meal: "Lunch", room: "A-108" },
    { name: "Clea Lake", roll: "KT-EE-045", meal: "Lunch", room: "C-412" },
    { name: "Karl Mordo", roll: "KT-CS-089", meal: "Lunch", room: "B-210" },
    { name: "America Chavez", roll: "KT-IT-119", meal: "Lunch", room: "C-204" }
  ];

  if (btnSimulateScan) {
    btnSimulateScan.addEventListener("click", () => {
      // Pick a student from the pool
      const randomStudent = sampleStudents[Math.floor(Math.random() * sampleStudents.length)];

      // Update Served Count
      if (countServedEl) {
        let currentServed = parseInt(countServedEl.innerText, 10) || 345;
        currentServed += 1;
        countServedEl.innerText = currentServed;
      }

      // Update Leftover / Unclaimed Count
      if (countLeftoverEl) {
        let currentLeftover = parseInt(countLeftoverEl.innerText, 10) || 175;
        if (currentLeftover > 0) {
          currentLeftover -= 1;
          countLeftoverEl.innerText = currentLeftover;
        }
      }

      // Add verified row to the top of table
      if (rosterTableBody) {
        const newRow = document.createElement("tr");
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const randomToken = "KT-" + Math.floor(1000 + Math.random() * 9000);

        newRow.innerHTML = `
          <td><strong>${randomStudent.name}</strong></td>
          <td>${randomStudent.roll}</td>
          <td>${randomStudent.room}</td>
          <td><span class="status-badge registered">${randomStudent.meal}</span></td>
          <td><span class="table-token-badge">#${randomToken}</span></td>
          <td><span class="status-badge registered">Verified (Just now)</span></td>
          <td><small class="text-muted">${currentTime}</small></td>
        `;

        // Insert at the top of the table
        rosterTableBody.insertBefore(newRow, rosterTableBody.firstChild);

        // Limit table rows to 10 for clean layout
        if (rosterTableBody.children.length > 10) {
          rosterTableBody.removeChild(rosterTableBody.lastChild);
        }
      }

      showToast(`Scan Verified: ${randomStudent.name} (${randomStudent.roll}) received meal pass!`, "success");
    });
  }

  // Admin Reset Button
  const btnResetAdmin = document.getElementById("btn-reset-admin");
  if (btnResetAdmin) {
    btnResetAdmin.addEventListener("click", () => {
      if (countServedEl) countServedEl.innerText = "345";
      if (countLeftoverEl) countLeftoverEl.innerText = "175";
      showToast("Admin dashboard counts reset to default sample values.", "info");
    });
  }
}

/* ==========================================================================
   4. ADMIN TABLE SEARCH & FILTERING (CLIENT-SIDE)
   ========================================================================== */
function initSearchFilter() {
  const searchInput = document.getElementById("table-search-input");
  const rosterTableBody = document.getElementById("admin-roster-body");

  if (!searchInput || !rosterTableBody) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = rosterTableBody.querySelectorAll("tr");

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      // Show row if it contains search query, otherwise hide
      row.style.display = text.includes(query) ? "" : "none";
    });
  });
}

/* ==========================================================================
   5. TOAST NOTIFICATION COMPONENT
   ========================================================================== */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");

  // If the container does not exist yet, create and append it
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // Icon depending on toast type
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "danger") icon = "⚠️";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   6. FEEDBACK & STAR RATING CONTROLLER
   ========================================================================== */
function initFeedback() {
  const ratingStars = document.querySelectorAll(".star-rating span");
  let selectedRating = 5;

  ratingStars.forEach(star => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.star, 10) || 5;
      ratingStars.forEach(s => {
        const starVal = parseInt(s.dataset.star, 10);
        if (starVal <= selectedRating) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // Category chip selection
  const chipButtons = document.querySelectorAll(".chip-btn");
  chipButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      chipButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Feedback form submission
  const feedbackForm = document.getElementById("mess-feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const mealSlot = document.getElementById("feedback-meal-slot")?.value || "Lunch";
      const commentsInput = document.getElementById("feedback-comments");
      const commentsText = commentsInput?.value.trim() || "Great meal overall!";
      const activeChip = document.querySelector(".chip-btn.active")?.innerText || "Taste & Flavor";

      const starsDisplay = "⭐".repeat(selectedRating);

      // Append to reviews list if available
      const reviewsList = document.querySelector(".reviews-list");
      if (reviewsList) {
        const newReview = document.createElement("div");
        newReview.className = "review-item";
        newReview.innerHTML = `
          <div class="review-header">
            <span>You (${mealSlot} • ${activeChip})</span>
            <span>${starsDisplay}</span>
          </div>
          <p class="review-text">"${commentsText}"</p>
        `;
        reviewsList.insertBefore(newReview, reviewsList.firstChild);
      }

      if (commentsInput) commentsInput.value = "";
      showToast("Thank you! Your refectory feedback has been submitted to the kitchen warden.", "success");
    });
  }
}

/* ==========================================================================
   7. HOW IT WORKS: SWIPABLE FEATURE CAROUSEL
   ========================================================================== */
function initFeatureCarousel() {
  const track = document.getElementById("carousel-track");
  const viewport = document.getElementById("carousel-viewport");
  const btnPrev = document.getElementById("carousel-btn-prev");
  const btnNext = document.getElementById("carousel-btn-next");
  const dots = document.querySelectorAll("#carousel-dots .carousel-dot");
  const stepIndicator = document.getElementById("carousel-step-indicator");

  if (!track || !viewport) return;

  const slides = track.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;
  let currentIndex = 0;

  function updateCarousel() {
    // Translate the track by -100% * currentIndex
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update indicator dots
    dots.forEach((dot, idx) => {
      const isActive = idx === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", isActive);
    });

    // Update step counter badge
    if (stepIndicator) {
      stepIndicator.textContent = `Feature ${currentIndex + 1} of ${totalSlides}`;
    }
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Button Listeners
  if (btnNext) btnNext.addEventListener("click", nextSlide);
  if (btnPrev) btnPrev.addEventListener("click", prevSlide);

  // Dots click listeners
  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      const slideIndex = parseInt(e.target.dataset.slide, 10);
      if (!isNaN(slideIndex)) {
        currentIndex = slideIndex;
        updateCarousel();
      }
    });
  });

  // Touch Swipe Support (Mobile & Tablet)
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe(touchStartX, touchEndX);
  }, { passive: true });

  // Mouse Drag Support (Desktop)
  let mouseStartX = 0;
  let mouseEndX = 0;
  let isMouseDown = false;

  viewport.addEventListener("mousedown", (e) => {
    mouseStartX = e.clientX;
    isMouseDown = true;
  });

  window.addEventListener("mouseup", (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    mouseEndX = e.clientX;
    handleSwipe(mouseStartX, mouseEndX);
  });

  function handleSwipe(start, end) {
    const threshold = 40; // Minimum drag distance in pixels
    const diff = start - end;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Keyboard Navigation (Left & Right arrows when user is focusing within viewport)
  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });
}



