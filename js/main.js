/**
 * main.js
 * ---------------------------------------------------------------
 * Wires together I18N (js/i18n.js) and GSData (js/data-service.js)
 * with the DOM: renders dynamic sections, and handles every
 * interaction on the page (nav, reveal-on-scroll, counters,
 * estimator, testimonials carousel, FAQ accordion, booking form).
 * ---------------------------------------------------------------
 */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------
   * Content that is bilingual but not part of the small UI-chrome
   * dictionary in i18n.js — kept next to the code that renders it.
   * ------------------------------------------------------------- */
  const AREAS = [
    {
      en: "Dhaka — Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Badda",
      bn: "ঢাকা — ধানমন্ডি, গুলশান, বনানী, উত্তরা, মিরপুর, বাড্ডা",
    },
    { en: "Chattogram", bn: "চট্টগ্রাম" },
    { en: "Sylhet", bn: "সিলেট" },
    { en: "Rajshahi", bn: "রাজশাহী" },
    { en: "Khulna", bn: "খুলনা" },
  ];

  const CITY_OPTIONS = [
    { value: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    { value: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    { value: "sylhet", en: "Sylhet", bn: "সিলেট" },
    { value: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    { value: "khulna", en: "Khulna", bn: "খুলনা" },
  ];

  const GALLERY = [
    {
      img: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1",
      cat_en: "Electrical repair",
      cat_bn: "ইলেকট্রিক্যাল মেরামত",
      alt_en: "Electrician working on a circuit breaker panel with colourful wires",
      alt_bn: "রঙিন তারসহ সার্কিট ব্রেকার প্যানেলে কাজ করছেন ইলেকট্রিশিয়ান",
    },
    {
      img: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1",
      cat_en: "Plumbing",
      cat_bn: "প্লাম্বিং",
      alt_en: "Plumber fitting steel water pipes indoors",
      alt_bn: "বাসার ভেতরে স্টিলের পানির পাইপ ফিটিং করছেন প্লাম্বার",
    },
    {
      img: "https://images.pexels.com/photos/5583126/pexels-photo-5583126.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1",
      cat_en: "Wall painting",
      cat_bn: "দেয়াল রং",
      alt_en: "Roller applying fresh paint to a beige wall",
      alt_bn: "দেয়ালে রোলার দিয়ে নতুন রং করা হচ্ছে",
    },
    {
      img: "https://images.pexels.com/photos/9875446/pexels-photo-9875446.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1",
      cat_en: "Solar installation",
      cat_bn: "সোলার ইনস্টলেশন",
      alt_en: "Technician carrying a solar panel onto a rooftop",
      alt_bn: "ছাদে সোলার প্যানেল বহন করছেন টেকনিশিয়ান",
    },
    {
      img: "https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1",
      cat_en: "Pipe fitting",
      cat_bn: "পাইপ ফিটিং",
      alt_en: "Plumber installing a radiator pipe connection",
      alt_bn: "রেডিয়েটরের পাইপ সংযোগ স্থাপন করছেন প্লাম্বার",
    },
    {
      img: "https://images.pexels.com/photos/5194861/pexels-photo-5194861.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1",
      cat_en: "General & appliance repair",
      cat_bn: "সাধারণ ও যন্ত্রপাতি মেরামত",
      alt_en: "Organised set of hand tools used for repairs",
      alt_bn: "মেরামতের কাজে ব্যবহৃত গোছানো হ্যান্ড টুলসের সেট",
    },
  ];

  const TESTIMONIALS = [
    {
      name_en: "Rafia Akter",
      name_bn: "রাফিয়া আক্তার",
      loc_en: "Dhanmondi, Dhaka",
      loc_bn: "ধানমন্ডি, ঢাকা",
      service_en: "AC Servicing",
      service_bn: "এসি সার্ভিসিং",
      rating: 5,
      quote_en:
        "The technician arrived on time, showed his ID card, and explained the gas-refill cost before starting. No surprises at the end.",
      quote_bn:
        "টেকনিশিয়ান সময়মতো এসেছিলেন, আইডি কার্ড দেখিয়েছেন এবং কাজ শুরুর আগেই গ্যাস রিফিলের খরচ জানিয়ে দিয়েছেন। শেষে কোনো চমক ছিল না।",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name_en: "Kamrul Hasan",
      name_bn: "কামরুল হাসান",
      loc_en: "Uttara, Dhaka",
      loc_bn: "উত্তরা, ঢাকা",
      service_en: "Electrical Rewiring",
      service_bn: "ইলেকট্রিক্যাল রিওয়্যারিং",
      rating: 5,
      quote_en:
        "Booked in the evening and had an electrician at my door the next morning. The final price matched exactly what the estimator showed.",
      quote_bn:
        "সন্ধ্যায় বুকিং দিয়েছিলাম, পরদিন সকালেই ইলেকট্রিশিয়ান দরজায় হাজির। চূড়ান্ত মূল্য এস্টিমেটরে দেখানো টাকার সাথে হুবহু মিলে গেছে।",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      name_en: "Nazmun Nahar",
      name_bn: "নাজমুন নাহার",
      loc_en: "Panchlaish, Chattogram",
      loc_bn: "পাঁচলাইশ, চট্টগ্রাম",
      service_en: "Home Cleaning",
      service_bn: "ক্লিনিং সার্ভিস",
      rating: 4.5,
      quote_en:
        "Two cleaners arrived with their own equipment and finished our three-bedroom flat in under four hours. Booking again for spring cleaning.",
      quote_bn:
        "দুইজন ক্লিনার নিজেদের সরঞ্জামসহ এসেছিলেন এবং চার ঘণ্টারও কম সময়ে তিন-বেডরুমের ফ্ল্যাট পরিষ্কার করে দিয়েছেন। সামনের বার আবার বুক করবো।",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
  ];

  const FAQ = [
    {
      q_en: "How long does booking take?",
      q_bn: "বুকিং করতে কত সময় লাগে?",
      a_en:
        "Filling the booking form takes about a minute. In Dhaka, most requests are matched with a nearby technician within 30–60 minutes.",
      a_bn:
        "বুকিং ফর্মটি পূরণ করতে প্রায় এক মিনিট সময় লাগে। ঢাকায় বেশিরভাগ অনুরোধ ৩০–৬০ মিনিটের মধ্যেই কাছাকাছি টেকনিশিয়ানের সাথে মিলিয়ে দেওয়া হয়।",
    },
    {
      q_en: "How do I pay?",
      q_bn: "পেমেন্ট কীভাবে করব?",
      a_en:
        "Pay the technician directly once the job is done — cash, bKash, Nagad, Rocket or card, whichever is convenient for you.",
      a_bn:
        "কাজ শেষ হওয়ার পর সরাসরি টেকনিশিয়ানকে পেমেন্ট করুন — ক্যাশ, বিকাশ, নগদ, রকেট অথবা কার্ড, যেটি আপনার জন্য সুবিধাজনক।",
    },
    {
      q_en: "Are technicians verified?",
      q_bn: "টেকনিশিয়ানরা কি যাচাইকৃত?",
      a_en:
        "Yes. Every technician's National ID and permanent address are verified, and their customer ratings are tracked continuously.",
      a_bn:
        "হ্যাঁ। প্রতিটি টেকনিশিয়ানের জাতীয় পরিচয়পত্র ও স্থায়ী ঠিকানা যাচাই করা হয়, এবং তাদের গ্রাহক রেটিং নিয়মিত ট্র্যাক করা হয়।",
    },
    {
      q_en: "What if I'm not satisfied with the work?",
      q_bn: "সেবা পছন্দ না হলে কী হবে?",
      a_en:
        "Most services include a 7–30 day warranty. Report the same issue within that window and a technician re-visits free of charge.",
      a_bn:
        "বেশিরভাগ সেবায় ৭–৩০ দিনের ওয়ারেন্টি থাকে। এই সময়ের মধ্যে একই সমস্যা জানালে ফ্রিতে পুনরায় টেকনিশিয়ান পাঠানো হয়।",
    },
    {
      q_en: "Do you cover emergencies?",
      q_bn: "জরুরি প্রয়োজনে সেবা পাওয়া যায়?",
      a_en:
        "Yes — electrical and plumbing emergencies are prioritised and can usually be attended to the same day, including outside office hours.",
      a_bn:
        "হ্যাঁ — ইলেকট্রিক্যাল ও প্লাম্বিং জরুরি প্রয়োজনগুলো অগ্রাধিকার পায় এবং সাধারণত অফিস সময়ের বাইরেও একই দিনে সমাধান করা হয়।",
    },
    {
      q_en: "Which cities can I book in?",
      q_bn: "কোন কোন শহরে বুকিং করা যাবে?",
      a_en:
        "Dhaka, Chattogram, Sylhet, Rajshahi and Khulna today, with new districts being added every quarter.",
      a_bn:
        "বর্তমানে ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী ও খুলনায় সেবা পাওয়া যায়, প্রতি প্রান্তিকে নতুন জেলা যুক্ত হচ্ছে।",
    },
  ];

  let SERVICES_CACHE = [];

  /* ----------------------------------------------------------------
   * Small helpers
   * ------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const lang = () => I18N.lang;

  function formatBDT(n) {
    return "৳" + Number(n).toLocaleString("en-US");
  }

  /* ----------------------------------------------------------------
   * Header / mobile nav
   * ------------------------------------------------------------- */
  function initHeader() {
    const header = $(".site-header");
    const toggleBtn = $(".nav-toggle");
    const nav = $("#primary-nav");

    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    });

    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    $$('#primary-nav a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });

    // Smooth scroll with sticky-header offset for every in-page anchor.
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = header.offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
  }

  /* ----------------------------------------------------------------
   * Language toggle buttons (desktop + mobile)
   * ------------------------------------------------------------- */
  function initLanguageToggle() {
    $$(".lang-toggle").forEach((btn) => {
      btn.addEventListener("click", () => I18N.toggle());
    });
  }

  /* ----------------------------------------------------------------
   * Reveal-on-scroll (one restrained utility used across sections)
   * ------------------------------------------------------------- */
  function initReveal() {
    const items = $$(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------------
   * Animated counters (hero stat strip)
   * ------------------------------------------------------------- */
  function initCounters() {
    const counters = $$("[data-count-to]");
    if (!counters.length) return;

    const animate = (el) => {
      const target = Number(el.getAttribute("data-count-to"));
      const suffix = el.getAttribute("data-count-suffix") || "";
      const decimals = Number(el.getAttribute("data-count-decimals") || 0);

      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------------
   * Services grid (fetched from data/services.json)
   * ------------------------------------------------------------- */
  function serviceCardHTML(svc) {
    const name = svc[`name_${lang()}`];
    const desc = svc[`desc_${lang()}`];
    const unit = svc[`unit_${lang()}`];
    return `
      <article class="service-card cut-sm reveal" data-service-id="${svc.id}">
        <div class="service-card__icon"><i class="fa-solid ${svc.icon}" aria-hidden="true"></i></div>
        <h3 class="service-card__name">${name}</h3>
        <p class="service-card__desc">${desc}</p>
        <div class="service-card__price">
          <span class="service-card__price-label" data-i18n="service_price_prefix">${I18N.t("service_price_prefix")}</span>
          <strong>${formatBDT(svc.price_from)}</strong>
          <span class="service-card__unit">${unit}</span>
        </div>
        <a class="service-card__cta" href="#booking" data-service-target="${svc.id}">
          <span data-i18n="service_book_btn">${I18N.t("service_book_btn")}</span>
          <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i>
        </a>
      </article>`;
  }

  function renderServices() {
    const grid = $("#services-grid");
    if (!grid) return;
    grid.innerHTML = SERVICES_CACHE.map(serviceCardHTML).join("");
    initReveal();

    $$('a[data-service-target]', grid).forEach((link) => {
      link.addEventListener("click", () => {
        const select = $("#booking-service");
        if (select) select.value = link.getAttribute("data-service-target");
      });
    });
  }

  function fillServiceSelects() {
    const selects = [$("#estimator-service"), $("#booking-service")];
    selects.forEach((select) => {
      if (!select) return;
      const current = select.value;
      const placeholderKey = select.id === "estimator-service" ? "estimator_select_placeholder" : "form_service_placeholder";
      const options = [`<option value="" disabled selected>${I18N.t(placeholderKey)}</option>`].concat(
        SERVICES_CACHE.map(
          (svc) => `<option value="${svc.id}">${svc[`name_${lang()}`]} — ${formatBDT(svc.price_from)}</option>`
        )
      );
      select.innerHTML = options.join("");
      if (current) select.value = current;
    });
  }

  function fillAreaSelect() {
    const select = $("#booking-area");
    if (!select) return;
    const current = select.value;
    const options = [`<option value="" disabled selected>${I18N.t("form_area_placeholder")}</option>`].concat(
      CITY_OPTIONS.map((c) => `<option value="${c.value}">${c[lang()]}</option>`)
    );
    select.innerHTML = options.join("");
    if (current) select.value = current;
  }

  /* ----------------------------------------------------------------
   * Price estimator
   * ------------------------------------------------------------- */
  function initEstimator() {
    const form = $("#estimator-form");
    if (!form) return;
    const resultBox = $("#estimator-result");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const serviceId = $("#estimator-service").value;
      const qty = Math.max(1, Number($("#estimator-qty").value) || 1);
      const svc = SERVICES_CACHE.find((s) => s.id === serviceId);

      if (!svc) {
        resultBox.classList.remove("is-visible");
        return;
      }
      const total = svc.price_from * qty;
      resultBox.innerHTML = `
        <span class="estimator-result__label">${I18N.t("estimator_result_prefix")} — ${svc[`name_${lang()}`]}</span>
        <span class="estimator-result__value">${formatBDT(total)}</span>
        <span class="estimator-result__hint">${I18N.t("estimator_result_hint")}</span>`;
      resultBox.classList.add("is-visible");
    });
  }

  /* ----------------------------------------------------------------
   * Why-choose-us / Areas / Gallery / FAQ (static-ish, language aware)
   * ------------------------------------------------------------- */
  function renderAreas() {
    const wrap = $("#areas-list");
    if (!wrap) return;
    wrap.innerHTML = AREAS.map(
      (a) => `<li class="area-chip"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${a[lang()]}</li>`
    ).join("");
  }

  function renderGallery() {
    const wrap = $("#gallery-grid");
    if (!wrap) return;
    wrap.innerHTML = GALLERY.map(
      (g, i) => `
      <figure class="gallery-item cut-sm reveal" style="transition-delay:${(i % 3) * 80}ms">
        <img src="${g.img}" alt="${g[`alt_${lang()}`]}" loading="lazy" width="600" height="600" />
        <figcaption>${g[`cat_${lang()}`]}</figcaption>
      </figure>`
    ).join("");
    initReveal();
  }

  function starString(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let html = "";
    for (let i = 0; i < full; i++) html += '<i class="fa-solid fa-star"></i>';
    if (half) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="fa-regular fa-star"></i>';
    return html;
  }

  let testimonialIndex = 0;
  function renderTestimonials() {
    const track = $("#testimonial-track");
    const dots = $("#testimonial-dots");
    if (!track) return;

    track.innerHTML = TESTIMONIALS.map(
      (t) => `
      <article class="testimonial-card">
        <div class="testimonial-card__stars" aria-hidden="true">${starString(t.rating)}</div>
        <p class="testimonial-card__quote">“${t[`quote_${lang()}`]}”</p>
        <div class="testimonial-card__person">
          <img src="${t.avatar}" alt="${t[`name_${lang()}`]}" width="48" height="48" loading="lazy" />
          <div>
            <strong>${t[`name_${lang()}`]}</strong>
            <span>${t[`loc_${lang()}`]} · ${t[`service_${lang()}`]}</span>
          </div>
        </div>
      </article>`
    ).join("");

    if (dots) {
      dots.innerHTML = TESTIMONIALS.map(
        (_, i) => `<button class="testimonial-dot" data-index="${i}" aria-label="Review ${i + 1}"></button>`
      ).join("");
    }
    goToTestimonial(testimonialIndex, true);
  }

  function goToTestimonial(index, immediate = false) {
    const track = $("#testimonial-track");
    const dots = $$(".testimonial-dot");
    if (!track) return;
    const count = TESTIMONIALS.length;
    testimonialIndex = (index + count) % count;
    track.style.transition = immediate && prefersReducedMotion ? "none" : "";
    track.style.transform = `translateX(-${testimonialIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === testimonialIndex));
  }

  function initTestimonialControls() {
    $("#testimonial-prev")?.addEventListener("click", () => goToTestimonial(testimonialIndex - 1));
    $("#testimonial-next")?.addEventListener("click", () => goToTestimonial(testimonialIndex + 1));
    $("#testimonial-dots")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".testimonial-dot");
      if (btn) goToTestimonial(Number(btn.getAttribute("data-index")));
    });

    if (!prefersReducedMotion) {
      let autoplay = setInterval(() => goToTestimonial(testimonialIndex + 1), 6000);
      const track = $(".testimonial-viewport");
      track?.addEventListener("mouseenter", () => clearInterval(autoplay));
      track?.addEventListener("mouseleave", () => {
        autoplay = setInterval(() => goToTestimonial(testimonialIndex + 1), 6000);
      });
    }
  }

  function renderFAQ() {
    const wrap = $("#faq-list");
    if (!wrap) return;
    wrap.innerHTML = FAQ.map(
      (item, i) => `
      <div class="faq-item">
        <button class="faq-item__q" id="faq-btn-${i}" aria-expanded="false" aria-controls="faq-panel-${i}">
          <span>${item[`q_${lang()}`]}</span>
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
        </button>
        <div class="faq-item__a" id="faq-panel-${i}" role="region" aria-labelledby="faq-btn-${i}">
          <p>${item[`a_${lang()}`]}</p>
        </div>
      </div>`
    ).join("");
    initAccordion();
  }

  function initAccordion() {
    $$(".faq-item__q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        $$(".faq-item__q").forEach((other) => {
          if (other !== btn) {
            other.setAttribute("aria-expanded", "false");
            other.nextElementSibling.style.maxHeight = null;
            other.closest(".faq-item").classList.remove("is-open");
          }
        });

        btn.setAttribute("aria-expanded", String(!isOpen));
        btn.closest(".faq-item").classList.toggle("is-open", !isOpen);
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
      });
    });
  }

  /* ----------------------------------------------------------------
   * Toast notifications
   * ------------------------------------------------------------- */
  function showToast(title, body) {
    const container = $("#toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <div><strong>${title}</strong><p>${body}</p></div>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  /* ----------------------------------------------------------------
   * Booking form + "recent bookings" (localStorage-backed)
   * ------------------------------------------------------------- */
  function bookingRowHTML(b) {
    const svc = SERVICES_CACHE.find((s) => s.id === b.serviceId);
    const serviceName = svc ? svc[`name_${lang()}`] : b.serviceId;
    const cityLabel = CITY_OPTIONS.find((c) => c.value === b.area)?.[lang()] || b.area;
    const dateStr = b.date ? new Date(b.date).toLocaleDateString(lang() === "bn" ? "bn-BD" : "en-GB") : "—";

    return `
      <li class="booking-row" data-id="${b.id}">
        <div class="booking-row__main">
          <span class="booking-row__id">${b.id}</span>
          <strong>${serviceName}</strong>
          <span class="booking-row__meta">${b.name} · ${cityLabel} · ${dateStr}${b.time ? " · " + b.time : ""}</span>
        </div>
        <div class="booking-row__actions">
          <span class="booking-row__status" data-i18n="recent_status">${I18N.t("recent_status")}</span>
          <button class="booking-row__delete" data-id="${b.id}" data-i18n="recent_delete_btn">${I18N.t("recent_delete_btn")}</button>
        </div>
      </li>`;
  }

  function renderBookings() {
    const list = $("#recent-bookings-list");
    const empty = $("#recent-bookings-empty");
    const clearBtn = $("#recent-clear-btn");
    if (!list) return;
    const bookings = GSData.getBookings();

    if (!bookings.length) {
      list.innerHTML = "";
      if (empty) empty.style.display = "block";
      if (clearBtn) clearBtn.style.display = "none";
      return;
    }
    if (empty) empty.style.display = "none";
    if (clearBtn) clearBtn.style.display = "inline-flex";
    list.innerHTML = bookings.map(bookingRowHTML).join("");
  }

  function initBookingForm() {
    const form = $("#booking-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const booking = {
        name: $("#booking-name").value.trim(),
        phone: $("#booking-phone").value.trim(),
        serviceId: $("#booking-service").value,
        area: $("#booking-area").value,
        address: $("#booking-address").value.trim(),
        date: $("#booking-date").value,
        time: $("#booking-time").value,
        notes: $("#booking-notes").value.trim(),
      };
      const saved = GSData.saveBooking(booking);
      renderBookings();
      form.reset();
      showToast(
        I18N.t("toast_success_title"),
        `${I18N.t("toast_success_body")} ${saved.id} ${I18N.t("toast_success_saved")}`
      );
    });

    $("#recent-bookings-list")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".booking-row__delete");
      if (!btn) return;
      GSData.deleteBooking(btn.getAttribute("data-id"));
      renderBookings();
      showToast(I18N.t("toast_success_title"), I18N.t("toast_deleted"));
    });

    $("#recent-clear-btn")?.addEventListener("click", () => {
      GSData.clearBookings();
      renderBookings();
      showToast(I18N.t("toast_success_title"), I18N.t("toast_cleared"));
    });

    // Prevent picking a date in the past.
    const dateInput = $("#booking-date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }
  }

  /* ----------------------------------------------------------------
   * Footer year
   * ------------------------------------------------------------- */
  function initFooterYear() {
    const el = $("#footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------
   * Re-render everything that has bilingual dynamic content
   * ------------------------------------------------------------- */
  function renderDynamicContent() {
    renderServices();
    fillServiceSelects();
    fillAreaSelect();
    renderAreas();
    renderGallery();
    renderTestimonials();
    renderFAQ();
    renderBookings();
  }

  window.addEventListener("gs:languagechange", renderDynamicContent);

  /* ----------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------- */
  async function init() {
    I18N.init();
    initHeader();
    initLanguageToggle();
    initFooterYear();
    initBookingForm();
    initEstimator();
    initTestimonialControls();
    initCounters();

    SERVICES_CACHE = await GSData.fetchServices();
    renderDynamicContent();
    initReveal();

    document.body.classList.add("is-ready");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
