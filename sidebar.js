// Sidebar open / close — right slide-in panel
function Open() {
  var sb = document.getElementById("mySidebar");
  var ov = document.getElementById("sidebarOverlay");
  var hb = document.querySelector(".ham-btn");
  sb.classList.add("open");
  if (ov) ov.classList.add("active");
  if (hb) hb.classList.add("hidden");
  document.body.style.overflow = "hidden";
}

function Close() {
  var sb = document.getElementById("mySidebar");
  var ov = document.getElementById("sidebarOverlay");
  var hb = document.querySelector(".ham-btn");
  sb.classList.remove("open");
  if (ov) ov.classList.remove("active");
  if (hb) hb.classList.remove("hidden");
  document.body.style.overflow = "";
}
