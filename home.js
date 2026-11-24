// 商品一覧ページ: 検索(search)と商品クリック(select_item)
(function () {
  var list = document.getElementById('product-list');
  var form = document.getElementById('search-form');
  var input = document.getElementById('keyword');

  function render(keyword) {
    list.textContent = '';
    var items = window.Demo.PRODUCTS.filter(function (p) {
      return !keyword || p.name.indexOf(keyword) !== -1;
    });
    if (items.length === 0) {
      var empty = document.createElement('li');
      empty.textContent = '該当する商品がありません';
      list.appendChild(empty);
      return;
    }
    items.forEach(function (p, i) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = 'product.html?id=' + encodeURIComponent(p.id);
      a.textContent = p.name;
      a.addEventListener('click', function () {
        window.Demo.pushEvent('select_item', {
          ecommerce: { item_list_name: '商品一覧', items: [window.Demo.toGa4Item(p, i)] },
        });
      });
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var term = input.value.trim();
    if (term) window.Demo.pushEvent('search', { search_term: term });
    render(term);
  });

  render('');
})();
