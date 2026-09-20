/**
 * i18n.js
 * ---------------------------------------------------------------
 * Minimal, dependency-free bilingual (English / Bangla) text engine.
 *
 * How it works:
 *  - Every translatable element in index.html carries data-i18n="key".
 *    Its textContent is swapped when the language changes.
 *  - Inputs/labels that need a translated placeholder instead use
 *    data-i18n-placeholder="key".
 *  - Call I18N.set('en' | 'bn') to switch language. The choice is
 *    remembered in localStorage so it persists across visits.
 *  - Other modules (main.js) can react to a language switch by
 *    listening for the custom "gs:languagechange" event on window,
 *    which is useful for re-rendering dynamically built content
 *    (service cards, testimonials, gallery, etc).
 * ---------------------------------------------------------------
 */

const I18N = (() => {
  const STORAGE_KEY = "gs_lang";
  const DEFAULT_LANG = "en";

  const STRINGS = {
    en: {
      brand_name: "GhorSheba",
      skip_link: "Skip to main content",

      nav_services: "Services",
      nav_how: "How it works",
      nav_pricing: "Estimate a price",
      nav_areas: "Service areas",
      nav_reviews: "Reviews",
      nav_faq: "FAQ",
      nav_contact: "Contact",
      nav_book_btn: "Book a service",

      hero_title_line1: "One home.",
      hero_title_line2: "Every service, one call away.",
      hero_subtitle:
        "Verified technicians, transparent Taka pricing and booking in under two minutes — for everything from a leaking tap to a full interior fit-out.",
      hero_cta_book: "Book a service",
      hero_cta_services: "See all services",
      hero_trust_1: "NID-verified technicians",
      hero_trust_2: "Upfront BDT pricing",
      hero_trust_3: "Cash, bKash & Nagad",
      hero_stat_badge_label: "bookings completed",
      hero_stats_1_label: "verified technicians",
      hero_stats_2_label: "cities covered",
      hero_stats_3_label: "average rating",

      services_kicker: "What we do",
      services_title: "Eleven services, one platform",
      services_sub:
        "Pick a service to see indicative pricing and request a technician — no back-and-forth phone calls needed.",
      service_price_prefix: "Starting from",
      service_book_btn: "Book this",

      how_kicker: "The process",
      how_title: "Booking takes four steps",
      how_sub: "From choosing a service to a completed job, here's the whole journey.",
      how_1_title: "Choose a service",
      how_1_desc: "Pick from AC, electrical, plumbing, cleaning and more — see the price range up front.",
      how_2_title: "Share time & address",
      how_2_desc: "Tell us your area and a convenient slot. We match you with a nearby technician.",
      how_3_title: "Get confirmed",
      how_3_desc: "You'll get the technician's name, photo and phone number before they arrive.",
      how_4_title: "Pay after the job",
      how_4_desc: "Pay in cash, bKash, Nagad or Rocket only once the work is done to your satisfaction.",

      estimator_kicker: "Quick estimate",
      estimator_title: "Get a ballpark price in seconds",
      estimator_sub:
        "This calculator reads live from our service catalogue (data/services.json) and multiplies by quantity — a good example of the site fetching and using real data.",
      estimator_select_label: "Service",
      estimator_select_placeholder: "Select a service",
      estimator_qty_label: "Quantity / units",
      estimator_button: "Calculate estimate",
      estimator_result_prefix: "Estimated price",
      estimator_result_hint: "Final price is confirmed by the technician after inspection.",
      estimator_disclaimer:
        "Prices are indicative, for demonstration only, and may vary by area, condition and material cost.",

      why_kicker: "Why GhorSheba",
      why_title: "Built around trust, not just tasks",
      why_sub: "The details that make booking a stranger into your home feel safe.",
      why_1_title: "Verified technicians",
      why_1_desc: "Every technician's NID and address are checked before they join the platform.",
      why_2_title: "Transparent pricing",
      why_2_desc: "You see an estimate before booking and a final quote before work begins — no surprises.",
      why_3_title: "Fast response",
      why_3_desc: "Most bookings in Dhaka are confirmed with a technician within 60 minutes.",
      why_4_title: "Service warranty",
      why_4_desc: "7 to 30 days of free re-visit if the same issue reoccurs, depending on the service.",
      why_5_title: "Mobile banking ready",
      why_5_desc: "Pay however you like — cash on completion, bKash, Nagad, Rocket or card.",
      why_6_title: "24/7 support",
      why_6_desc: "Our support line and WhatsApp stay open around the clock for emergencies.",

      areas_kicker: "Coverage",
      areas_title: "Where we currently work",
      areas_sub: "Live in the metro areas below today, with more districts opening every quarter.",
      areas_more: "More cities coming soon",
      areas_office_label: "Head office",

      gallery_kicker: "Recent work",
      gallery_title: "A look at jobs we've completed",
      gallery_sub: "A small sample from our technicians' recent visits across Dhaka and Chattogram.",

      reviews_kicker: "Customer stories",
      reviews_title: "What customers are saying",
      reviews_sub: "Ratings and comments collected after each completed booking.",
      reviews_prev: "Previous review",
      reviews_next: "Next review",

      faq_kicker: "Good to know",
      faq_title: "Frequently asked questions",
      faq_sub: "Still unsure about something? Send us a message and we'll get back within the day.",

      booking_kicker: "Book now",
      booking_title: "Tell us what you need",
      booking_sub:
        "This demo form saves your booking in your browser's local storage — no server or account required — so you can see it appear instantly below.",
      form_name_label: "Full name",
      form_name_placeholder: "e.g. Rahim Uddin",
      form_phone_label: "Phone number",
      form_phone_placeholder: "017XXXXXXXX",
      form_service_label: "Service needed",
      form_service_placeholder: "Select a service",
      form_area_label: "City / area",
      form_area_placeholder: "Select your city",
      form_address_label: "Full address",
      form_address_placeholder: "House, road, area — e.g. House 4, Road 9, Dhanmondi",
      form_date_label: "Preferred date",
      form_time_label: "Preferred time",
      form_notes_label: "Additional notes (optional)",
      form_notes_placeholder: "Describe the problem briefly…",
      form_submit_btn: "Confirm booking",
      form_required_note: "Fields marked * are required.",
      toast_success_title: "Booking received",
      toast_success_body: "Booking",
      toast_success_saved: "has been saved on this device.",
      toast_deleted: "Booking removed.",
      toast_cleared: "All demo bookings cleared.",

      recent_title: "Your recent bookings (this device)",
      recent_empty: "No bookings yet — submit the form above and it will appear here instantly.",
      recent_clear_btn: "Clear demo data",
      recent_delete_btn: "Delete",
      recent_status: "Pending confirmation",

      contact_kicker: "Reach us",
      contact_title: "Talk to a real person",
      contact_sub: "Call, WhatsApp or visit — whichever is easiest for you.",
      contact_phone_label: "Hotline",
      contact_whatsapp_label: "WhatsApp",
      contact_email_label: "Email",
      contact_address_label: "Head office",
      contact_hours_label: "Support hours",
      contact_hours_value: "24/7, every day of the week",

      footer_tagline: "A demonstration home-services platform for Bangladesh, built as a front-end portfolio project.",
      footer_services_title: "Services",
      footer_company_title: "Company",
      footer_company_about: "About this project",
      footer_company_faq: "FAQ",
      footer_company_contact: "Contact",
      footer_legal_title: "Legal",
      footer_legal_terms: "Terms of service",
      footer_legal_privacy: "Privacy policy",
      footer_legal_note: "Demo content — not a registered business.",
      footer_built_with: "Built with HTML, CSS & vanilla JavaScript",
      footer_rights: "All rights reserved.",

      lang_toggle_label: "বাংলা",
      back_to_top: "Back to top",
    },

    bn: {
      brand_name: "ঘরসেবা",
      skip_link: "মূল কনটেন্টে যান",

      nav_services: "সেবাসমূহ",
      nav_how: "কীভাবে কাজ করে",
      nav_pricing: "মূল্য যাচাই",
      nav_areas: "সেবা এলাকা",
      nav_reviews: "রিভিউ",
      nav_faq: "প্রশ্নোত্তর",
      nav_contact: "যোগাযোগ",
      nav_book_btn: "বুক করুন",

      hero_title_line1: "একটাই ঘর।",
      hero_title_line2: "প্রতিটা সমস্যার সমাধান, এক কলেই।",
      hero_subtitle:
        "যাচাইকৃত টেকনিশিয়ান, স্বচ্ছ টাকার হিসাব আর দুই মিনিটেই বুকিং — কলের পানির ট্যাপ থেকে শুরু করে সম্পূর্ণ ইন্টেরিয়র পর্যন্ত সব কাজে।",
      hero_cta_book: "সেবা বুক করুন",
      hero_cta_services: "সব সেবা দেখুন",
      hero_trust_1: "এনআইডি যাচাইকৃত টেকনিশিয়ান",
      hero_trust_2: "আগে থেকে জানা টাকার হিসাব",
      hero_trust_3: "ক্যাশ, বিকাশ ও নগদ",
      hero_stat_badge_label: "সফল বুকিং সম্পন্ন",
      hero_stats_1_label: "যাচাইকৃত টেকনিশিয়ান",
      hero_stats_2_label: "শহরে সেবা চালু",
      hero_stats_3_label: "গড় রেটিং",

      services_kicker: "আমরা যা করি",
      services_title: "এগারোটি সেবা, একটি প্ল্যাটফর্ম",
      services_sub:
        "সেবা বেছে নিন, আনুমানিক মূল্য দেখুন এবং টেকনিশিয়ান চেয়ে পাঠান — বারবার ফোন করার দরকার নেই।",
      service_price_prefix: "শুরু",
      service_book_btn: "বুক করুন",

      how_kicker: "প্রক্রিয়া",
      how_title: "বুকিং মাত্র চার ধাপে",
      how_sub: "সেবা বেছে নেওয়া থেকে কাজ সম্পন্ন হওয়া পর্যন্ত পুরো যাত্রা এখানে।",
      how_1_title: "সেবা বেছে নিন",
      how_1_desc: "এসি, ইলেকট্রিক্যাল, প্লাম্বিং, ক্লিনিং সহ যেকোনো সেবা বেছে নিন — আগে থেকেই মূল্যের ধারণা পাবেন।",
      how_2_title: "সময় ও ঠিকানা দিন",
      how_2_desc: "আপনার এলাকা ও সুবিধাজনক সময় জানান। আমরা কাছাকাছি টেকনিশিয়ান পাঠাবো।",
      how_3_title: "নিশ্চিতকরণ পান",
      how_3_desc: "টেকনিশিয়ান আসার আগেই তার নাম, ছবি ও ফোন নম্বর জানিয়ে দেওয়া হবে।",
      how_4_title: "কাজ শেষে পেমেন্ট",
      how_4_desc: "কাজ আপনার পছন্দমতো শেষ হওয়ার পরই ক্যাশ, বিকাশ, নগদ বা রকেটে পেমেন্ট করুন।",

      estimator_kicker: "দ্রুত মূল্য যাচাই",
      estimator_title: "সেকেন্ডেই আনুমানিক মূল্য জানুন",
      estimator_sub:
        "এই ক্যালকুলেটরটি সরাসরি আমাদের সার্ভিস তালিকা (data/services.json) থেকে তথ্য নিয়ে পরিমাণ অনুযায়ী গুণ করে — সাইটটি বাস্তব ডাটা কীভাবে ব্যবহার করে তার একটি উদাহরণ।",
      estimator_select_label: "সেবা",
      estimator_select_placeholder: "একটি সেবা নির্বাচন করুন",
      estimator_qty_label: "পরিমাণ / ইউনিট",
      estimator_button: "মূল্য হিসাব করুন",
      estimator_result_prefix: "আনুমানিক মূল্য",
      estimator_result_hint: "পরিদর্শনের পর টেকনিশিয়ান চূড়ান্ত মূল্য নিশ্চিত করবেন।",
      estimator_disclaimer:
        "মূল্যগুলো শুধুমাত্র প্রদর্শনের উদ্দেশ্যে আনুমানিক — এলাকা, অবস্থা ও উপকরণের দাম অনুযায়ী ভিন্ন হতে পারে।",

      why_kicker: "কেন ঘরসেবা",
      why_title: "শুধু কাজ নয়, ভরসার ওপর গড়া",
      why_sub: "যেসব খুঁটিনাটি একজন অচেনা মানুষকে ঘরে ডাকাটাকে নিরাপদ করে তোলে।",
      why_1_title: "যাচাইকৃত টেকনিশিয়ান",
      why_1_desc: "প্ল্যাটফর্মে যোগ দেওয়ার আগে প্রতিটি টেকনিশিয়ানের এনআইডি ও ঠিকানা যাচাই করা হয়।",
      why_2_title: "স্বচ্ছ মূল্য",
      why_2_desc: "বুকিংয়ের আগে আনুমানিক ও কাজ শুরুর আগে চূড়ান্ত মূল্য জানিয়ে দেওয়া হয় — কোনো লুকানো খরচ নেই।",
      why_3_title: "দ্রুত সাড়া",
      why_3_desc: "ঢাকায় বেশিরভাগ বুকিং ৬০ মিনিটের মধ্যেই টেকনিশিয়ান নিশ্চিত হয়ে যায়।",
      why_4_title: "সার্ভিস ওয়ারেন্টি",
      why_4_desc: "একই সমস্যা আবার দেখা দিলে সেবাভেদে ৭ থেকে ৩০ দিন পর্যন্ত ফ্রি পুনরায় সার্ভিস।",
      why_5_title: "মোবাইল ব্যাংকিং সুবিধা",
      why_5_desc: "যেভাবে খুশি পেমেন্ট করুন — কাজ শেষে ক্যাশ, বিকাশ, নগদ, রকেট অথবা কার্ড।",
      why_6_title: "২৪/৭ সাপোর্ট",
      why_6_desc: "জরুরি প্রয়োজনে আমাদের সাপোর্ট লাইন ও হোয়াটসঅ্যাপ সবসময় খোলা থাকে।",

      areas_kicker: "সেবা এলাকা",
      areas_title: "বর্তমানে যেসব এলাকায় আছি",
      areas_sub: "নিচের শহরগুলোতে এখনই সেবা চালু আছে, প্রতি প্রান্তিকে নতুন জেলা যুক্ত হচ্ছে।",
      areas_more: "শীঘ্রই আরও শহরে",
      areas_office_label: "প্রধান কার্যালয়",

      gallery_kicker: "সাম্প্রতিক কাজ",
      gallery_title: "আমাদের সম্পন্ন করা কিছু কাজ",
      gallery_sub: "ঢাকা ও চট্টগ্রামে আমাদের টেকনিশিয়ানদের সাম্প্রতিক কিছু ভিজিটের ঝলক।",

      reviews_kicker: "গ্রাহকদের কথা",
      reviews_title: "গ্রাহকরা যা বলছেন",
      reviews_sub: "প্রতিটি সম্পন্ন বুকিংয়ের পর সংগ্রহ করা রেটিং ও মন্তব্য।",
      reviews_prev: "আগের রিভিউ",
      reviews_next: "পরের রিভিউ",

      faq_kicker: "জেনে রাখুন",
      faq_title: "সচরাচর জিজ্ঞাসা",
      faq_sub: "এখনও কিছু বুঝতে সমস্যা হচ্ছে? আমাদের বার্তা পাঠান, একই দিনে উত্তর পাবেন।",

      booking_kicker: "এখনই বুক করুন",
      booking_title: "আপনার প্রয়োজনটা জানান",
      booking_sub:
        "এই ডেমো ফর্মটি আপনার বুকিং সরাসরি ব্রাউজারের লোকাল স্টোরেজে সংরক্ষণ করে — কোনো সার্ভার বা অ্যাকাউন্ট ছাড়াই — তাই জমা দেওয়ার সাথে সাথেই নিচে দেখতে পাবেন।",
      form_name_label: "পূর্ণ নাম",
      form_name_placeholder: "যেমন: রহিম উদ্দিন",
      form_phone_label: "ফোন নম্বর",
      form_phone_placeholder: "০১৭XXXXXXXX",
      form_service_label: "প্রয়োজনীয় সেবা",
      form_service_placeholder: "একটি সেবা নির্বাচন করুন",
      form_area_label: "শহর / এলাকা",
      form_area_placeholder: "আপনার শহর বেছে নিন",
      form_address_label: "সম্পূর্ণ ঠিকানা",
      form_address_placeholder: "বাসা, রোড, এলাকা — যেমন: বাসা ৪, রোড ৯, ধানমন্ডি",
      form_date_label: "পছন্দের তারিখ",
      form_time_label: "পছন্দের সময়",
      form_notes_label: "অতিরিক্ত তথ্য (ঐচ্ছিক)",
      form_notes_placeholder: "সমস্যাটি সংক্ষেপে লিখুন…",
      form_submit_btn: "বুকিং নিশ্চিত করুন",
      form_required_note: "* চিহ্নিত ঘরগুলো পূরণ করা আবশ্যক।",
      toast_success_title: "বুকিং সম্পন্ন হয়েছে",
      toast_success_body: "বুকিং",
      toast_success_saved: "এই ডিভাইসে সংরক্ষণ করা হয়েছে।",
      toast_deleted: "বুকিং মুছে ফেলা হয়েছে।",
      toast_cleared: "সব ডেমো বুকিং মুছে ফেলা হয়েছে।",

      recent_title: "আপনার সাম্প্রতিক বুকিং (এই ডিভাইসে)",
      recent_empty: "এখনো কোনো বুকিং নেই — উপরের ফর্মটি পূরণ করলে সাথে সাথে এখানে দেখা যাবে।",
      recent_clear_btn: "ডেমো ডাটা মুছুন",
      recent_delete_btn: "মুছুন",
      recent_status: "নিশ্চিতকরণ বাকি",

      contact_kicker: "যোগাযোগ",
      contact_title: "সরাসরি কথা বলুন",
      contact_sub: "কল করুন, হোয়াটসঅ্যাপ করুন বা সরাসরি চলে আসুন — যেভাবে সুবিধা।",
      contact_phone_label: "হটলাইন",
      contact_whatsapp_label: "হোয়াটসঅ্যাপ",
      contact_email_label: "ইমেইল",
      contact_address_label: "প্রধান কার্যালয়",
      contact_hours_label: "সাপোর্ট সময়",
      contact_hours_value: "সপ্তাহের প্রতিদিন, ২৪ ঘণ্টা",

      footer_tagline: "বাংলাদেশের জন্য একটি ডেমো হোম-সার্ভিস প্ল্যাটফর্ম, ফ্রন্ট-এন্ড পোর্টফোলিও প্রজেক্ট হিসেবে তৈরি।",
      footer_services_title: "সেবাসমূহ",
      footer_company_title: "কোম্পানি",
      footer_company_about: "এই প্রজেক্ট সম্পর্কে",
      footer_company_faq: "প্রশ্নোত্তর",
      footer_company_contact: "যোগাযোগ",
      footer_legal_title: "আইনি তথ্য",
      footer_legal_terms: "সেবার শর্তাবলী",
      footer_legal_privacy: "প্রাইভেসি পলিসি",
      footer_legal_note: "ডেমো কনটেন্ট — নিবন্ধিত কোনো প্রতিষ্ঠান নয়।",
      footer_built_with: "তৈরি করা হয়েছে HTML, CSS ও ভ্যানিলা জাভাস্ক্রিপ্ট দিয়ে",
      footer_rights: "সর্বস্বত্ব সংরক্ষিত।",

      lang_toggle_label: "English",
      back_to_top: "উপরে যান",
    },
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  function t(key) {
    const table = STRINGS[currentLang] || STRINGS[DEFAULT_LANG];
    return table[key] !== undefined ? table[key] : key;
  }

  function applyToDom() {
    document.documentElement.setAttribute("lang", currentLang);
    document.body.classList.toggle("lang-bn", currentLang === "bn");
    document.body.classList.toggle("lang-en", currentLang === "en");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      el.setAttribute("aria-label", t(key));
    });

    document.querySelectorAll(".lang-toggle__label").forEach((el) => {
      el.textContent = t("lang_toggle_label");
    });
  }

  function set(lang) {
    if (lang !== "en" && lang !== "bn") return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyToDom();
    window.dispatchEvent(new CustomEvent("gs:languagechange", { detail: { lang } }));
  }

  function toggle() {
    set(currentLang === "en" ? "bn" : "en");
  }

  function init() {
    applyToDom();
  }

  return {
    init,
    set,
    toggle,
    t,
    get lang() {
      return currentLang;
    },
  };
})();
