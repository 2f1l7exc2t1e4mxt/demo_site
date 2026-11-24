// 全ページ共通: dataLayer送信、同意バナー、ログイン切替、商品データ。
// index.html 側で gtag() と Consent Mode の既定値(denied)、user_id の push は済んでいる。
(function () {
  var CONSENT_KEY = 'ga4_demo_consent'; // 'granted' | 'denied'
  var LOGIN_KEY = 'ga4_demo_login';

  var PRODUCTS = [
    { id: 'p1', name: 'EVモデルA', price: 4200000, category: 'EV' },
    { id: 'p2', name: 'EVモデルB', price: 5600000, category: 'EV' },
  ];

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
  }

  function toGa4Item(p, index) {
    return { item_id: p.id, item_name: p.name, item_category: p.category, price: p.price, index: index || 0 };
  }

  function pushEvent(event, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // 前のecommerceを残さない(GA4推奨)
    var payload = { event: event };
    for (var k in params) payload[k] = params[k];
    window.dataLayer.push(payload);
  }

  function applyConsent(value) {
    var state = value === 'granted' ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    for (var k in attrs || {}) node.setAttribute(k, attrs[k]);
    if (text) node.textContent = text;
    return node;
  }

  function renderConsentBanner(root) {
    var saved = store(CONSENT_KEY);
    if (saved) {
      applyConsent(saved); // ページ読み込みごとに反映が必要
      return;
    }
    var banner = el('div', { class: 'consent-banner' });
    banner.appendChild(
      el('p', {}, '当サイトはGoogle Analytics 4（GA4）でアクセス状況を計測しています。 同意いただいた場合のみ計測用Cookieを保存します。')
    );
    var actions = el('div', { class: 'consent-banner__actions' });
    [['拒否する', 'denied'], ['同意する', 'granted']].forEach(function (pair) {
      var btn = el('button', { type: 'button' }, pair[0]);
      btn.addEventListener('click', function () {
        store(CONSENT_KEY, pair[1]);
        applyConsent(pair[1]);
        banner.remove();
      });
      actions.appendChild(btn);
    });
    banner.appendChild(actions);
    root.appendChild(banner);
  }

  // user_id は <head> の dataLayer.push で読むため、切替後は実リロードして反映する
  function renderLoginToggle(root) {
    var loggedIn = store(LOGIN_KEY) === 'true';
    var box = el('div', { class: 'login-toggle' });
    box.appendChild(el('span', {}, loggedIn ? 'ログイン中' : '未ログイン'));
    var btn = el('button', { type: 'button' }, loggedIn ? 'ログアウト' : 'ログイン');
    btn.addEventListener('click', function () {
      store(LOGIN_KEY, String(!loggedIn));
      window.location.reload();
    });
    box.appendChild(btn);
    root.appendChild(box);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.getElementById('site-header');
    if (header) {
      renderConsentBanner(header);
      renderLoginToggle(header);
    }
  });

  window.Demo = { PRODUCTS: PRODUCTS, pushEvent: pushEvent, toGa4Item: toGa4Item };
})();
