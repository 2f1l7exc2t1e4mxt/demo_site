// お問い合わせフォーム: 送信時に identity イベント1つで、氏名・メール・電話番号を
// Data 360 Web SDK へ送る。
// GA4コネクタの構成では、メールと電話は別イベントではなく identity イベントの項目として
// 取り込まれ、連絡先(メール/電話)のDMOにマッピングされる。
// 個人情報は dataLayer に積まない（GA4など、GTMの他のタグへ渡さないため）。
(function () {
  // 既知の顧客として送るときの isAnonymous の値。
  // Salesforceの資料で記述が食い違う（0=既知 / 1=既知）ため、
  // 取り込み後に Individual の Is Anonymous を見て、必要なら変更する。
  var IS_ANONYMOUS_FOR_KNOWN = 0;

  var form = document.getElementById('contact-form');
  var result = document.getElementById('contact-result');

  // 全角数字を半角にし、日本の番号を国際形式（+81…）にそろえる（検証用の簡易版）
  function toE164(raw) {
    var s = raw
      .replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); })
      .replace(/[^\d+]/g, '');
    if (s.charAt(0) === '+') return s;
    if (s.charAt(0) === '0') return '+81' + s.slice(1);
    return s;
  }

  function sendIdentityEvent(p) {
    var sdk = window.SalesforceInteractions;
    if (!sdk || typeof sdk.sendEvent !== 'function') return false;

    sdk.sendEvent({
      user: {
        attributes: {
          eventType: 'identity',
          firstName: p.firstName,
          lastName: p.lastName,
          isAnonymous: IS_ANONYMOUS_FOR_KNOWN,
          email: p.email,
          phoneNumber: p.phoneNumber,
        },
      },
    });
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var p = {
      lastName: form.lastName.value.trim(),
      firstName: form.firstName.value.trim(),
      phoneNumber: toE164(form.phone.value.trim()),
      email: form.email.value.trim().toLowerCase(),
    };

    if (!p.lastName || !p.firstName || !p.phoneNumber || !p.email) {
      result.textContent = 'すべての項目を入力してください。';
      return;
    }

    if (sendIdentityEvent(p)) {
      result.textContent = '送信しました（検証用）。';
      form.reset();
    } else {
      result.textContent =
        'Data 360のSDKが読み込まれていないため、送信できませんでした。' +
        '同意バナーとGTMのData 360タグを確認してください。';
    }
  });
})();
