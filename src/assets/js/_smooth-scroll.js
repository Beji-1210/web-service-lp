// =====================================
// ページ内リンク（スムーズスクロール）
// =====================================
const linkScroll = (target) => {
  const header = document.querySelector(".l-header");
  const headerOffset = header ? header.offsetHeight : 0;
  const offsetPosition = target === document.documentElement
    ? 0
    : target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

const links = document.querySelectorAll('a[href^="#"]');
links.forEach((item) => {
  item.addEventListener("click", (event) => {
    const targetId = item.getAttribute("href");
    const target   = targetId === "#" || targetId === ""
      ? document.documentElement
      : document.querySelector(targetId);
    if (target) { event.preventDefault(); linkScroll(target); }
  });
});
