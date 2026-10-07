const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const dlg = document.getElementById("profile");
const teams = ["All", ...new Set(TEAM.map(p => p.team))];
let active = "All";

function renderFilters() {
  filters.innerHTML = teams.map(t => {
    const n = t === "All" ? TEAM.length : TEAM.filter(p => p.team === t).length;
    return `<button class="chip${t === active ? " on" : ""}" data-team="${t}" aria-pressed="${t === active}">${t}<span>${n}</span></button>`;
  }).join("");
}
function renderGrid() {
  const list = active === "All" ? TEAM : TEAM.filter(p => p.team === active);
  grid.innerHTML = list.map((p, i) => `
    <button class="card" data-i="${TEAM.indexOf(p)}" style="--d:${i * 50}ms">
      <img src="images/${p.img}.svg" alt="Portrait of ${p.name}" loading="lazy" width="200" height="200">
      <span class="tag">${p.team}</span>
      <h3>${p.name}</h3>
      <p>${p.role}</p>
    </button>`).join("");
}
filters.addEventListener("click", e => {
  const b = e.target.closest("[data-team]"); if (!b) return;
  active = b.dataset.team; renderFilters(); renderGrid();
});
grid.addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const p = TEAM[c.dataset.i];
  document.getElementById("p-img").src = `images/${p.img}.svg`;
  document.getElementById("p-img").alt = `Portrait of ${p.name}`;
  for (const [id, v] of [["p-team", p.team], ["p-name", p.name], ["p-role", p.role], ["p-bio", p.bio], ["p-loc", p.location], ["p-joined", p.joined], ["p-fun", p.fun]])
    document.getElementById(id).textContent = v;
  dlg.showModal();
});
dlg.addEventListener("click", e => { if (e.target === dlg || e.target.hasAttribute("data-close")) dlg.close(); });
renderFilters(); renderGrid();
