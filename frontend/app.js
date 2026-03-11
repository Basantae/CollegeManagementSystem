/* ── Sky Builder ── */
(function buildSky() {
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 90; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random() * 60}%;
      left:${Math.random() * 100}%;
      --dur:${2 + Math.random() * 4}s;
      --delay:${Math.random() * 5}s;
      --max-op:${0.4 + Math.random() * 0.6};
    `;
    starsEl.appendChild(s);
  }

  const cloudsEl = document.getElementById('clouds');
  const cloudData = [
    { top: '8%',  w: 260, h: 55, dur: 80, delay: 0   },
    { top: '18%', w: 180, h: 40, dur: 65, delay: -20  },
    { top: '12%', w: 320, h: 65, dur: 95, delay: -40  },
    { top: '25%', w: 220, h: 50, dur: 75, delay: -10  },
  ];
  cloudData.forEach(c => {
    const cl = document.createElement('div');
    cl.className = 'cloud';
    cl.style.cssText = `
      top:${c.top}; width:${c.w}px; height:${c.h}px;
      --cdur:${c.dur}s; animation-delay:${c.delay}s;
    `;
    cloudsEl.appendChild(cl);
  });
})();

/* ── Weather Config ── */
const weatherMap = {
  Freezing:   { icon: '🥶', color: '#a5d8ff', orb: 'rgba(165,216,255,0.18)' },
  Bracing:    { icon: '🌬️', color: '#74c0fc', orb: 'rgba(116,192,252,0.18)' },
  Chilly:     { icon: '🧥', color: '#91a7ff', orb: 'rgba(145,167,255,0.18)' },
  Cool:       { icon: '🌤️', color: '#56cfff', orb: 'rgba(86,207,255,0.18)'  },
  Mild:       { icon: '⛅', color: '#63e6be', orb: 'rgba(99,230,190,0.18)'  },
  Warm:       { icon: '☀️', color: '#ffd43b', orb: 'rgba(255,212,59,0.18)'  },
  Balmy:      { icon: '🌅', color: '#ffa94d', orb: 'rgba(255,169,77,0.18)'  },
  Hot:        { icon: '🔥', color: '#ff6b35', orb: 'rgba(255,107,53,0.18)'  },
  Sweltering: { icon: '😰', color: '#ff4757', orb: 'rgba(255,71,87,0.18)'   },
  Scorching:  { icon: '🌡️', color: '#c0392b', orb: 'rgba(192,57,43,0.18)'   },
};

/* ── Helpers ── */
function tempBarPct(c) {
  const pct = ((c + 20) / 75) * 90 + 5;
  return Math.max(5, Math.min(95, pct));
}

function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return {
    day:  d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
}

/* ── Fetch Forecast ── */
async function loadForecast() {
  const btn    = document.getElementById('fetchBtn');
  const status = document.getElementById('status');
  const grid   = document.getElementById('grid');
  const stats  = document.getElementById('statsRow');

  btn.disabled = true;
  status.className = '';
  status.innerHTML = 'Fetching forecast<span class="dot-loader"><span></span><span></span><span></span></span>';
  stats.classList.remove('visible');
  grid.innerHTML = '';

  try {
    const res = await fetch('http://localhost:5033/weatherforecast');
    if (!res.ok) throw new Error(`HTTP ${res.status} · ${res.statusText}`);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error('Empty response from API');

    renderCards(data);
    renderStats(data);

    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    status.className = 'success';
    status.textContent = `✓ ${data.length} days loaded · ${t}`;

  } catch (e) {
    status.className = 'error';
    status.textContent = `✕ ${e.message} — is the backend running?`;
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">⛈️</div>
        <p class="empty-title">Could not load forecast</p>
        <p class="empty-hint">${e.message}<br/><br/>Make sure your ASP.NET backend is running on port 5033 and CORS is enabled.</p>
      </div>`;
  } finally {
    btn.disabled = false;
  }
}

/* ── Render Cards ── */
function renderCards(data) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  data.forEach((item, i) => {
    const key  = item.summary || 'Mild';
    const meta = weatherMap[key] || weatherMap['Mild'];
    const { day, date } = formatDate(item.date);
    const pct  = tempBarPct(item.temperatureC);

    const card = document.createElement('div');
    card.className = 'wcard';
    card.style.cssText = `
      animation-delay: ${i * 0.1}s;
      --temp-color: ${meta.color};
      --card-orb: radial-gradient(circle, ${meta.orb}, transparent 70%);
    `;

    card.innerHTML = `
      <div class="wcard-icon">${meta.icon}</div>
      <div>
        <div class="wcard-day">${day}</div>
        <div class="wcard-date">${date}</div>
      </div>
      <div class="wcard-summary">${item.summary}</div>
      <div class="wcard-divider"></div>
      <div>
        <div class="wcard-temp-c">${item.temperatureC}<span class="wcard-temp-unit">°C</span></div>
        <div class="wcard-temp-f">${item.temperatureF}°F</div>
      </div>
      <div class="temp-bar-wrap">
        <div class="temp-bar-fill" style="width:0%" data-pct="${pct}"></div>
      </div>
    `;

    grid.appendChild(card);

    // Animate temperature bar after paint
    setTimeout(() => {
      const bar = card.querySelector('.temp-bar-fill');
      if (bar) bar.style.width = pct + '%';
    }, 100 + i * 80);
  });
}

/* ── Render Stats ── */
function renderStats(data) {
  const temps = data.map(d => d.temperatureC);
  const avg   = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
  document.getElementById('sAvg').textContent  = avg + '°C';
  document.getElementById('sHigh').textContent = Math.max(...temps) + '°C';
  document.getElementById('sLow').textContent  = Math.min(...temps) + '°C';
  document.getElementById('statsRow').classList.add('visible');
}