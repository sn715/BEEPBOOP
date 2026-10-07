// Site behavior. Each feature is a small init function, called once at the bottom.
// Values (prices, sample URLs) come from js/config.js.

(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Analytics ----------
  // Single place every tracked event goes through. Once the Meta Pixel snippet is
  // added to <head>, window.fbq exists and these calls start reporting.
  function track(eventName, data) {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, data);
    }
  }

  // ---------- Prices: fill any [data-price="key"] from config ----------
  function initPrices() {
    const prices = config.prices || {};
    const format = new Intl.NumberFormat(config.locale || "en-US", {
      style: "currency",
      currency: config.currency || "USD",
      maximumFractionDigits: 0,
    });

    document.querySelectorAll("[data-price]").forEach((el) => {
      const value = prices[el.dataset.price];
      if (typeof value === "number") el.textContent = format.format(value);
    });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  // ---------- Email capture: any <form data-form="email-capture"> ----------
  function initEmailForms() {
    document.querySelectorAll('[data-form="email-capture"]').forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        // TODO: send form.email.value to the email provider.
        track("Lead", { content_name: "reservation", location: form.dataset.location });

        const button = form.querySelector('button[type="submit"]');
        form.classList.add("is-done");
        button.textContent = "you're on the list";
        button.disabled = true;
        form.email.readOnly = true;
      });
    });

    document.querySelectorAll("[data-cta]").forEach((el) => {
      el.addEventListener("click", () => track("ViewContent", { cta: el.dataset.cta }));
    });
  }

  // ---------- A/B audio player ----------
  // Plays the phone and device samples in sync and swaps which one is audible,
  // so the comparison is instant. Without sample URLs it stays an honest placeholder.
  function initAbPlayer() {
    const player = document.querySelector("[data-ab-player]");
    if (!player) return;

    const samples = config.samples || {};
    const hasAudio = Boolean(samples.phone && samples.device);
    const playBtn = player.querySelector("[data-ab-play]");
    const status = player.querySelector("[data-ab-status]");
    const options = player.querySelectorAll("[data-ab-source]");

    let source = "phone";
    const tracks = {};

    if (hasAudio) {
      ["phone", "device"].forEach((key) => {
        const audio = new Audio(samples[key]);
        audio.preload = "metadata";
        audio.loop = true;
        tracks[key] = audio;
      });
      status.textContent = "press the record, then switch between the two.";
    } else {
      player.classList.add("is-placeholder");
    }

    function applySource() {
      options.forEach((opt) => {
        const active = opt.dataset.abSource === source;
        opt.setAttribute("aria-checked", String(active));
      });
      player.dataset.source = source;
      if (hasAudio) {
        tracks.phone.muted = source !== "phone";
        tracks.device.muted = source !== "device";
      }
    }

    function setPlaying(playing) {
      player.classList.toggle("is-playing", playing);
      playBtn.setAttribute("aria-label", playing ? "Pause sample" : "Play sample");
      playBtn.dataset.cursorLabel = playing ? "pause" : "play";
    }

    playBtn.addEventListener("click", () => {
      if (!hasAudio) {
        status.textContent = "there are no real samples yet. this will play as soon as there are.";
        player.classList.remove("is-nudged");
        void player.offsetWidth; // restart the nudge animation
        player.classList.add("is-nudged");
        return;
      }

      const playing = !tracks.phone.paused;
      if (playing) {
        tracks.phone.pause();
        tracks.device.pause();
        setPlaying(false);
      } else {
        tracks.device.currentTime = tracks.phone.currentTime;
        Promise.all([tracks.phone.play(), tracks.device.play()])
          .then(() => {
            setPlaying(true);
            track("ViewContent", { content_name: "ab-player" });
          })
          .catch(() => {
            status.textContent = "the sample couldn't be played. please try again.";
          });
      }
    });

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        source = opt.dataset.abSource;
        applySource();
      });
    });

    applySource();
  }

  // ---------- Scroll words: text in [data-scroll-words] lights up word by word ----------
  function initScrollWords() {
    const block = document.querySelector("[data-scroll-words]");
    if (!block || prefersReducedMotion) return;

    const words = [];
    block.querySelectorAll("p").forEach((p) => {
      const parts = p.textContent.trim().split(/\s+/);
      p.textContent = "";
      parts.forEach((part, i) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = part;
        p.appendChild(span);
        if (i < parts.length - 1) p.appendChild(document.createTextNode(" "));
        words.push(span);
      });
    });

    let ticking = false;
    function update() {
      const rect = block.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top hits 85% of the viewport, 1 when its bottom reaches 55%
      const start = vh * 0.85;
      const end = vh * 0.55;
      const progress = (start - rect.top) / (rect.height + start - end);
      const lit = Math.round(Math.min(Math.max(progress, 0), 1) * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // ---------- Tilt: [data-tilt] leans gently toward the mouse ----------
  function initTilt() {
    if (prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const target = el.firstElementChild;
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        target.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
      });
      el.addEventListener("mouseleave", () => {
        target.style.setProperty("--tilt-x", "0deg");
        target.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  // ---------- Scroll reveal ----------
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    items.forEach((el) => observer.observe(el));
  }

  // ---------- Sticky mobile CTA: hide while a signup form is visible ----------
  function initStickyCta() {
    const bar = document.querySelector("[data-sticky-cta]");
    if (!bar || !("IntersectionObserver" in window)) return;

    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      bar.classList.toggle("is-hidden", visible.size > 0);
    });
    document.querySelectorAll('[data-form="email-capture"]').forEach((form) => observer.observe(form));
  }

  // ---------- Custom cursor (mouse/trackpad only) ----------
  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = document.createElement("div");
    cursor.className = "cursor is-hidden";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="cursor__label"></span>';
    document.body.appendChild(cursor);
    document.documentElement.classList.add("has-cursor");

    const label = cursor.querySelector(".cursor__label");
    const interactive = "a, button, summary, label, [data-cursor-label]";
    let x = 0;
    let y = 0;
    let frame = null;

    function render() {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = null;
    }

    document.addEventListener("mousemove", (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.remove("is-hidden");
      if (!frame) frame = requestAnimationFrame(render);
    });

    document.addEventListener("mouseover", (event) => {
      const target = event.target;
      const overField = target.closest("input, textarea, select");
      const overInteractive = target.closest(interactive);
      const text = overInteractive ? overInteractive.dataset.cursorLabel || "" : "";

      cursor.classList.toggle("is-field", Boolean(overField));
      cursor.classList.toggle("is-hover", Boolean(overInteractive));
      cursor.classList.toggle("has-label", Boolean(text));
      label.textContent = text;
    });

    // Refresh the label after a click (e.g. Play becomes Pause)
    document.addEventListener("click", (event) => {
      const el = event.target.closest("[data-cursor-label]");
      if (el) label.textContent = el.dataset.cursorLabel;
    });

    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));
  }

  initPrices();
  initYear();
  initEmailForms();
  initAbPlayer();
  initTilt();
  initScrollWords();
  initReveal();
  initStickyCta();
  initCursor();
})();
