(function () {
  var root = document.querySelector('[data-news-filter]');
  if (!root) return;

  var items = root.querySelectorAll('[data-tags]');
  var groups = root.querySelectorAll('.news-list, .news-notes');
  var chips = root.querySelectorAll('.news-filter__chip');
  var tagLinks = root.querySelectorAll('a.news-chip[href*="tag="]');
  var status = root.querySelector('[data-filter-status]');
  var message = root.querySelector('[data-filter-message]');
  var name = root.querySelector('[data-filter-name]');

  function norm(value) {
    return (value || '').trim().toLowerCase();
  }

  function tagFromUrl(url) {
    try {
      return norm(new URLSearchParams(url).get('tag'));
    } catch (e) {
      return '';
    }
  }

  function itemHasTag(item, tag) {
    var tags = (item.getAttribute('data-tags') || '').split('|');
    for (var i = 0; i < tags.length; i++) {
      if (norm(tags[i]) === tag) return true;
    }
    return false;
  }

  function apply() {
    var tag = tagFromUrl(window.location.search);
    var visible = 0;

    Array.prototype.forEach.call(items, function (item) {
      var show = !tag || itemHasTag(item, tag);
      item.hidden = !show;
      if (show) visible++;
    });

    Array.prototype.forEach.call(groups, function (group) {
      var hasVisible = Array.prototype.some.call(
        group.querySelectorAll('[data-tags]'),
        function (item) { return !item.hidden; }
      );
      group.hidden = !!tag && !hasVisible;
    });

    Array.prototype.forEach.call(chips, function (chip) {
      var active = norm(chip.getAttribute('data-filter')) === tag;
      if (active) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    });

    Array.prototype.forEach.call(tagLinks, function (link) {
      var active = !!tag && tagFromUrl(link.search) === tag;
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    if (status) status.hidden = !tag;
    if (tag) {
      if (message) {
        message.textContent = visible
          ? 'Показаны новости по теме:'
          : 'По этой теме новостей нет:';
      }
      if (name) {
        name.textContent = new URLSearchParams(window.location.search).get('tag') || '';
      }
    }
  }

  apply();
  window.addEventListener('popstate', apply);
})();
