/* ======================================================
   SMART WATER USAGE MONITORING SYSTEM — MAIN SCRIPT
   ====================================================== */

// ─── STORAGE KEY ────────────────────────────────────────
const STORAGE_KEY = 'waterUsageData';

// ─── DOM REFERENCES ─────────────────────────────────────
const form          = document.getElementById('water-form');
const inputDate     = document.getElementById('input-date');
const inputLiters   = document.getElementById('input-liters');
const inputCategory = document.getElementById('input-category');
const entriesBody   = document.getElementById('entries-body');
const noDataMsg     = document.getElementById('no-data-msg');
const toastContainer= document.getElementById('toast-container');

const statTotal     = document.getElementById('stat-total');
const statAvg       = document.getElementById('stat-avg');
const statLatest    = document.getElementById('stat-latest');
const statWeekly    = document.getElementById('stat-weekly');

const insightsContainer = document.getElementById('insights-container');
const insightsEmpty     = document.getElementById('insights-empty');
const tipsContainer     = document.getElementById('tips-container');
const tipsEmpty         = document.getElementById('tips-empty');

const btnReset       = document.getElementById('btn-reset');
const btnConfirmReset= document.getElementById('btn-confirm-reset');

// ─── CHART INSTANCES ────────────────────────────────────
let barChart = null;
let pieChart = null;

// ─── CATEGORY METADATA ─────────────────────────────────
const categoryMeta = {
  Bath:      { emoji: '🛁', color: '#0077b6' },
  Kitchen:   { emoji: '🍳', color: '#e6a817' },
  Laundry:   { emoji: '👕', color: '#2d6a4f' },
  Gardening: { emoji: '🌱', color: '#52b788' },
  Drinking:  { emoji: '🥤', color: '#48cae4' },
};

// ─── HELPERS ────────────────────────────────────────────

/** Load data from LocalStorage */
function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/** Save data to LocalStorage */
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Show a toast notification */
function showToast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast-msg toast-${type}`;
  el.innerHTML = message;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/** Format date to readable string */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Get the Monday of the current ISO week */
function getWeekStart() {
  const now = new Date();
  const day = now.getDay() || 7; // Mon = 1 … Sun = 7
  const mon = new Date(now);
  mon.setDate(now.getDate() - day + 1);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

// ─── CORE: RENDER EVERYTHING ────────────────────────────

function renderAll() {
  const data = loadData();
  renderTable(data);
  renderStats(data);
  renderCharts(data);
  renderInsights(data);
  renderTips(data);
}

// ─── TABLE ──────────────────────────────────────────────

function renderTable(data) {
  if (data.length === 0) {
    entriesBody.innerHTML = '';
    noDataMsg.style.display = 'block';
    return;
  }
  noDataMsg.style.display = 'none';

  // Show latest first
  const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  entriesBody.innerHTML = sorted.map((entry, idx) => {
    const meta = categoryMeta[entry.category] || { emoji: '', color: '#888' };
    return `
      <tr class="entry-row">
        <td>${formatDate(entry.date)}</td>
        <td><span class="badge-category badge-${entry.category}">${meta.emoji} ${entry.category}</span></td>
        <td><strong>${entry.liters}</strong> L</td>
        <td>
          <button class="btn-delete-entry" data-id="${entry.id}" title="Delete entry">
            <i class="bi bi-x-circle"></i>
          </button>
        </td>
      </tr>`;
  }).join('');

  // Attach delete handlers
  document.querySelectorAll('.btn-delete-entry').forEach(btn => {
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id));
  });
}

// ─── STATS ──────────────────────────────────────────────

function renderStats(data) {
  if (data.length === 0) {
    statTotal.textContent  = '0 L';
    statAvg.textContent    = '0 L';
    statLatest.textContent = '—';
    statWeekly.textContent = '0 L';
    return;
  }

  // Total
  const total = data.reduce((s, d) => s + d.liters, 0);
  statTotal.textContent = `${total.toLocaleString()} L`;

  // Average per unique day
  const uniqueDays = new Set(data.map(d => d.date)).size;
  statAvg.textContent = `${Math.round(total / uniqueDays)} L`;

  // Latest entry
  const latest = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  statLatest.textContent = `${latest.liters} L (${formatDate(latest.date)})`;

  // Weekly
  const weekStart = getWeekStart();
  const weekly = data.filter(d => new Date(d.date + 'T00:00:00') >= weekStart)
                     .reduce((s, d) => s + d.liters, 0);
  statWeekly.textContent = `${weekly.toLocaleString()} L`;
}

// ─── CHARTS ─────────────────────────────────────────────

function renderCharts(data) {
  renderBarChart(data);
  renderPieChart(data);
}

function renderBarChart(data) {
  // Aggregate liters per date
  const perDate = {};
  data.forEach(d => {
    perDate[d.date] = (perDate[d.date] || 0) + d.liters;
  });

  // Sort by date and take last 14 entries
  const sortedDates = Object.keys(perDate).sort();
  const last14 = sortedDates.slice(-14);
  const labels = last14.map(d => formatDate(d));
  const values = last14.map(d => perDate[d]);

  const ctx = document.getElementById('bar-chart').getContext('2d');

  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Liters',
        data: values,
        backgroundColor: values.map(v => v > 400
          ? 'rgba(239,71,111,0.7)'
          : 'rgba(0,180,216,0.65)'),
        borderColor: values.map(v => v > 400
          ? 'rgba(239,71,111,1)'
          : 'rgba(0,119,182,1)'),
        borderWidth: 1.5,
        borderRadius: 8,
        maxBarThickness: 42,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1d3557',
          titleFont: { family: 'Inter' },
          bodyFont: { family: 'Inter' },
          cornerRadius: 8,
          padding: 12,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,.05)' },
          ticks: { font: { family: 'Inter', size: 11 } },
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 }, maxRotation: 45 },
        },
      },
    },
  });
}

function renderPieChart(data) {
  const perCat = {};
  data.forEach(d => {
    perCat[d.category] = (perCat[d.category] || 0) + d.liters;
  });

  const labels = Object.keys(perCat);
  const values = Object.values(perCat);
  const colors = labels.map(l => categoryMeta[l]?.color || '#888');

  const ctx = document.getElementById('pie-chart').getContext('2d');

  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.map(c => c + 'cc'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 12,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true },
        },
        tooltip: {
          backgroundColor: '#1d3557',
          bodyFont: { family: 'Inter' },
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} L (${Math.round(ctx.parsed / values.reduce((a,b)=>a+b,0) * 100)}%)`,
          },
        },
      },
    },
  });
}

// ─── INSIGHTS ───────────────────────────────────────────

function renderInsights(data) {
  if (data.length === 0) {
    insightsEmpty.style.display = '';
    return;
  }
  insightsEmpty.style.display = 'none';

  const cards = [];

  // 1. Average daily usage check
  const perDate = {};
  data.forEach(d => { perDate[d.date] = (perDate[d.date] || 0) + d.liters; });
  const dailyValues = Object.values(perDate);
  const avgDaily = Math.round(dailyValues.reduce((a,b) => a+b, 0) / dailyValues.length);

  if (avgDaily > 400) {
    cards.push(`
      <div class="insight-card warning">
        <h5>⚠️ High Water Usage Detected</h5>
        <p>Your average daily usage is <strong>${avgDaily} L</strong>, which exceeds the recommended <strong>400 L</strong> for a household.</p>
        <ul>
          <li>Reduce shower time to under 5 minutes</li>
          <li>Turn off the tap while brushing teeth</li>
          <li>Use a bucket instead of long showers</li>
          <li>Fix leaking taps immediately</li>
          <li>Reuse RO wastewater for watering plants</li>
        </ul>
      </div>
    `);
  } else {
    cards.push(`
      <div class="insight-card success">
        <h5>✅ Sustainable Usage</h5>
        <p>Your average daily usage is <strong>${avgDaily} L</strong>. Great job — you are within a sustainable range!</p>
      </div>
    `);
  }

  // 2. Peak usage day
  const peakDate = Object.entries(perDate).sort((a,b) => b[1]-a[1])[0];
  if (peakDate) {
    cards.push(`
      <div class="insight-card info">
        <h5>📊 Peak Usage Day</h5>
        <p>Your highest recorded usage was <strong>${peakDate[1]} L</strong> on <strong>${formatDate(peakDate[0])}</strong>.</p>
      </div>
    `);
  }

  // 3. Category with highest usage
  const perCat = {};
  data.forEach(d => { perCat[d.category] = (perCat[d.category] || 0) + d.liters; });
  const topCat = Object.entries(perCat).sort((a,b) => b[1]-a[1])[0];
  if (topCat) {
    const meta = categoryMeta[topCat[0]];
    cards.push(`
      <div class="insight-card info">
        <h5>${meta.emoji} Top Category: ${topCat[0]}</h5>
        <p><strong>${topCat[0]}</strong> accounts for <strong>${topCat[1]} L</strong> of your total consumption. Focus on reducing usage here for the biggest impact.</p>
      </div>
    `);
  }

  // 4. Days with very high spikes (> 500 L)
  const spikeDays = Object.entries(perDate).filter(([,v]) => v > 500);
  if (spikeDays.length > 0) {
    cards.push(`
      <div class="insight-card warning">
        <h5>🚨 Usage Spikes Detected</h5>
        <p>You had <strong>${spikeDays.length}</strong> day(s) with usage exceeding <strong>500 L</strong>. Consider checking for leaks or adjusting habits on those days.</p>
        <ul>
          ${spikeDays.map(([d,v]) => `<li>${formatDate(d)}: ${v} L</li>`).join('')}
        </ul>
      </div>
    `);
  }

  // Render
  // Keep the empty placeholder in DOM (hidden) and inject cards
  const html = cards.join('');
  // Remove old insight cards but keep #insights-empty
  insightsContainer.querySelectorAll('.insight-card').forEach(el => el.remove());
  insightsContainer.insertAdjacentHTML('beforeend', html);
}

// ─── TIPS ───────────────────────────────────────────────

function renderTips(data) {
  if (data.length === 0) {
    tipsEmpty.style.display = '';
    return;
  }
  tipsEmpty.style.display = 'none';

  // Determine per-category totals
  const perCat = {};
  data.forEach(d => { perCat[d.category] = (perCat[d.category] || 0) + d.liters; });
  const sorted = Object.entries(perCat).sort((a,b) => b[1]-a[1]);

  const tipData = {
    Bath: {
      icon: '🛁',
      tips: [
        'Use a bucket instead of a shower to save 50-100 L per bath',
        'Limit shower time to 5 minutes or less',
        'Install low-flow showerheads',
        'Turn off the water while soaping up',
        'Reuse bath water for mopping floors',
      ],
    },
    Kitchen: {
      icon: '🍳',
      tips: [
        'Wash vegetables in a bowl instead of running water',
        'Reuse vegetable wash water for watering plants',
        'Run the dishwasher only when it is fully loaded',
        'Soak pots and pans before washing them',
        'Use a water-efficient faucet aerator',
      ],
    },
    Laundry: {
      icon: '👕',
      tips: [
        'Wash full loads only — avoid half-loads',
        'Use a front-loading machine (uses 40% less water)',
        'Reuse the last rinse water for the next wash cycle',
        'Choose the correct water level for each load',
        'Pre-treat stains to avoid rewashing',
      ],
    },
    Gardening: {
      icon: '🌱',
      tips: [
        'Use drip irrigation instead of sprinklers',
        'Water plants early morning or late evening to reduce evaporation',
        'Collect rainwater for gardening',
        'Mulch around plants to retain soil moisture',
        'Choose native, drought-resistant plants',
      ],
    },
    Drinking: {
      icon: '🥤',
      tips: [
        'Keep a jug of water in the fridge instead of running the tap',
        'Install a water-efficient RO system',
        'Track and reduce RO wastewater by reusing it',
        'Use a refillable bottle to avoid wastage',
        'Check for leaks in your water purifier regularly',
      ],
    },
  };

  const cards = sorted.map(([cat, total]) => {
    const info = tipData[cat];
    if (!info) return '';
    return `
      <div class="tip-card">
        <div class="tip-icon">${info.icon}</div>
        <h5>${cat} — ${total} L total</h5>
        <ul>
          ${info.tips.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');

  // Clear old tip cards but keep the empty placeholder
  tipsContainer.querySelectorAll('.tip-card').forEach(el => el.remove());
  tipsContainer.insertAdjacentHTML('beforeend', cards);
}

// ─── ADD ENTRY ──────────────────────────────────────────

form.addEventListener('submit', e => {
  e.preventDefault();

  const date     = inputDate.value;
  const liters   = parseInt(inputLiters.value, 10);
  const category = inputCategory.value;

  if (!date || !liters || !category) {
    showToast('<i class="bi bi-exclamation-circle"></i> Please fill in all fields.', 'danger');
    return;
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date,
    liters,
    category,
  };

  const data = loadData();
  data.push(entry);
  saveData(data);

  form.reset();
  showToast(`<i class="bi bi-check-circle"></i> Logged ${liters} L for ${category}!`, 'success');
  renderAll();
});

// ─── DELETE ENTRY ───────────────────────────────────────

function deleteEntry(id) {
  let data = loadData();
  data = data.filter(d => d.id !== id);
  saveData(data);
  showToast('<i class="bi bi-trash3"></i> Entry deleted.', 'info');
  renderAll();
}

// ─── RESET ALL ──────────────────────────────────────────

btnReset.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
  modal.show();
});

btnConfirmReset.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();
  showToast('<i class="bi bi-arrow-counterclockwise"></i> All data has been reset.', 'danger');
  renderAll();
});

// ─── NAV PILL ACTIVE STATE (Intersection Observer) ──────

const sections = document.querySelectorAll('.content-section');
const navPills = document.querySelectorAll('.nav-pill');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navPills.forEach(p => p.classList.remove('active'));
      const target = document.querySelector(`.nav-pill[data-section="${entry.target.id}"]`);
      if (target) target.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ─── SET DEFAULT DATE ───────────────────────────────────

(function setDefaultDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth() + 1).padStart(2, '0');
  const dd   = String(today.getDate()).padStart(2, '0');
  inputDate.value = `${yyyy}-${mm}-${dd}`;
})();

// ─── INITIAL RENDER ─────────────────────────────────────

renderAll();
