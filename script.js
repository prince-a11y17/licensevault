// LicenseVault – simple software license manager (HTML, CSS, JavaScript)
const STORE = "licensevault.items";
const $ = id => document.getElementById(id);
let items = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* storage empty or blocked */ }
  return sample();
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(items)); } catch (e) {}
}
function sample() {
  const d = n => { const t = new Date(); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); };
  return [
    { id: 1, name: "Visual Studio Pro", vendor: "Microsoft", key: "VS25-8F3K-92LQ-7XPA", seats: 5, expiry: d(220) },
    { id: 2, name: "Adobe Creative Cloud", vendor: "Adobe", key: "ACC9-71MD-4TZK-0QWE", seats: 3, expiry: d(18) },
    { id: 3, name: "JetBrains IntelliJ", vendor: "JetBrains", key: "JBI2-55HG-81NB-6RTY", seats: 2, expiry: d(-12) }
  ];
}
function daysLeft(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dateStr) - today) / 86400000);
}
function status(it) {
  const d = daysLeft(it.expiry);
  return d < 0 ? "expired" : d <= 30 ? "soon" : "active";
}
function mask(key) {
  return key.length <= 4 ? key : "•".repeat(key.length - 4) + key.slice(-4);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const f = $("filter").value;
  const shown = items.filter(it =>
    (f === "all" || status(it) === f) &&
    (it.name + " " + it.vendor).toLowerCase().includes(q));

  $("rows").innerHTML = shown.map(it => {
    const s = status(it);
    const label = { active: "Active", soon: "Expiring soon", expired: "Expired" }[s];
    return `<tr>
      <td>${esc(it.name)}</td><td>${esc(it.vendor)}</td><td>${esc(mask(it.key))}</td>
      <td>${it.seats}</td><td>${esc(it.expiry)}</td>
      <td><span class="tag ${s}">${label}</span></td>
      <td><button data-act="renew" data-id="${it.id}">Renew 1 year</button>
          <button class="del" data-act="del" data-id="${it.id}">Delete</button></td></tr>`;
  }).join("");
  $("empty").hidden = shown.length > 0;

  $("cTotal").textContent = items.length;
  $("cActive").textContent = items.filter(i => status(i) === "active").length;
  $("cSoon").textContent = items.filter(i => status(i) === "soon").length;
  $("cExp").textContent = items.filter(i => status(i) === "expired").length;
}

$("addForm").addEventListener("submit", e => {
  e.preventDefault();
  const key = $("key").value.trim();
  if (items.some(i => i.key === key)) {
    $("msg").textContent = "This license key is already saved. Use a different key.";
    return;
  }
  $("msg").textContent = "";
  items.push({
    id: Date.now(), name: $("name").value.trim(), vendor: $("vendor").value.trim(),
    key, seats: Math.max(1, parseInt($("seats").value, 10) || 1), expiry: $("expiry").value
  });
  save(); render(); e.target.reset(); $("seats").value = 1;
});

$("rows").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  const id = Number(b.dataset.id);
  if (b.dataset.act === "del") items = items.filter(i => i.id !== id);
  if (b.dataset.act === "renew") {
    const it = items.find(i => i.id === id);
    const base = daysLeft(it.expiry) < 0 ? new Date() : new Date(it.expiry);
    base.setFullYear(base.getFullYear() + 1);
    it.expiry = base.toISOString().slice(0, 10);
  }
  save(); render();
});

$("search").addEventListener("input", render);
$("filter").addEventListener("change", render);
render();
