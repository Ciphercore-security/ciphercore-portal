// =========================================================
// CipherCore — Breach Console
// Simulated attacker view. Client-side only.
// Passwords hidden until cracked. Includes weak / medium / strong.
// =========================================================

(function () {

  const accounts = [
    { name: 'Thabo Mokoena',   email: 'thabo.m@company.co.za',   password: 'password123',  level: 'weak' },
    { name: 'Sarah van Wyk',   email: 'sarah.vw@company.co.za',  password: 'Summer2024!',  level: 'weak' },
    { name: 'Sipho Dlamini',   email: 'sipho.d@company.co.za',   password: 'qwerty',       level: 'weak' },
    { name: 'Naledi Khumalo',  email: 'naledi.k@company.co.za',  password: 'Company@123',  level: 'medium' },
    { name: 'Ryan Botha',      email: 'ryan.b@company.co.za',    password: 'L3tm3in!',     level: 'medium' },
    { name: 'Zanele Mthembu',  email: 'zanele.m@company.co.za',  password: 'correct horse battery staple', level: 'strong' },
    { name: 'Kabelo Ndlovu',   email: 'kabelo.n@company.co.za',  password: 'T7$kQ!9pLm#42vZx',              level: 'strong' }
  ];

  const GUESSES_PER_SECOND = 1e9;

  function humanTime(seconds) {
    if (seconds < 1) return 'less than a second';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
    const years = seconds / 31536000;
    if (years < 1000) return Math.round(years) + ' years';
    if (years < 1e6) return Math.round(years / 1000) + ' thousand years';
    if (years < 1e9) return Math.round(years / 1e6) + ' million years';
    if (years < 1e12) return Math.round(years / 1e9) + ' billion years';
    return 'longer than the age of the universe';
  }

  function estimate(pw, level) {
    if (level === 'strong') {
      return {
        cracked: false,
        time: 1e15,
        note: 'Not found in any wordlist. Would take centuries at billions of guesses per second.'
      };
    }

    const lower = pw.toLowerCase();
    const common = ['password','password1','password123','123456','12345678','qwerty','abc123','letmein','welcome','admin','admin123','iloveyou','monkey','dragon','login','passw0rd','p@ssw0rd','qwerty123'];

    if (common.includes(lower)) return { cracked: true, time: 0.001, note: 'Found instantly in the top-1000 passwords list.' };
    if (/^[a-z]+\d{2,4}[!@#$%^&*]?$/i.test(pw)) return { cracked: true, time: 0.5, note: 'Dictionary word + numbers pattern. Crackers try this first.' };
    if (pw.length < 8) return { cracked: true, time: 0.01, note: 'Too short. Every character matters.' };

    let charset = 0;
    if (/[a-z]/.test(pw)) charset += 26;
    if (/[A-Z]/.test(pw)) charset += 26;
    if (/[0-9]/.test(pw)) charset += 10;
    if (/[^A-Za-z0-9]/.test(pw)) charset += 33;
    charset = charset || 1;

    const seconds = Math.pow(charset, pw.length) / GUESSES_PER_SECOND / 2;
    const cracked = seconds < 86400 * 30;
    let note = cracked
      ? 'Longer than most, but still within reach of a determined attacker.'
      : 'Would take a very long time with current hardware.';
    return { cracked: cracked, time: seconds, note: note };
  }

  const terminal = document.getElementById('breach-terminal');
  const consoleEl = document.getElementById('breach-console');

  setTimeout(function () {
    if (terminal) terminal.style.display = 'none';
    if (consoleEl) consoleEl.classList.remove('hidden');
    buildTable();
  }, 3400);

  function buildTable() {
    const table = document.getElementById('breach-table');
    if (!table) return;

    const head = document.createElement('div');
    head.className = 'breach-col-head';
    head.innerHTML =
      '<div>Full name</div>' +
      '<div>Email</div>' +
      '<div>Password</div>' +
      '<div>Status</div>' +
      '<div></div>';
    table.appendChild(head);

    accounts.forEach(function (acct, i) {
      const row = document.createElement('div');
      row.className = 'breach-row';
      row.innerHTML =
        '<div class="breach-cell breach-name">' + acct.name + '</div>' +
        '<div class="breach-cell breach-email">' + acct.email + '</div>' +
        '<div class="breach-cell"><span class="breach-pw hidden-pw" id="pw-' + i + '">••••••••••</span></div>' +
        '<div class="breach-cell label">exposed</div>' +
        '<button class="breach-crack" data-crack="' + i + '">⚡ Reveal &amp; Crack</button>' +
        '<div class="breach-result" id="bres-' + i + '"></div>';
      table.appendChild(row);
    });

    table.querySelectorAll('[data-crack]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = btn.getAttribute('data-crack');
        runCrack(accounts[idx], idx, btn);
      });
    });
  }

  function runCrack(acct, idx, btn) {
    const pwEl = document.getElementById('pw-' + idx);
    const target = document.getElementById('bres-' + idx);
    if (!target || !pwEl) return;

    // Reveal the password
    pwEl.textContent = acct.password;
    pwEl.classList.remove('hidden-pw');
    pwEl.classList.add('revealed-pw');

    btn.disabled = true;
    btn.textContent = 'cracking…';

    const info = estimate(acct.password, acct.level);

    const stages = [
      'loading dictionary (14M entries)…',
      'trying top 10,000 passwords…',
      'trying word + number patterns…',
      'trying leetspeak variants…',
      'cross-referencing breach dumps…',
      info.cracked ? 'match found.' : 'no match. continuing brute-force…'
    ];

    const totalMs = info.cracked ? 1600 : 2600;
    const stepMs = totalMs / stages.length;

    target.innerHTML = '<span class="verdict running">⚙ running…</span><span class="detail" id="crk-' + idx + '">' + stages[0] + '</span>';
    const log = document.getElementById('crk-' + idx);

    let i = 0;
    const tick = setInterval(function () {
      i++;
      if (i < stages.length) log.textContent = stages[i];
      if (i >= stages.length) {
        clearInterval(tick);

        if (info.cracked) {
          target.innerHTML =
            '<span class="verdict cracked">💥 CRACKED in ' + humanTime(info.time) + '</span>' +
            '<span class="detail">' + info.note + '</span>';
          btn.textContent = '✓ cracked';
        } else {
          target.innerHTML =
            '<span class="verdict resisted">🛡 RESISTED — would take ' + humanTime(info.time) + '</span>' +
            '<span class="detail">' + info.note + '</span>';
          btn.textContent = '✓ resisted';
          btn.classList.add('resisted-btn');
        }
      }
    }, stepMs);
  }

})();
