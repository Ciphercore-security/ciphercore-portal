// =========================================================
// CipherCore Learner Portal — Auth (simulated)
// Any email + any password "works". Session stored in
// sessionStorage so portal pages know who's logged in.
// Nothing is sent anywhere.
// =========================================================

(function () {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const role  = document.getElementById('role').value;

    const name = email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || 'Learner';

    const session = {
      email: email,
      name: name,
      role: role,
      initials: name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(),
      loginAt: new Date().toISOString()
    };

    sessionStorage.setItem('cc_session', JSON.stringify(session));

    const btn = form.querySelector('button');
    btn.textContent = 'Signing in…';
    btn.disabled = true;

    setTimeout(() => {
      window.location.href = 'portal/';
    }, 700);
  });
})();
