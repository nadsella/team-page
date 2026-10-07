const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const dlg = document.getElementById("profile");

// Leaders first, then everyone else in their original order.
const PEOPLE = [...TEAM.filter(p => p.leader), ...TEAM.filter(p => !p.leader)];
const teams = ["All", ...new Set(PEOPLE.map(p => p.team))];
let active = "All";

document.getElementById("stat-people").textContent = TEAM.length;
document.getElementById("stat-teams").textContent = new Set(TEAM.filter(p => !p.leader).map(p => p.team)).size;
document.getElementById("stat-cities").textContent = new Set(TEAM.map(p => p.location).filter(l => l !== "Remote")).size;

function renderFilters() {
  filters.innerHTML = teams.map(t => {
    const n = t === "All" ? PEOPLE.length : PEOPLE.filter(p => p.team === t).length;
    return `<button class="chip${t === active ? " on" : ""}" data-team="${t}" aria-pressed="${t === active}">${t}<span>${n}</span></button>`;
  }).join("");
}
function renderGrid() {
  const list = active === "All" ? PEOPLE : PEOPLE.filter(p => p.team === active);
  grid.innerHTML = list.map((p, i) => `
    <button class="card${p.leader ? " is-leader" : ""}" data-team="${p.team.toLowerCase()}" data-i="${TEAM.indexOf(p)}" style="--d:${i * 50}ms">
      <img src="images/${p.img}.svg" alt="Portrait of ${p.name}" loading="lazy" width="200" height="200">
      ${p.leader ? '<span class="badge">Leadership</span>' : `<span class="tag">${p.team}</span>`}
      <h3>${p.name}</h3>
      <p>${p.role}</p>
    </button>`).join("");
}
filters.addEventListener("click", e => {
  const b = e.target.closest("[data-team]"); if (!b) return;
  active = b.dataset.team; renderFilters(); renderGrid();
});
grid.addEventListener("click", e => {
  const c = e.target.closest("[data-i]"); if (!c) return;
  const p = TEAM[c.dataset.i];
  document.getElementById("p-img").src = `images/${p.img}.svg`;
  document.getElementById("p-img").alt = `Portrait of ${p.name}`;
  for (const [id, v] of [["p-team", p.team], ["p-name", p.name], ["p-role", p.role], ["p-bio", p.bio], ["p-loc", p.location], ["p-joined", p.joined], ["p-fun", p.fun]])
    document.getElementById(id).textContent = v;
  const q = document.getElementById("p-quote");
  q.textContent = p.quote ? `“${p.quote}”` : "";
  q.hidden = !p.quote;
  dlg.showModal();
});
dlg.addEventListener("click", e => { if (e.target === dlg || e.target.hasAttribute("data-close")) dlg.close(); });
renderFilters(); renderGrid();
