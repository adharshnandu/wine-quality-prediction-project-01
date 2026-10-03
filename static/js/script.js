const DATA = {"raw_rows":1143,"raw_cols":13,"rows":1018,"feats":["fixed_acidity","volatile_acidity","citric_acid","residual_sugar","chlorides","free_sulfur_dioxide","total_sulfur_dioxide","density","ph","sulphates","alcohol"],"dist":{"3":6,"4":33,"5":433,"6":409,"7":122,"8":15},"corr":{"fixed_acidity":0.118,"volatile_acidity":-0.407,"citric_acid":0.243,"residual_sugar":0.03,"chlorides":-0.194,"free_sulfur_dioxide":-0.071,"total_sulfur_dioxide":-0.209,"density":-0.188,"ph":-0.062,"sulphates":0.346,"alcohol":0.489},"imp":{"fixed_acidity":0.065,"volatile_acidity":0.124,"citric_acid":0.081,"residual_sugar":0.058,"chlorides":0.083,"free_sulfur_dioxide":0.07,"total_sulfur_dioxide":0.1,"density":0.085,"ph":0.079,"sulphates":0.116,"alcohol":0.138},"byq":{"alcohol":{"3":9.692,"4":10.261,"5":9.91,"6":10.667,"7":11.539,"8":11.983},"volatile_acidity":{"3":0.805,"4":0.698,"5":0.586,"6":0.505,"7":0.391,"8":0.414},"sulphates":{"3":0.55,"4":0.599,"5":0.605,"6":0.667,"7":0.737,"8":0.766}},"head":[[7.4,0.7,0.0,1.9,0.076,11.0,34.0,0.9978,3.51,0.56,9.4,5.0],[7.8,0.88,0.0,2.6,0.098,25.0,67.0,0.9968,3.2,0.68,9.8,5.0],[7.8,0.76,0.04,2.3,0.092,15.0,54.0,0.997,3.26,0.65,9.8,5.0],[11.2,0.28,0.56,1.9,0.075,17.0,60.0,0.998,3.16,0.58,9.8,6.0],[7.4,0.66,0.0,1.8,0.075,13.0,40.0,0.9978,3.51,0.56,9.4,5.0],[7.9,0.6,0.06,1.6,0.069,15.0,59.0,0.9964,3.3,0.46,9.4,5.0],[7.3,0.65,0.0,1.2,0.065,15.0,21.0,0.9946,3.39,0.47,10.0,7.0],[7.8,0.58,0.02,2.0,0.073,9.0,18.0,0.9968,3.36,0.57,9.5,7.0]],"stats":{"fixed_acidity":[4.6,8.2484,12.1],"volatile_acidity":[0.12,0.5321,1.0275],"citric_acid":[0.0,0.2687,0.915],"residual_sugar":[0.9,2.3265,3.65],"chlorides":[0.04,0.0808,0.12],"free_sulfur_dioxide":[1.0,15.5093,42.0],"total_sulfur_dioxide":[6.0,45.5688,123.5],"density":[0.9922,0.9967,1.0012],"ph":[2.925,3.3105,3.685],"sulphates":[0.33,0.6474,0.975],"alcohol":[8.4,10.4501,13.75]}};

const nice = f => ({ph:"pH"}[f] || f.replace(/_/g," ").replace(/^./, c => c.toUpperCase()));

function vbars(id, obj, dec) {
  const keys = Object.keys(obj), max = Math.max(...Object.values(obj));
  document.getElementById(id).innerHTML = keys.map(k =>
    `<div class="vb"><span class="vv">${(+obj[k]).toFixed(dec)}</span><i style="height:${Math.max(obj[k] / max * 100, 2)}%"></i><span class="vl">${k}</span></div>`).join("");
}
function hbars(id, obj, signed) {
  const items = Object.entries(obj).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])), max = Math.max(...items.map(i => Math.abs(i[1])));
  document.getElementById(id).innerHTML = items.map(([k, v]) =>
    `<div class="hb"><span>${nice(k)}</span><div><i class="${v < 0 ? "neg" : ""}" style="width:${Math.abs(v) / max * 100}%"></i></div><b>${signed && v > 0 ? "+" : ""}${v.toFixed(2)}</b></div>`).join("");
}
function stats(id, list) {
  document.getElementById(id).innerHTML = list.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
}
function table(id, head, rows) {
  document.getElementById(id).innerHTML = "<thead><tr>" + head.map(h => `<th>${h}</th>`).join("") + "</tr></thead><tbody>" +
    rows.map(r => "<tr>" + r.map(c => `<td>${c}</td>`).join("") + "</tr>").join("") + "</tbody>";
}

function buildData() {
  const d = DATA, f = d.feats;
  const top = Object.entries(d.corr).sort((a, b) => b[1] - a[1]);
  const common = Object.entries(d.dist).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]).sort();
  stats("stats", [[d.rows, "wines after cleaning"], [f.length, "input properties"], [Object.keys(d.dist).length, "quality scores (" + Object.keys(d.dist)[0] + " to " + Object.keys(d.dist).slice(-1) + ")"], [d.raw_rows - d.rows, "duplicate rows removed"]]);
  vbars("c-dist", d.dist, 0);
  hbars("c-corr", d.corr, true);
  document.getElementById("take").innerHTML = [
    `Most wines score ${common[0]} or ${common[1]}. Scores at the extremes are rare, which is why predicting them is hard.`,
    `${nice(top[0][0])} has the strongest positive link with quality (r = ${top[0][1].toFixed(2)}).`,
    `${nice(top[top.length - 1][0])} has the strongest negative link with quality (r = ${top[top.length - 1][1].toFixed(2)}).`,
    "Correlation shows a relationship, not a cause, and the Random Forest also uses combinations of properties."
  ].map(t => `<li>${t}</li>`).join("");
  vbars("c-alc", d.byq.alcohol, 1); vbars("c-vol", d.byq.volatile_acidity, 2); vbars("c-sul", d.byq.sulphates, 2);
  hbars("c-imp", d.imp, false);
  stats("dstats", [[d.raw_rows, "rows in WineQT"], [d.raw_cols, "columns (incl. Id)"], [d.rows, "rows after cleaning"], [f.length, "input features"]]);
  table("t-head", f.map(nice).concat("Quality"), d.head);
  table("t-stats", ["Property", "Min", "Average", "Max"], f.map(k => [nice(k), ...d.stats[k]]));
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  try { const t = localStorage.getItem("wq-theme"); if (t) root.dataset.theme = t; } catch (e) {}
  document.getElementById("theme").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("wq-theme", root.dataset.theme); } catch (e) {}
  });

  buildData();
  const views = document.querySelectorAll(".view"), links = document.querySelectorAll("a[href^='#']");
  const show = () => {
    let id = location.hash.slice(1);
    if (!document.getElementById("v-" + id)) id = "predict";
    views.forEach(v => v.hidden = v.id !== "v-" + id);
    links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
    window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", show);
  show();

  const sliders = document.querySelectorAll('input[type="range"]');
  const paint = s => {
    s.style.setProperty("--pct", ((s.value - s.min) / (s.max - s.min)) * 100 + "%");
    s.closest(".slider").querySelector("output").textContent = (+s.value).toFixed(+s.dataset.dec);
  };
  sliders.forEach(s => { paint(s); s.addEventListener("input", () => paint(s)); });
  document.getElementById("reset-btn").addEventListener("click", () => sliders.forEach(s => { s.value = s.dataset.default; paint(s); }));

  const btn = document.getElementById("predict-btn"), label = btn.innerHTML;
  document.getElementById("wine-form").addEventListener("submit", () => { btn.disabled = true; btn.lastChild.textContent = "Predicting…"; });
  window.addEventListener("pageshow", () => { btn.disabled = false; btn.innerHTML = label; });

  const result = document.querySelector("[data-has-result]");
  if (result && window.matchMedia("(max-width: 1000px)").matches) result.scrollIntoView({ block: "start" });
});
/* ===== ANIMATIONS ===== */
document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".slider,.stat,.steps li,.vb,.hb").forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", i * 70 + "ms");
  });

  document.addEventListener("pointermove", e => {
    const c = e.target.closest && e.target.closest(".card");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  });

  document.querySelectorAll('input[type="range"]').forEach(s => {
    const o = s.closest(".slider").querySelector("output");
    s.addEventListener("input", () => { o.classList.remove("bump"); void o.offsetWidth; o.classList.add("bump"); });
  });

  const count = (el, ms) => {
    const end = parseFloat(el.textContent);
    if (isNaN(end) || reduce) return;
    const t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / ms, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = end;
    };
    requestAnimationFrame(tick);
  };
  const run = () => document.querySelectorAll(".view:not([hidden]) .stat b, .view:not([hidden]) .num").forEach(el => count(el, 1100));
  window.addEventListener("hashchange", run);
  run();
});