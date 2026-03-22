// ══════════════════════════════════════
// scroll-sections.js
// 包含：Sidebar、Scroll Fade Panels、Carousel
// ══════════════════════════════════════


// ── 1. Sidebar ──────────────────────────
function Open() {
  document.getElementById("mySidebar").style.width = "100%";
  document.getElementById("mySidebar").style.display = "block";
}

function Close() {
  document.getElementById("mySidebar").style.display = "none";
}


// ── 2. Scroll Fade Panels ───────────────
(function () {
  const PANEL_COUNT = 3;
  const wrapper = document.getElementById('about-scroll-wrapper');
  const sticky  = document.getElementById('about-sticky');
  const spacer  = document.getElementById('about-spacer');
  const panels  = document.querySelectorAll('.about-panel');
  const dots    = document.querySelectorAll('.scroll-dot');

  let currentPanel = 0;

  function resize() {
    const vh = window.innerHeight;
    spacer.style.height = (PANEL_COUNT * vh) + 'px';
    sticky.style.height = vh + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  function showPanel(idx) {
    if (idx === currentPanel) return;
    panels[currentPanel].classList.remove('active');
    dots[currentPanel].classList.remove('active');
    currentPanel = idx;
    panels[currentPanel].classList.add('active');
    dots[currentPanel].classList.add('active');
  }

  window.addEventListener('scroll', function () {
    const rect          = wrapper.getBoundingClientRect();
    const wrapperTop    = -rect.top;
    const wrapperHeight = wrapper.offsetHeight - window.innerHeight;

    if (wrapperTop < 0 || wrapperTop > wrapperHeight) return;

    const progress = wrapperTop / wrapperHeight;
    const panelIdx = Math.min(PANEL_COUNT - 1, Math.floor(progress * PANEL_COUNT));
    showPanel(panelIdx);
  }, { passive: true });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      const wrapperTop    = wrapper.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = wrapper.offsetHeight - window.innerHeight;
      const target        = wrapperTop + (i / PANEL_COUNT) * sectionHeight;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

})();


// ── 3. Carousel（自動輪播）──────────────
function initCarousel(trackId, dotsId, images, autoplayMs) {
  autoplayMs = autoplayMs || 3000;
  var track   = document.getElementById(trackId);
  var dotsEl  = document.getElementById(dotsId);
  var current = 0;

  images.forEach(function (src) {
    var img = document.createElement("img");
    img.src = src;
    img.alt = "";
    track.appendChild(img);
  });

  images.forEach(function (_, i) {
    var d = document.createElement("div");
    d.className = "cdot" + (i === 0 ? " active" : "");
    dotsEl.appendChild(d);
  });

  function goTo(idx) {
    current = (idx + images.length) % images.length;
    track.style.transform = "translateX(-" + (current * 100) + "%)";
    dotsEl.querySelectorAll(".cdot").forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  setInterval(function () { goTo(current + 1); }, autoplayMs);
}

// ── 圖片清單：新增/移除圖片只改這裡 ──
var DIGITIMES_list = [
  "img/digitimes/kv/2025_10to12/1206新竹國際教育展.jpg",
  "img/digitimes/kv/2025_7to9/0808mcu.jpg",
  "img/digitimes/kv/2025_7to9/0718智慧機械.jpg",
  "img/digitimes/kv/2025_1to3/智-桌機Banner.jpg",
  "img/digitimes/kv/2025_1to3/優-桌機Banner.jpg",
  "img/digitimes/kv/2025_1to3/用-桌機Banner.jpg",
  "img/digitimes/project/2025創業家日報遊戲/首頁.jpg" 
  // 新增圖片加在這裡，格式同上
];
initCarousel("workCarouselTrack", "workCarouselDots", DIGITIMES_list, 3000);
