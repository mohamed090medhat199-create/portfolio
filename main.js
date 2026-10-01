(function () {
  "use strict";

  var root = document.documentElement;
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var themeToggle = document.getElementById("theme-toggle");

  /* ---------- Navbar: change appearance on scroll ---------- */
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false);
  });

  window.matchMedia("(min-width: 1001px)").addEventListener("change", function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Theme toggle ---------- */
  function syncThemeLabel() {
    var dark = root.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  syncThemeLabel();

  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    syncThemeLabel();
  });

  /* ---------- Profile photo: show placeholder until a photo exists ---------- */
  var photo = document.getElementById("profile-photo");
  if (photo) {
    var frame = photo.closest(".photo");
    var markEmpty = function () { frame.classList.add("photo--empty"); };
    photo.addEventListener("error", markEmpty);
    if (photo.complete && photo.naturalWidth === 0) markEmpty();
  }

  /* ---------- Project screenshots: click to enlarge ---------- */
  var box = document.getElementById("lightbox");
  var boxImg = document.getElementById("lightbox-img");
  if (box && typeof box.showModal === "function") {
    Array.prototype.forEach.call(document.querySelectorAll("[data-zoom]"), function (btn) {
      var img = btn.querySelector("img");
      btn.setAttribute("aria-label", "Enlarge image: " + img.alt);
      btn.addEventListener("click", function () {
        boxImg.src = img.currentSrc || img.src;
        boxImg.alt = img.alt;
        box.showModal();
      });
    });
    document.getElementById("lightbox-close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  /* ---------- Highlight the nav link of the section in view ---------- */
  var links = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-link]"), function (a) {
    links[a.getAttribute("data-link")] = a;
  });

  var sections = document.querySelectorAll("section[data-nav]");

  function setActive(name) {
    Object.keys(links).forEach(function (key) {
      var active = key === name;
      links[key].classList.toggle("is-active", active);
      if (active) links[key].setAttribute("aria-current", "true");
      else links[key].removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.getAttribute("data-nav"));
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    Array.prototype.forEach.call(sections, function (s) { observer.observe(s); });
  }
})();
