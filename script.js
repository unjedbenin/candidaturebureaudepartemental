
function fillSelect(sel, items, placeholder) {
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach(v => { const o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); });
  sel.disabled = false;
}
function resetSelect(sel, placeholder) {
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  sel.disabled = true;
}

// ── CASCADE RÉSIDENCE ─────────────────────────
const resDept = document.getElementById('res-dept');
const resComm = document.getElementById('res-comm');
const resArr  = document.getElementById('res-arr');

fillSelect(resDept, Object.keys(GEO).sort(), '-- Choisir le département --');
resDept.disabled = false;

resDept.addEventListener('change', () => {
  resetSelect(resComm, '-- Choisir la commune --');
  if (resDept.value) fillSelect(resComm, Object.keys(GEO[resDept.value]).sort(), '-- Choisir la commune --');
});

// ── DEPARTEMENT À COORDONNER ──────────────────
fillSelect(document.getElementById('coord-dept'), Object.keys(GEO).sort(), '-- Choisir le Département  --');

// ── APERÇU FICHIER ────────────────────────────
function showFile(input, previewId) {
  const f = input.files[0];
  if (f) document.getElementById(previewId).textContent = `✅ ${f.name} (${(f.size/1024).toFixed(0)} Ko)`;
}

// ── BARRE DE PROGRESSION ──────────────────────
window.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('.section-card');
  const dots  = document.querySelectorAll('.step-dot');
  let active  = 0;
  cards.forEach((c, i) => { if (c.getBoundingClientRect().top < window.innerHeight * .6) active = i; });
  dots.forEach((d, i) => { d.className = 'step-dot ' + (i < active ? 'done' : i === active ? 'active' : ''); });
  document.getElementById('step-label').textContent = `Section ${active + 1} / 5`;
});

// ── TOAST ─────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── SOUMISSION ────────────────────────────────
document.getElementById('candidature-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!document.getElementById('check-clause').checked) {
    showToast('⚠️ Acceptez la clause de confidentialité.'); return;
  }

  const btn = document.querySelector('.btn-submit');
  btn.innerHTML = '⏳ Envoi en cours…'; btn.disabled = true;

  try {
    const res = await fetch(this.action, {
      method: 'POST', body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      this.style.display = 'none';
      document.getElementById('success-screen').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('❌ Erreur lors de l\'envoi. Réessayez.');
      btn.innerHTML = '🇧🇯 Soumettre ma candidature'; btn.disabled = false;
    }
  } catch {
    showToast('❌ Connexion impossible. Vérifiez votre internet.');
    btn.innerHTML = '🇧🇯 Soumettre ma candidature'; btn.disabled = false;
  }
});

