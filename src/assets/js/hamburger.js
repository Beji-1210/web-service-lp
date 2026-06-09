// =====================================
// ハンバーガーメニュー（ドロワー）
// =====================================
const drawerIcon    = document.querySelector(".p-drawer__icon");
const drawer        = document.querySelector(".p-drawer");
const drawerNavItem = document.querySelectorAll('.p-drawer__body a[href^="#"]');
const body          = document.body;
const breakpoint    = 900;
let isMenuOpen = false;

const openMenu = () => {
  if (!drawer.classList.contains("js-show")) {
    drawer.classList.add("js-show");
    drawerIcon.classList.add("js-show");
    body.classList.add("is-fixed");
  }
};

const closeMenu = () => {
  if (drawer.classList.contains("js-show")) {
    drawer.classList.remove("js-show");
    drawerIcon.classList.remove("js-show");
    body.classList.remove("is-fixed");
    isMenuOpen = false;
  }
};

const toggleMenu = () => drawer.classList.contains("js-show") ? closeMenu() : openMenu();

const clickOuter = (event) => {
  if (drawer.classList.contains("js-show") && !drawer.contains(event.target) && isMenuOpen) {
    closeMenu();
  } else if (drawer.classList.contains("js-show") && !drawer.contains(event.target)) {
    isMenuOpen = true;
  }
};

drawerIcon.addEventListener("click", toggleMenu);
window.addEventListener("resize", () => { if (window.innerWidth > breakpoint) closeMenu(); });
document.addEventListener("click", clickOuter);

drawerNavItem.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();
    const target = document.querySelector(item.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});
