// =========================================================
// CipherCore Learner Portal — Shared helpers
// Reads the fake session and populates the portal UI.
// =========================================================

(function () {
  const raw = sessionStorage.getItem('cc_session');
  if (!raw) return;

  let session;
  try {
    session = JSON.parse(raw);
  } catch (e) {
    return;
  }

  const initialsEl = document.getElementById('user-initials');
  const nameEl     = document.getElementById('user-name');
  const roleEl     = document.getElementById('user-role');
  const statRoleEl = document.getElementById('stat-role');
  const greetEl    = document.getElementById('greeting-name');

  if (initialsEl) initialsEl.textContent = session.initials || '--';
  if (nameEl)     nameEl.textContent     = session.name || 'Learner';
  if (roleEl)     roleEl.textContent     = session.role || 'student';
  if (statRoleEl) statRoleEl.textContent = session.role || 'student';
  if (greetEl)    greetEl.textContent    = (session.name || 'learner').split(' ')[0];
})();

console.log(
  '%cCipherCore Learner Portal',
  'color:#4ade80; font-size:16px; font-weight:bold;'
);
console.log(
  '%cTraining environment — no real data collected. Peeking at the source is encouraged. :)',
  'color:#8b9a92; font-size:12px;'
);
