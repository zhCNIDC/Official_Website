function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function (resolve, reject) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) { resolve(); } else { reject(new Error('copy failed')); }
  });
}

function flash(btn, ok, label) {
  var original = btn.dataset.original || btn.textContent;
  btn.dataset.original = original;
  btn.textContent = label;
  btn.classList.remove('done', 'fail');
  btn.classList.add(ok ? 'done' : 'fail');
  clearTimeout(btn._timer);
  btn._timer = setTimeout(function () {
    btn.textContent = original;
    btn.classList.remove('done', 'fail');
  }, 1600);
}

document.querySelectorAll('.copy').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var card = btn.closest('.card');
    var text = card.querySelector('.ua').textContent.trim();
    copyText(text).then(function () {
      flash(btn, true, '已复制');
    }).catch(function () {
      flash(btn, false, '复制失败');
    });
  });
});

var allBtn = document.getElementById('copyAll');
allBtn.addEventListener('click', function () {
  var list = Array.prototype.map.call(document.querySelectorAll('.ua'), function (el) {
    return el.textContent.trim();
  });
  copyText(list.join('\n\n')).then(function () {
    flash(allBtn, true, '已复制全部');
  }).catch(function () {
    flash(allBtn, false, '复制失败');
  });
});

document.querySelectorAll('.ua').forEach(function (el) {
  el.addEventListener('click', function () {
    var btn = el.closest('.card').querySelector('.copy');
    copyText(el.textContent.trim()).then(function () {
      flash(btn, true, '已复制');
    }).catch(function () {
      flash(btn, false, '复制失败');
    });
  });
});