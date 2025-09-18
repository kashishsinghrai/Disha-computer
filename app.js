// Disha Computer Education Center - Interactive Features with Theme Support

document.addEventListener("DOMContentLoaded", function () {
  // Initialize theme system first
  initThemeSystem();

  // Navigation functionality
  initNavigation();

  // Form handling
  initContactForm();

  // Button interactions
  initButtonHandlers();

  // Smooth scrolling
  initSmoothScrolling();

  // Animation on scroll
  initScrollAnimations();

  // Course interactions
  initCourseInteractions();
});

// Theme System
function initThemeSystem() {
  const themeSwitcher = document.getElementById("themeSwitcher");
  const themeButtons = document.querySelectorAll(".theme-btn");
  const htmlElement = document.documentElement;

  if (!themeSwitcher || !themeButtons.length) {
    console.warn("Theme switcher elements not found");
    return;
  }

  console.log("Found theme buttons:", themeButtons.length);

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("disha-theme") || "dark";
  let currentTheme = savedTheme;

  console.log("Initial theme:", currentTheme);

  // Apply initial theme
  applyTheme(currentTheme);
  updateActiveThemeButton(currentTheme);

  // Handle system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    mediaQuery.addEventListener("change", (e) => {
      if (currentTheme === "system") {
        console.log("System preference changed, re-applying system theme");
        applyTheme("system");
      }
    });
  }

  // Add click handlers to theme buttons with explicit event handling
  themeButtons.forEach((button, index) => {
    console.log(
      `Setting up button ${index}:`,
      button.getAttribute("data-theme")
    );

    // Remove any existing event listeners to prevent duplicates
    button.removeEventListener("click", handleThemeClick);

    // Add new event listener
    button.addEventListener("click", handleThemeClick, { passive: false });

    // Add keyboard support
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleThemeClick.call(this, e);
      }
    });

    // Make buttons focusable
    button.setAttribute("tabindex", "0");
  });

  // Theme click handler function
  function handleThemeClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const theme = this.getAttribute("data-theme");
    console.log("Theme button clicked:", theme, "Current theme:", currentTheme);

    if (theme && theme !== currentTheme) {
      currentTheme = theme;
      console.log("Switching to theme:", theme);

      applyTheme(theme);
      updateActiveThemeButton(theme);
      saveTheme(theme);
      showNotification(
        `Switched to ${getThemeDisplayName(theme)} theme`,
        "success"
      );
    } else {
      console.log("Same theme clicked or invalid theme:", theme);
    }
  }

  function applyTheme(theme) {
    console.log("Applying theme:", theme);

    // Remove existing theme attributes
    htmlElement.removeAttribute("data-theme");
    htmlElement.classList.remove("theme-system", "theme-light", "theme-dark");

    // Apply specific theme
    htmlElement.setAttribute("data-theme", theme);
    htmlElement.classList.add(`theme-${theme}`);

    console.log("Theme applied to HTML element:", theme);
  }

  function updateActiveThemeButton(theme) {
    console.log("Updating active button for theme:", theme);

    themeButtons.forEach((btn) => {
      btn.classList.remove("active");
      const btnTheme = btn.getAttribute("data-theme");
      if (btnTheme === theme) {
        btn.classList.add("active");
        console.log("Activated button for theme:", btnTheme);
      }
    });
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("disha-theme", theme);
      console.log("Theme saved:", theme);
    } catch (e) {
      console.warn("Could not save theme preference:", e);
    }
  }

  function getThemeDisplayName(theme) {
    const names = {
      system: "System",
      light: "Light",
      dark: "Dark",
    };
    return names[theme] || theme;
  }

  // Keyboard shortcut for cycling themes (Alt + T)
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.key.toLowerCase() === "t") {
      e.preventDefault();
      const themes = ["system", "light", "dark"];
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];

      console.log("Keyboard shortcut triggered, switching to:", nextTheme);

      currentTheme = nextTheme;
      applyTheme(nextTheme);
      updateActiveThemeButton(nextTheme);
      saveTheme(nextTheme);
      showNotification(
        `Switched to ${getThemeDisplayName(nextTheme)} theme (Alt+T)`,
        "success"
      );
    }
  });

  console.log(
    "Theme system initialized successfully with theme:",
    currentTheme
  );
}

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!navToggle || !navMenu) return;

  // Toggle mobile menu
  navToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
    console.log("Mobile menu toggled");
  });

  // Close mobile menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.trim();
    const phone = formData.get("phone")?.trim();
    const course = formData.get("course");
    const message = formData.get("message")?.trim();

    // Clear previous errors
    clearFormErrors();

    // Validate form
    const errors = validateForm({ name, phone, course, message });

    if (errors.length > 0) {
      showFormErrors(errors);
      showNotification(errors[0], "error");
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    // Simulate form processing
    setTimeout(() => {
      // Create WhatsApp message
      const whatsappMessage = `Hello! I'm interested in joining Disha Computer Education Center.

Name: ${name}
Phone: ${phone}
Course: ${course}
Message: ${message || "No additional message"}

Please provide me with more information about the course and admission process.`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/916307769679?text=${encodedMessage}`;

      // Show success message
      showNotification(
        "Thank you! Your message has been sent. Redirecting to WhatsApp...",
        "success"
      );

      // Open WhatsApp in new tab
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1500);

      // Reset form and button
      contactForm.reset();
      setButtonLoading(submitBtn, false);
    }, 1000);
  });
}

// Enhanced form validation
function validateForm(data) {
  const errors = [];

  if (!data.name || data.name.length < 2) {
    errors.push("Please enter a valid name (at least 2 characters)");
    markFieldError("name");
  }

  if (!data.phone) {
    errors.push("Phone number is required");
    markFieldError("phone");
  } else if (!/^[0-9]{10}$/.test(data.phone.replace(/[\s\-\(\)]/g, ""))) {
    errors.push("Please enter a valid 10-digit phone number");
    markFieldError("phone");
  }

  if (!data.course) {
    errors.push("Please select a course you are interested in");
    markFieldError("course");
  }

  return errors;
}

function markFieldError(fieldName) {
  const field = document.getElementById(fieldName);
  if (field) {
    field.style.borderColor = "#ef4444";
    field.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)";
  }
}

function clearFormErrors() {
  const fields = ["name", "phone", "course", "message"];
  fields.forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    if (field) {
      field.style.borderColor = "";
      field.style.boxShadow = "";
    }
  });
}

function showFormErrors(errors) {
  // Remove existing error display
  const existingError = document.querySelector(".form-errors");
  if (existingError) {
    existingError.remove();
  }

  // Create error display
  const errorDiv = document.createElement("div");
  errorDiv.className = "form-errors";
  errorDiv.style.cssText = `
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 14px;
    `;

  errorDiv.innerHTML = `
        <strong>Please fix the following errors:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            ${errors.map((error) => `<li>${error}</li>`).join("")}
        </ul>
    `;

  const form = document.getElementById("contactForm");
  const formTitle = form.querySelector(".form-title");
  formTitle.parentNode.insertBefore(errorDiv, formTitle.nextSibling);
}

// Button handlers
function initButtonHandlers() {
  const startBatchBtn = document.getElementById("startBatchBtn");
  const joinNowBtn = document.getElementById("joinNowBtn");

  // Start New Batch button
  if (startBatchBtn) {
    startBatchBtn.addEventListener("click", function () {
      console.log("Start New Batch button clicked");
      // Scroll to contact section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });

        // Focus on course selection after scrolling
        setTimeout(() => {
          const courseSelect = document.getElementById("course");
          if (courseSelect) {
            courseSelect.focus();
            // Trigger a click to open dropdown on mobile
            courseSelect.click();
          }
        }, 800);
      }

      showNotification(
        "Please fill out the form below to start your course!",
        "info"
      );
    });
  }

  // Join Now button
  if (joinNowBtn) {
    joinNowBtn.addEventListener("click", function () {
      console.log("Join Now button clicked");
      // Create WhatsApp message for joining
      const message = encodeURIComponent(
        "Hello! I want to join a course at Disha Computer Education Center. Please provide me with more information about available batches and admission process."
      );
      const whatsappUrl = `https://wa.me/916307769679?text=${message}`;
      window.open(whatsappUrl, "_blank");
      showNotification("Opening WhatsApp to connect with us!", "success");
    });
  }

  // Special offer button
  const offerButton = document.querySelector(".offer-card .btn--secondary");
  if (offerButton) {
    offerButton.addEventListener("click", function () {
      console.log("Special offer button clicked");
      const message = encodeURIComponent(
        'Hello! I am interested in the special offer "CCC FREE in 1 year courses". Please provide me with more details about this offer and how I can enroll.'
      );
      const whatsappUrl = `https://wa.me/916307769679?text=${message}`;
      window.open(whatsappUrl, "_blank");
      showNotification(
        "Opening WhatsApp for special offer details!",
        "success"
      );
    });
  }

  // Phone number click handlers
  const phoneLinks = document.querySelectorAll(".phone, .contact-phone");
  phoneLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default tel: action
      const phoneNumber = this.textContent.replace(/[^0-9]/g, "");
      console.log("Phone number clicked:", phoneNumber);

      // Create WhatsApp link
      const message = encodeURIComponent(
        "Hello! I saw your contact number on the website and I am interested in joining Disha Computer Education Center. Please provide me with more information."
      );
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${message}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");
      showNotification(`Connecting via WhatsApp to ${phoneNumber}`, "success");
    });

    // Add visual feedback
    link.style.cursor = "pointer";
    link.title = "Click to message via WhatsApp";
  });
}

// Course interactions
function initCourseInteractions() {
  const courseItems = document.querySelectorAll(".course-item");

  courseItems.forEach((item) => {
    item.addEventListener("click", function () {
      const courseName = this.textContent.trim();
      console.log("Course item clicked:", courseName);
      const message = encodeURIComponent(
        `Hello! I am interested in the ${courseName} course. Please provide me with more information about the course duration, fees, and next batch timings.`
      );
      const whatsappUrl = `https://wa.me/916307769679?text=${message}`;
      window.open(whatsappUrl, "_blank");
      showNotification(`Inquiring about ${courseName} course...`, "info");
    });

    // Add hover effect and accessibility
    item.style.cursor = "pointer";
    item.title = "Click to inquire about this course";
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    // Keyboard accessibility
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbar = document.querySelector(".navbar");
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  // Add scroll-based animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Elements to animate
  const animateElements = document.querySelectorAll(
    ".course-category, .feature-item, .contact-item"
  );

  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Enhanced navbar scroll effect
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  const themeSwitcher = document.getElementById("themeSwitcher");

  if (navbar) {
    navbar.style.transition = "transform 0.3s ease-in-out";

    window.addEventListener("scroll", function () {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide navbar but keep theme switcher
        navbar.style.transform = "translateY(-100%)";
        if (themeSwitcher) {
          themeSwitcher.style.top = "20px";
        }
      } else {
        // Scrolling up - show navbar
        navbar.style.transform = "translateY(0)";
        if (themeSwitcher) {
          themeSwitcher.style.top = "80px";
        }
      }

      lastScrollTop = scrollTop;
    });
  }
}

// Enhanced notification system with theme awareness
function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification--${type}`;

  // Get current theme for styling
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const isLightTheme =
    currentTheme === "light" ||
    (currentTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: light)").matches);

  notification.style.cssText = `
        position: fixed;
        top: ${window.innerWidth <= 768 ? "140px" : "140px"};
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, ${isLightTheme ? "0.25" : "0.15"});
        z-index: 1001;
        max-width: 400px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        cursor: pointer;
        font-size: 14px;
        line-height: 1.4;
    `;

  notification.textContent = message;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  const autoRemoveTimeout = setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);

  // Click to dismiss
  notification.addEventListener("click", () => {
    clearTimeout(autoRemoveTimeout);
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  });
}

// Get notification color based on type
function getNotificationColor(type) {
  switch (type) {
    case "success":
      return "#22c55e";
    case "error":
      return "#ef4444";
    case "warning":
      return "#f59e0b";
    case "info":
    default:
      return "#3b82f6";
  }
}

// Loading states for better UX
function setButtonLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Sending...";
    button.style.opacity = "0.7";
    button.style.cursor = "not-allowed";
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || "Send Message";
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }
}

// Debug logging
console.log(
  "Disha Computer Education Center - JavaScript with theme support loaded successfully"
);

// Add some basic error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  showNotification(
    "An error occurred. Please refresh the page if issues persist.",
    "error"
  );
});

// Test all major functions on load
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Testing key elements...");
  console.log("Theme Switcher:", document.getElementById("themeSwitcher"));
  console.log("Theme Buttons:", document.querySelectorAll(".theme-btn").length);
  console.log("Start Batch Button:", document.getElementById("startBatchBtn"));
  console.log("Join Now Button:", document.getElementById("joinNowBtn"));
  console.log("Contact Form:", document.getElementById("contactForm"));
  console.log("Nav Toggle:", document.getElementById("navToggle"));
  console.log(
    "Phone Links:",
    document.querySelectorAll(".phone, .contact-phone").length
  );
  console.log(
    "Course Items:",
    document.querySelectorAll(".course-item").length
  );

  // Show welcome message after theme system is initialized
  setTimeout(() => {
    showNotification(
      "Welcome! Click theme buttons above or use Alt+T to switch themes.",
      "info"
    );
  }, 1000);
});
