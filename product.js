// 商品詳細ページ: view_item を送る
(function () {
  var id = new URLSearchParams(window.location.search).get('id');
  var product = window.Demo.PRODUCTS.filter(function (p) { return p.id === id; })[0];
  var root = document.getElementById('product-detail');

  function add(tag, text) {
    var node = document.createElement(tag);
    node.textContent = text;
    root.appendChild(node);
    return node;
  }

  if (!product) {
    add('p', '商品が見つかりません。');
  } else {
    add('h1', product.name);
    add('p', '価格: ' + product.price.toLocaleString('ja-JP') + '円（税込）');
    window.Demo.pushEvent('view_item', {
      ecommerce: { currency: 'JPY', value: product.price, items: [window.Demo.toGa4Item(product)] },
    });
  }

  var back = document.createElement('a');
  back.href = 'index.html';
  back.textContent = '一覧に戻る';
  root.appendChild(back);
})();
