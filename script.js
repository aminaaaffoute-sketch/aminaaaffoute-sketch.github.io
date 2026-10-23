
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  // 1. Année automatique dans le footer
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  // 2. Menu de navigation sur mobile
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Ouvrir le menu" : "Fermer le menu"
    );
    navLinks.classList.toggle("open", !isOpen);
  });

  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // 3. Barre de progression et bouton retour en haut
  let ticking = false;

  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progressBar.style.width = `${progress}%`;
    backToTop.classList.toggle("visible", window.scrollY > 450);

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });

  updateScrollUI();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 4. Apparition progressive des sections
  const revealElements = document.querySelectorAll(".reveal");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 4) * 80}ms`;
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // 5. Mettre en évidence la section active
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((link) => {
              const active =
                link.getAttribute("href") === `#${entry.target.id}`;

              link.classList.toggle("active", active);
            });
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 6. Formulaire : préparer un e-mail
  // Remplacer cette adresse par ton adresse e-mail réelle.
  const recipientEmail = "ton.email@example.com";

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = formData.get("name").toString().trim();
    const email = formData.get("email").toString().trim();
    const subject = formData.get("subject").toString().trim();
    const message = formData.get("message").toString().trim();

    if (!name || !email || !subject || !message) {
      formFeedback.textContent =
        "Merci de remplir tous les champs.";
      return;
    }

    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(
      `Bonjour,\n\n${message}\n\nCordialement,\n${name}\n${email}`
    );

    formFeedback.textContent =
      "Ouverture de votre application e-mail...";

    window.location.href =
      `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
  });

  // 7. Effet subtil de mouvement sur le visuel du hero
  const heroVisual = document.querySelector(".hero-visual");

  if (heroVisual && !reduceMotion &&
      window.matchMedia("(pointer: fine)").matches) {
    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroVisual.style.setProperty("--mouse-x", `${x * 10}px`);
      heroVisual.style.setProperty("--mouse-y", `${y * 10}px`);
    });

    heroVisual.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--mouse-x", "0px");
      heroVisual.style.setProperty("--mouse-y", "0px");
    });
  }

  console.info("Portfolio initialisé avec succès.");
});
