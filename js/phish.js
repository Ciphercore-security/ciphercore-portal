// =========================================================
// CipherCore — Phishing Simulation
// Handles: email preview, fake login, reveal page.
// Client-side only. Nothing is stored or sent.
// =========================================================

(function () {

  // ---------------------------------------------------------
  // 1. EMAIL PAGE — mark as read when clicked, remember time
  // ---------------------------------------------------------
  const phishMail = document.getElementById('phish-mail');
  if (phishMail) {
    phishMail.addEventListener('click', function () {
      phishMail.classList.remove('unread');
      sessionStorage.setItem('cc_phish_start', Date.now());
    });
  }

  const phishLink = document.getElementById('phish-link');
  if (phishLink) {
    phishLink.addEventListener('click', function () {
      sessionStorage.setItem('cc_phish_start', Date.now());
    });
  }

  // ---------------------------------------------------------
  // 2. LOGIN PAGE — capture input, then redirect to reveal
  // ---------------------------------------------------------
  const loginForm = document.getElementById('ms-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('ms-email').value || '';
      const start = parseInt(sessionStorage.getItem('cc_phish_start') || '0', 10);
      const elapsed = start ? ((Date.now() - start) / 1000).toFixed(1) : '4.7';

      sessionStorage.setItem('cc_phish_email', email);
      sessionStorage.setItem('cc_phish_elapsed', elapsed);

      window.location.href = '../caught/';
    });
  }

  // ---------------------------------------------------------
  // 3. REVEAL PAGE — personalise with email + time
  // ---------------------------------------------------------
  const caughtTime = document.getElementById('caught-time');
  if (caughtTime) {
    const elapsed = sessionStorage.getItem('cc_phish_elapsed');
    if (elapsed) caughtTime.textContent = elapsed + ' seconds';
  }

  const caughtEmail = document.getElementById('caught-email');
  if (caughtEmail) {
    const email = sessionStorage.getItem('cc_phish_email');
    if (email) caughtEmail.textContent = email;
  }

})();
