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


// ── 2. Scroll Fade Panels + Freelance Tab 聯動 ──
(function () {

  // 滾動總段數：panel-1(1段) + panel-2(1段) + panel-freelance(3段) + panel-exhibitions(1段) = 6段
  var TOTAL_STEPS = 7;
  var PANEL_COUNT = 4;   // about-panel 數量
  var TAB_STEPS = 4;   // freelance 內 tab 數
  var TAB_ORDER = ['web', 'video', 'visual', 'game'];

  var wrapper = document.getElementById('about-scroll-wrapper');
  var sticky = document.getElementById('about-sticky');
  var spacer = document.getElementById('about-spacer');
  var panels = document.querySelectorAll('.about-panel');
  var dots = document.querySelectorAll('.scroll-dot');

  var currentPanel = 0;
  var currentTabIdx = 0;
  var freelanceDone = false;

  function resize() {
    var vh = window.innerHeight;
    var multiplier = window.innerWidth <= 720 ? 2.8 : 1; //手機版每段變成 2.8倍高
    spacer.style.height = (TOTAL_STEPS * vh * multiplier) + 'px';
    sticky.style.height = vh + 'px';
  }
  
  // 手機版：停用 sticky scroll，CSS 已改成正常流排列
  if (window.innerWidth <= 720) {
    // 不初始化 scroll 監聽，讓 CSS 的正常流排列生效
    return;
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

  function showTab(tabIdx) {
    if (tabIdx === currentTabIdx) return;
    currentTabIdx = tabIdx;
    var tabName = TAB_ORDER[tabIdx];
    document.querySelectorAll('.ftab').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    document.querySelectorAll('.ftab-content').forEach(function (c) {
      c.classList.toggle('active', c.dataset.tab === tabName);
    });
    if (tabIdx === TAB_STEPS - 1) {
      freelanceDone = true;
      var lockedDot = document.querySelector('.scroll-dot[data-panel="3"]');
      if (lockedDot) lockedDot.classList.remove('locked');
    }
  }

  window.addEventListener('scroll', function () {
    var rect = wrapper.getBoundingClientRect();
    var wrapperTop = -rect.top;
    var wrapperHeight = wrapper.offsetHeight - window.innerHeight;

    if (wrapperTop < 0 || wrapperTop > wrapperHeight) return;

    var progress = wrapperTop / wrapperHeight;
    var step = Math.min(TOTAL_STEPS - 1, Math.floor(progress * TOTAL_STEPS));

    // step 0 → panel-1, step 1 → panel-2
    // step 2/3/4 → panel-freelance (tab web/video/visual)
    // step 5 → panel-exhibitions（需 freelanceDone）
    if (step <= 1) {
      showPanel(step);
    } else if (step <= 5) { 
      showPanel(2);
      showTab(step - 2);
    } else {
      if (freelanceDone) {
        showPanel(3);
      } else {
        showPanel(2);
        showTab(TAB_STEPS - 1);
      }
    }
  }, { passive: true });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      if (i === 3 && !freelanceDone) return;
      var wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      var wrapperHeight = wrapper.offsetHeight - window.innerHeight;
      var stepMap = [0, 1, 2, TOTAL_STEPS - 1];
      var target = wrapperTop + (stepMap[i] / TOTAL_STEPS) * wrapperHeight;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // 初始鎖定第 4 個圓點
  var lockedDot = document.querySelector('.scroll-dot[data-panel="3"]');
  if (lockedDot) lockedDot.classList.add('locked');

})();


// ── 4. Freelance Tab 手動點擊 ──────────
document.querySelectorAll('.ftab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var tabName = this.dataset.tab;
    var TAB_ORDER = ['web', 'video', 'visual', 'game'];
    var stepMap = { web: 2, video: 3, visual: 4, game: 5 };
    var TOTAL_STEPS = 7;  // ← 6 改成 7

    document.querySelectorAll('.ftab').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });
    document.querySelectorAll('.ftab-content').forEach(function (c) {
      c.classList.toggle('active', c.dataset.tab === tabName);
    });

    var wrapper = document.getElementById('about-scroll-wrapper');
    var wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    var wrapperHeight = wrapper.offsetHeight - window.innerHeight;
    var target = wrapperTop + (stepMap[tabName] / TOTAL_STEPS) * wrapperHeight;
    window.scrollTo({ top: target, behavior: 'instant' });
  });
});


// ── 3. Carousel（自動輪播）──────────────
function initCarousel(trackId, dotsId, images, autoplayMs) {
  autoplayMs = autoplayMs || 3000;
  var track = document.getElementById(trackId);
  var dotsEl = document.getElementById(dotsId);
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


// ── 5. 主視覺淡出（手機版）──────────────
(function () {
  var hero = document.querySelector('.image-container');
  if (!hero) return;

  window.addEventListener('scroll', function () {
    // 只在手機版作用
    if (window.innerWidth > 720) {
      hero.style.opacity = '';
      return;
    }

    var scrollY = window.scrollY;
    var heroHeight = hero.offsetHeight;

    // scrollY 從 0 到 heroHeight 的一半時淡出
    var fadeEnd = heroHeight * 0.5;
    var opacity = 1 - (scrollY / fadeEnd);
    opacity = Math.max(0, Math.min(1, opacity));

    hero.style.opacity = opacity;
  }, { passive: true });
})();

// ── 6. Panel 自動縮放（手機版）──────────
(function () {
  var MAX_HEIGHT = 800;

  function scalePanel() {
    // 手機版改為正常流，不需要縮放
    if (window.innerWidth <= 720) {
      document.querySelectorAll('.about-panel').forEach(function (p) {
        p.style.transform = '';
        p.style.transformOrigin = '';
      });
      return;
    }

    if (window.innerWidth > 720) {
      // 電腦版還原
      document.querySelectorAll('.about-panel').forEach(function (p) {
        p.style.transform = '';
        p.style.transformOrigin = '';
      });
      return;
    }

    var vh = window.innerHeight;
    if (vh >= MAX_HEIGHT) return; // 夠高就不縮

    var scale = vh / MAX_HEIGHT;

    document.querySelectorAll('.about-panel').forEach(function (p) {
      p.style.transform = 'scale(' + scale + ')';
      p.style.transformOrigin = 'top center';
    });
  }

  scalePanel();
  window.addEventListener('resize', scalePanel);
})();