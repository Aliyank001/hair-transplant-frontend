const loader = document.getElementById("loader");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const comparisonRange = document.getElementById("comparisonRange");
const comparisonOverlay = document.getElementById("comparisonOverlay");
const comparisonHandle = document.getElementById("comparisonHandle");
const testimonialTrack = document.getElementById("testimonialTrack");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
const counters = document.querySelectorAll(".counter");
const bookingForm = document.getElementById("bookingForm");
const formSuccess = document.getElementById("formSuccess");
const quickForm = document.getElementById("quickForm");
const newsletterForm = document.getElementById("newsletterForm");
const themeToggle = document.getElementById("themeToggle");
const htmlRoot = document.documentElement;
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPreview = document.getElementById("lightboxPreview");
const pageTransition = document.querySelector(".page-transition");

let testimonialIndex = 0;

function updateViewportHeightVar() {
  const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const safeVh = Math.max(1, viewportHeight) * 0.01;
  document.documentElement.style.setProperty("--app-vh", `${safeVh}px`);
}

updateViewportHeightVar();

window.addEventListener("resize", updateViewportHeightVar);
window.addEventListener("orientationchange", updateViewportHeightVar);
window.visualViewport?.addEventListener("resize", updateViewportHeightVar);
window.visualViewport?.addEventListener("scroll", updateViewportHeightVar);

window.addEventListener("load", () => {
  updateViewportHeightVar();

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1350);

  if (window.AOS) {
    AOS.init({
      duration: 900,
      offset: 80,
      once: true,
      easing: "ease-out-cubic"
    });
  }

  if (window.gsap) {
    gsap.from(".hero-content h1", { y: 28, opacity: 0, duration: 1.1, ease: "power3.out" });
    gsap.from(".hero-content p", { y: 20, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-cta .btn", { y: 18, opacity: 0, duration: 0.8, delay: 0.4, stagger: 0.12, ease: "power3.out" });
  }
});

hamburger?.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(!expanded));
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

comparisonRange?.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  comparisonOverlay.style.width = `${value}%`;
  if (comparisonHandle) {
    comparisonHandle.style.left = `${value}%`;
  }
});

if (comparisonRange && comparisonHandle) {
  comparisonHandle.style.left = `${comparisonRange.value}%`;
}

function showTestimonial(index) {
  const items = testimonialTrack?.querySelectorAll(".testimonial");
  if (!items || !items.length) {
    return;
  }

  items.forEach((item) => item.classList.remove("active"));
  items[index].classList.add("active");
}

prevTestimonial?.addEventListener("click", () => {
  const items = testimonialTrack.querySelectorAll(".testimonial");
  testimonialIndex = (testimonialIndex - 1 + items.length) % items.length;
  showTestimonial(testimonialIndex);
});

nextTestimonial?.addEventListener("click", () => {
  const items = testimonialTrack.querySelectorAll(".testimonial");
  testimonialIndex = (testimonialIndex + 1) % items.length;
  showTestimonial(testimonialIndex);
});

setInterval(() => {
  const items = testimonialTrack?.querySelectorAll(".testimonial");
  if (!items || !items.length) {
    return;
  }

  testimonialIndex = (testimonialIndex + 1) % items.length;
  showTestimonial(testimonialIndex);
}, 6000);

const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 90));

      const update = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = String(target);
          return;
        }

        counter.textContent = String(current);
        requestAnimationFrame(update);
      };

      update();
      observer.unobserve(counter);
    });
  },
  {
    threshold: 0.6
  }
);

counters.forEach((counter) => statsObserver.observe(counter));

function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) {
    return;
  }

  wrapper.classList.add("error-state");
  const error = wrapper.querySelector(".error");
  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(field) {
  const wrapper = field.closest(".field");
  if (!wrapper) {
    return;
  }

  wrapper.classList.remove("error-state");
  const error = wrapper.querySelector(".error");
  if (error) {
    error.textContent = "";
  }
}

function validateBookingForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("input[required], select[required]");

  requiredFields.forEach((field) => {
    clearFieldError(field);

    if (!field.value.trim()) {
      isValid = false;
      setFieldError(field, "This field is required.");
      return;
    }

    if (field.type === "email" && !field.validity.valid) {
      isValid = false;
      setFieldError(field, "Please enter a valid email.");
      return;
    }

    if (field.type === "tel" && !field.validity.valid) {
      isValid = false;
      setFieldError(field, "Please enter a valid phone number.");
      return;
    }

    if (field.type === "number") {
      const value = Number(field.value);
      if (value < 18 || value > 80) {
        isValid = false;
        setFieldError(field, "Age must be between 18 and 80.");
      }
    }
  });

  return isValid;
}

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateBookingForm(bookingForm)) {
    formSuccess.classList.remove("visible");
    return;
  }

  bookingForm.reset();
  formSuccess.classList.add("visible");
  setTimeout(() => formSuccess.classList.remove("visible"), 3400);
});

quickForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!quickForm.checkValidity()) {
    quickForm.reportValidity();
    return;
  }

  quickForm.reset();
  alert("Message sent. Our care team will contact you shortly.");
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!newsletterForm.checkValidity()) {
    newsletterForm.reportValidity();
    return;
  }

  newsletterForm.reset();
  alert("Thanks for subscribing to our newsletter.");
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  htmlRoot.setAttribute("data-theme", "light");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle?.addEventListener("click", () => {
  const current = htmlRoot.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  htmlRoot.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.innerHTML = next === "dark" ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;

  if (scrollTop > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  const parallaxValue = Math.min(scrollTop * 0.18, 75);
  document.querySelectorAll(".floating-dot").forEach((dot) => {
    dot.style.transform = `translateY(-${parallaxValue}px)`;
  });
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".lightbox-img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxPreview.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

document.querySelectorAll(".price-card, .doctor-card, .gallery img").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.remove("clicked");
    void card.offsetWidth;
    card.classList.add("clicked");
  });
});

lightboxClose?.addEventListener("click", () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    pageTransition.classList.add("active");
    setTimeout(() => pageTransition.classList.remove("active"), 360);
  });
});
