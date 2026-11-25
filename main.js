(function () {
  // Демо-чат: сообщения появляются по очереди, цикл повторяется.
  var chat = document.getElementById('chat');
  var msgs = chat ? [].slice.call(chat.querySelectorAll('.msg')) : [];
  var status = document.getElementById('chat-status');
  var btn = document.getElementById('chat-toggle');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = false, run = 0;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var showAll = function (on) { msgs.forEach(function (m) { m.classList.toggle('on', on); }); };

  async function loop(id) {
    while (id === run) {
      showAll(false);
      await sleep(900);
      for (var i = 0; i < msgs.length; i++) {
        var m = msgs[i], bot = m.classList.contains('bot');
        if (bot) { status.textContent = 'печатает…'; await sleep(1400); } else { await sleep(1100); }
        while (paused) await sleep(200);
        if (id !== run) return;
        m.classList.add('on');
        status.textContent = 'в сети';
      }
      await sleep(5000);
    }
  }
  function start() {
    run++;
    if (reduce.matches) { showAll(true); status.textContent = 'в сети'; btn.hidden = true; return; }
    btn.hidden = false;
    loop(run);
  }
  if (chat) {
    btn.addEventListener('click', function () {
      paused = !paused;
      btn.textContent = paused ? 'Продолжить' : 'Пауза';
    });
    if (reduce.addEventListener) reduce.addEventListener('change', start);
    start();
  }

  // Лёгкое появление блоков при прокрутке.
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce.matches) {
    [].forEach.call(items, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    [].forEach.call(items, function (el) { io.observe(el); });
  }
})();
