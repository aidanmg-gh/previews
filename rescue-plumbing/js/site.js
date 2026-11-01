// 24/7 Rescue Plumbing: the few things the page does. Nothing loads from other sites.
document.documentElement.classList.add('js');

// The preview form doesn't send anywhere yet.
document.querySelectorAll('form.rq').forEach(function (f) {
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var p = f.querySelector('.done');
    if (p) { p.hidden = false; p.focus(); }
  });
});

// Menu bar gets a shadow once the page moves.
var nav = document.querySelector('.nav');
function onScroll() { if (nav) nav.classList.toggle('scrolled', scrollY > 120); }
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Sections rise in as they arrive; the review score counts up and its stars fill.
var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
var items = document.querySelectorAll('.svc article, .gal figure, .experts > *, .adv, .formbox, .reviews .wrap');
items.forEach(function (el, i) { el.classList.add('reveal'); el.style.setProperty('--d', (i % 3) * 90 + 'ms'); });
function arrive(el) {
  el.classList.add('in');
  var s = el.querySelector && el.querySelector('.score[data-to]');
  if (!s || still) return;
  var to = parseFloat(s.dataset.to), t0 = performance.now();
  (function step(t) {
    var p = Math.min(1, (t - t0) / 900);
    s.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(1);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
if ('IntersectionObserver' in window && !still) {
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { arrive(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  items.forEach(function (el) { io.observe(el); });
} else items.forEach(arrive);
