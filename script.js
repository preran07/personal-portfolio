(function () {
  "use strict";

  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const backdrop = document.getElementById("nav-backdrop");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const form = document.getElementById("contact-form");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ----- Mobile menu ----- */
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    if (backdrop) {
      backdrop.classList.toggle("is-open", open);
      backdrop.hidden = !open;
    }
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setMenu(false);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  /* ----- Smooth scroll with sticky header offset ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ----- Active nav link while scrolling ----- */
  function updateActiveLink() {
    const header = document.querySelector(".site-header");
    const offset = (header ? header.offsetHeight : 0) + 80;
    let current = "home";

    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  /* ----- Contact form validation ----- */
  function showError(input, message) {
    const field = input.closest(".field");
    const error = field.querySelector(".field-error");
    field.classList.add("is-invalid");
    error.hidden = false;
    error.textContent = message;
  }

  function clearError(input) {
    const field = input.closest(".field");
    const error = field.querySelector(".field-error");
    field.classList.remove("is-invalid");
    error.hidden = true;
    error.textContent = "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = form.elements.namedItem("name");
      const email = form.elements.namedItem("email");
      const message = form.elements.namedItem("message");
      const status = document.getElementById("form-status");
      let valid = true;

      [name, email, message].forEach(clearError);
      status.textContent = "";
      status.classList.remove("is-success");

      if (!name.value.trim()) {
        showError(name, "Please enter your name.");
        valid = false;
      }

      if (!email.value.trim()) {
        showError(email, "Please enter your email.");
        valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        valid = false;
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, "Please write a message of at least 10 characters.");
        valid = false;
      }

      if (!valid) return;

      status.classList.add("is-success");
      status.textContent = "Thanks, " + name.value.trim() + ". Your message has been recorded. I will get back to you soon.";
      form.reset();
    });
  }
})();
