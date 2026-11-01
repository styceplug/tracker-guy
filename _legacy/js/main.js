(function () {
  var S = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // contact details from config
  $$('[data-cfg]').forEach(function (el) {
    var k = el.getAttribute('data-cfg'), v = S[k] || '', mode = el.getAttribute('data-href');
    if (k === 'whatsapp') { el.href = 'https://wa.me/' + v; el.target = '_blank'; el.rel = 'noopener'; return; }
    if (el.children.length === 0 && el.textContent.trim() === '') el.textContent = v;
    if (mode === 'tel') el.href = 'tel:' + v.replace(/[^\d+]/g, '');
    if (mode === 'mailto') el.href = 'mailto:' + v;
  });
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  // mobile menu
  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  });

  // active link on scroll
  var links = $$('#menu a'), ids = links.map(function (a) { return a.getAttribute('href'); });
  var secs = ids.map(function (id) { return $(id); });
  function spy() {
    var y = window.scrollY + 140, cur = 0;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('is-active', i === cur); });
  }
  window.addEventListener('scroll', spy, { passive: true }); spy();

  // plan buttons pre-fill the message
  var msg = $('textarea[name=msg]');
  $$('[data-plan]').forEach(function (b) {
    b.addEventListener('click', function () { msg.value = 'I am interested in the ' + b.getAttribute('data-plan') + ' plan.'; });
  });

  // quote form -> WhatsApp
  var form = $('#quote'), note = $('#quoteNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    ['name', 'phone'].forEach(function (n) {
      var bad = !f[n].value.trim(); f[n].classList.toggle('err', bad); if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Please fill in your name and phone number.'; return; }
    var text = 'Hello, I would like a tracker quote.\n' +
      'Name: ' + f.name.value.trim() + '\n' +
      'Phone: ' + f.phone.value.trim() + '\n' +
      'Vehicle: ' + f.vehicle.value +
      (f.msg.value.trim() ? '\nMessage: ' + f.msg.value.trim() : '');
    note.textContent = 'Opening WhatsApp...';
    window.open('https://wa.me/' + (S.whatsapp || '') + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
})();
