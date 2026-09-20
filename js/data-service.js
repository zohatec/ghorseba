/**
 * data-service.js
 * ---------------------------------------------------------------
 * Everything related to reading and storing data for GhorSheba.
 *
 * 1) Service catalogue
 *    - Loaded with fetch() from data/services.json (async/await).
 *    - If the page is opened directly from disk (file://) some
 *      browsers block fetch() of local files with a CORS error.
 *      In that case we fall back to an identical, embedded copy of
 *      the catalogue so the demo still works without a local server.
 *      (Deploying to GitHub Pages / Netlify / Vercel avoids this
 *      entirely, since fetch() works normally over http/https.)
 *
 * 2) Bookings ("free data storage")
 *    - This is a static front-end project with no paid backend, so
 *      booking submissions are stored using the browser's
 *      localStorage under the key BOOKINGS_KEY. That makes the
 *      "Recent bookings" list persist across page reloads on the
 *      same device/browser, which is enough to demonstrate a full
 *      create → read → delete data flow.
 *    - Swapping this for a real backend later (Firebase, Supabase,
 *      a Google Sheet via Apps Script, or a small REST API) only
 *      means rewriting the four functions below — the rest of the
 *      app talks to GSData, not to localStorage directly.
 * ---------------------------------------------------------------
 */

const GSData = (() => {
  const BOOKINGS_KEY = "ghorsheba_bookings_v1";
  const SERVICES_URL = "data/services.json";

  // Fallback copy — keep in sync with data/services.json.
  const FALLBACK_SERVICES = [
    { id: "ac", icon: "fa-snowflake", name_en: "AC Servicing", name_bn: "এসি সার্ভিসিং", desc_en: "Full cleaning, gas pressure check and cooling inspection for split & window ACs.", desc_bn: "স্প্লিট ও উইন্ডো এসির সম্পূর্ণ ক্লিনিং, গ্যাস প্রেশার চেক ও কুলিং পরীক্ষা।", price_from: 800, unit_en: "per unit", unit_bn: "প্রতি ইউনিট" },
    { id: "electrician", icon: "fa-bolt", name_en: "Electrician", name_bn: "ইলেকট্রিশিয়ান", desc_en: "Wiring, switch & socket repair, fan/light installation and circuit troubleshooting.", desc_bn: "ওয়্যারিং, সুইচ-সকেট মেরামত, ফ্যান/লাইট ইনস্টলেশন ও সার্কিট সমস্যার সমাধান।", price_from: 300, unit_en: "visit charge", unit_bn: "ভিজিট চার্জ" },
    { id: "plumber", icon: "fa-wrench", name_en: "Plumber", name_bn: "প্লাম্বার", desc_en: "Leak fixing, pipe fitting, basin/commode installation and water line service.", desc_bn: "লিকেজ মেরামত, পাইপ ফিটিং, বেসিন/কমোড ইনস্টলেশন ও পানির লাইন সার্ভিস।", price_from: 350, unit_en: "visit charge", unit_bn: "ভিজিট চার্জ" },
    { id: "cleaning", icon: "fa-broom", name_en: "Home Cleaning", name_bn: "ক্লিনিং সার্ভিস", desc_en: "Deep cleaning for kitchen, bathroom, sofa and full apartment, move-in/move-out ready.", desc_bn: "রান্নাঘর, বাথরুম, সোফা ও পুরো ফ্ল্যাটের ডিপ ক্লিনিং — বাসা বদলের আগে-পরে উপযোগী।", price_from: 1500, unit_en: "per visit", unit_bn: "প্রতি ভিজিট" },
    { id: "pest", icon: "fa-bug", name_en: "Pest Control", name_bn: "পেস্ট কন্ট্রোল", desc_en: "Cockroach, termite, mosquito and bed-bug treatment using safe, licensed chemicals.", desc_bn: "নিরাপদ ও লাইসেন্সকৃত কেমিক্যাল দিয়ে তেলাপোকা, উইপোকা, মশা ও ছারপোকা দমন।", price_from: 1200, unit_en: "per visit", unit_bn: "প্রতি ভিজিট" },
    { id: "interior", icon: "fa-couch", name_en: "Interior Design", name_bn: "ইন্টেরিয়র ডিজাইন", desc_en: "Space planning, 3D visualization and full execution for homes and small offices.", desc_bn: "বাসা ও ছোট অফিসের জন্য স্পেস প্ল্যানিং, থ্রিডি ডিজাইন ও সম্পূর্ণ কার্যকর।", price_from: 5000, unit_en: "consultation", unit_bn: "কনসালটেশন থেকে" },
    { id: "painting", icon: "fa-paint-roller", name_en: "Painting", name_bn: "রং করা (পেইন্টিং)", desc_en: "Interior & exterior wall painting with premium and distemper options, putty included.", desc_bn: "পুটি সহ ইনটেরিয়র ও এক্সটেরিয়র দেয়াল রং — প্রিমিয়াম ও ডিসটেম্পার উভয় অপশনে।", price_from: 15, unit_en: "per sq. ft.", unit_bn: "প্রতি বর্গফুট" },
    { id: "cctv", icon: "fa-video", name_en: "CCTV Installation", name_bn: "সিসিটিভি ইনস্টলেশন", desc_en: "IP & analog camera setup with mobile app access, cabling and DVR/NVR configuration.", desc_bn: "মোবাইল অ্যাপ অ্যাক্সেসসহ আইপি ও অ্যানালগ ক্যামেরা সেটআপ, ক্যাবলিং ও DVR/NVR কনফিগারেশন।", price_from: 3000, unit_en: "per camera (labor)", unit_bn: "প্রতি ক্যামেরা (লেবার)" },
    { id: "solar", icon: "fa-solar-panel", name_en: "Solar Installation", name_bn: "সোলার ইনস্টলেশন", desc_en: "On-grid & off-grid rooftop solar systems sized to your household load, with net-metering help.", desc_bn: "বাসার লোড অনুযায়ী অন-গ্রিড ও অফ-গ্রিড রুফটপ সোলার সিস্টেম, নেট-মিটারিং সহায়তাসহ।", price_from: 45000, unit_en: "small system", unit_bn: "ছোট সিস্টেম থেকে" },
    { id: "moving", icon: "fa-truck-moving", name_en: "Moving Service", name_bn: "বাসা পরিবর্তন (মুভিং)", desc_en: "Packing, loading, transport and unloading with trained movers and covered vans.", desc_bn: "প্রশিক্ষিত মুভার ও ঢাকা ভ্যানসহ প্যাকিং, লোডিং, পরিবহন ও আনলোডিং সেবা।", price_from: 3000, unit_en: "local move", unit_bn: "লোকাল মুভ থেকে" },
    { id: "appliance", icon: "fa-screwdriver-wrench", name_en: "Appliance Repair", name_bn: "যন্ত্রপাতি মেরামত", desc_en: "Fridge, washing machine, microwave and TV diagnosis with genuine spare parts.", desc_bn: "ফ্রিজ, ওয়াশিং মেশিন, মাইক্রোওয়েভ ও টিভির সমস্যা নির্ণয় ও অরিজিনাল যন্ত্রাংশ প্রতিস্থাপন।", price_from: 300, unit_en: "diagnosis fee", unit_bn: "ডায়াগনসিস ফি" },
  ];

  let cachedServices = null;

  async function fetchServices() {
    if (cachedServices) return cachedServices;
    try {
      const res = await fetch(SERVICES_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Network response was not OK");
      const json = await res.json();
      cachedServices = json;
      return json;
    } catch (err) {
      console.warn(
        "[GhorSheba] Could not fetch data/services.json (this is expected if you opened index.html directly from disk). Using the built-in fallback catalogue instead.",
        err
      );
      cachedServices = FALLBACK_SERVICES;
      return FALLBACK_SERVICES;
    }
  }

  function getBookings() {
    try {
      const raw = localStorage.getItem(BOOKINGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("[GhorSheba] Failed to read bookings from localStorage:", err);
      return [];
    }
  }

  function generateBookingId() {
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `GS-${Date.now().toString().slice(-6)}${rand}`;
  }

  function saveBooking(booking) {
    const bookings = getBookings();
    const record = {
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      ...booking,
    };
    bookings.unshift(record);
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (err) {
      console.error("[GhorSheba] Failed to save booking to localStorage:", err);
    }
    return record;
  }

  function deleteBooking(id) {
    const bookings = getBookings().filter((b) => b.id !== id);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return bookings;
  }

  function clearBookings() {
    localStorage.removeItem(BOOKINGS_KEY);
    return [];
  }

  return {
    fetchServices,
    getBookings,
    saveBooking,
    deleteBooking,
    clearBookings,
  };
})();
