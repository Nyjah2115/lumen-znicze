/* ============================================================
   Tom-Par — sklep ze zniczami. Cała logika po stronie klienta.
   Koszyk i zamówienie trzymane w localStorage.
   ============================================================ */

/* --- Ikony produktów (SVG zamiast zdjęć) --- */
const ART = {
  klasyk: `<svg viewBox="0 0 80 150" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M40 6c7 10 12 16 12 24a12 12 0 0 1-24 0c0-8 5-14 12-24z" fill="#ffd27a"/><path d="M40 20c3 5 5 8 5 12a5 5 0 0 1-10 0c0-4 2-7 5-12z" fill="#fff6e0"/><rect x="18" y="44" width="44" height="92" rx="8" fill="#b23b3b" opacity=".85"/><rect x="18" y="44" width="16" height="92" rx="8" fill="#d95757" opacity=".5"/><rect x="14" y="38" width="52" height="12" rx="6" fill="#c9a227"/><rect x="14" y="130" width="52" height="12" rx="6" fill="#c9a227"/></g></svg>`,
  szklo: `<svg viewBox="0 0 80 150" xmlns="http://www.w3.org/2000/svg"><g><path d="M40 10c6 9 11 15 11 22a11 11 0 0 1-22 0c0-7 5-13 11-22z" fill="#ffd27a"/><path d="M22 46h36c4 0 6 3 6 7v76c0 5-3 8-8 8H24c-5 0-8-3-8-8V53c0-4 2-7 6-7z" fill="#8fb7c9" opacity=".35"/><path d="M26 52h10v78H26z" fill="#dff0f7" opacity=".35"/><rect x="18" y="40" width="44" height="10" rx="5" fill="#cbd6da"/></g></svg>`,
  lampion: `<svg viewBox="0 0 80 150" xmlns="http://www.w3.org/2000/svg"><g><path d="M40 52c5 7 9 12 9 18a9 9 0 0 1-18 0c0-6 4-11 9-18z" fill="#ffd27a"/><path d="M20 34h40l6 12v78c0 5-3 8-8 8H22c-5 0-8-3-8-8V46z" fill="#2f2a24" opacity=".9"/><path d="M24 48h32v70H24z" fill="#ffca6a" opacity=".22"/><rect x="12" y="26" width="56" height="10" rx="5" fill="#8a7a5f"/><rect x="10" y="128" width="60" height="12" rx="6" fill="#8a7a5f"/></g></svg>`,
  wklad: `<svg viewBox="0 0 80 150" xmlns="http://www.w3.org/2000/svg"><g><path d="M40 40c5 7 9 11 9 17a9 9 0 0 1-18 0c0-6 4-10 9-17z" fill="#ffd27a"/><rect x="20" y="64" width="40" height="62" rx="6" fill="#e8e2d6"/><rect x="20" y="64" width="13" height="62" rx="6" fill="#fff" opacity=".6"/><rect x="16" y="58" width="48" height="10" rx="5" fill="#bdb6a6"/><rect x="16" y="120" width="48" height="10" rx="5" fill="#bdb6a6"/></g></svg>`,
  led: `<svg viewBox="0 0 80 150" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="40" cy="36" rx="9" ry="12" fill="#ffd98f"/><ellipse cx="40" cy="36" rx="4" ry="6" fill="#fff8e6"/><path d="M22 52h36c4 0 6 2 6 6v70c0 5-3 8-8 8H24c-5 0-8-3-8-8V58c0-4 2-6 6-6z" fill="#6f4f9c" opacity=".55"/><rect x="26" y="60" width="10" height="66" rx="5" fill="#fff" opacity=".2"/><rect x="18" y="46" width="44" height="10" rx="5" fill="#d8d2c6"/></g></svg>`,
  komplet: `<svg viewBox="0 0 110 150" xmlns="http://www.w3.org/2000/svg"><g><path d="M28 30c4 6 7 9 7 14a7 7 0 0 1-14 0c0-5 3-8 7-14z" fill="#ffd27a"/><path d="M78 24c5 7 8 11 8 16a8 8 0 0 1-16 0c0-5 3-9 8-16z" fill="#ffd27a"/><rect x="10" y="56" width="36" height="76" rx="8" fill="#b23b3b" opacity=".8"/><rect x="58" y="46" width="42" height="86" rx="8" fill="#2f5f4f" opacity=".85"/><rect x="6" y="50" width="44" height="10" rx="5" fill="#c9a227"/><rect x="54" y="40" width="50" height="10" rx="5" fill="#c9a227"/></g></svg>`
};

/* --- Katalog --- */
const PRODUKTY = [
  {id:'kl-01', nazwa:'Znicz klasyczny „Pamięć”', kat:'znicze', art:'klasyk', cena:14.90, opis:'Czerwony klosz z wkładem parafinowym. Czas palenia ok. 3 dni.', tag:'Bestseller'},
  {id:'kl-02', nazwa:'Znicz klasyczny bordo XL', kat:'znicze', art:'klasyk', cena:24.90, opis:'Powiększona wersja, wkład 60 h. Wysokość 34 cm.', tag:''},
  {id:'sz-01', nazwa:'Znicz szklany „Kryształ”', kat:'szklane', art:'szklo', cena:39.00, opis:'Grube szkło mrożone, mosiężna pokrywa. Odporny na wiatr i deszcz.', tag:'Nowość'},
  {id:'sz-02', nazwa:'Znicz szklany „Rosa” mały', kat:'szklane', art:'szklo', cena:27.50, opis:'Niski szklany znicz na pomniki dziecięce i nagrobki płaskie.', tag:''},
  {id:'lm-01', nazwa:'Lampion mosiężny „Memoria”', kat:'lampiony', art:'lampion', cena:89.00, opis:'Metalowy lampion z przeszkleniem, na wkłady 60 h. Wysokość 42 cm.', tag:'Premium'},
  {id:'lm-02', nazwa:'Lampion granitowy „Skała”', kat:'lampiony', art:'lampion', cena:129.00, opis:'Ciężka podstawa z granitu, szklany klosz. Nie przewróci się.', tag:''},
  {id:'wk-01', nazwa:'Wkład parafinowy 30 h (6 szt.)', kat:'wklady', art:'wklad', cena:22.00, opis:'Komplet sześciu wkładów do zniczy standardowych.', tag:''},
  {id:'wk-02', nazwa:'Wkład olejowy 60 h (4 szt.)', kat:'wklady', art:'wklad', cena:34.00, opis:'Dłuższe palenie, mniej dymu. Pasuje do lampionów.', tag:''},
  {id:'le-01', nazwa:'Znicz LED „Wieczny płomień”', kat:'led', art:'led', cena:49.00, opis:'Migoczący płomień LED, baterie w zestawie, do 120 dni świecenia.', tag:'Eko'},
  {id:'le-02', nazwa:'Znicz LED solarny', kat:'led', art:'led', cena:69.00, opis:'Ładuje się w dzień, świeci po zmroku. Bez wymiany baterii.', tag:''},
  {id:'kp-01', nazwa:'Komplet „Wszystkich Świętych” (5 szt.)', kat:'komplety', art:'komplet', cena:99.00, opis:'Pięć zniczy w stonowanych barwach — gotowy zestaw na 1 listopada.', tag:'Pakiet'},
  {id:'kp-02', nazwa:'Komplet rodzinny (10 szt.)', kat:'komplety', art:'komplet', cena:179.00, opis:'Dziesięć zniczy mieszanych: klasyczne, szklane i wkłady.', tag:''}
];

const KATEGORIE = [
  {id:'all', nazwa:'Wszystkie'},
  {id:'znicze', nazwa:'Znicze klasyczne'},
  {id:'szklane', nazwa:'Szklane'},
  {id:'lampiony', nazwa:'Lampiony'},
  {id:'wklady', nazwa:'Wkłady'},
  {id:'led', nazwa:'LED i solarne'},
  {id:'komplety', nazwa:'Komplety'}
];

const DOSTAWA = {
  kurier:   {nazwa:'Kurier DPD',            cena:16.99, opis:'Dostawa pod wskazany adres, 1–2 dni robocze.'},
  paczkomat:{nazwa:'Paczkomat InPost',      cena:13.99, opis:'Odbiór 24/7 w wybranym paczkomacie.'},
  pobranie: {nazwa:'Kurier za pobraniem',   cena:22.99, opis:'Płatność gotówką przy odbiorze paczki.'},
  odbior:   {nazwa:'Odbiór osobisty',       cena:0,     opis:'ul. Cmentarna 12, Stalowa Wola — pn.–sob. 8:00–18:00.'}
};

const PLATNOSC = {
  blik:     {nazwa:'BLIK',                  opis:'Wpisz kod z aplikacji banku.'},
  przelewy: {nazwa:'Szybki przelew online', opis:'Przekierowanie do banku (Przelewy24).'},
  karta:    {nazwa:'Karta płatnicza',       opis:'Visa, Mastercard — płatność szyfrowana.'},
  pobranie: {nazwa:'Za pobraniem',          opis:'Gotówka lub karta u kuriera.'}
};

const DARMOWA_OD = 200;

/* --- Pomocnicze --- */
const zl = n => n.toFixed(2).replace('.', ',') + ' zł';
const qs  = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];
const produkt = id => PRODUKTY.find(p => p.id === id);
const foto = p => `img/${p.id}.jpg`;

/* --- Koszyk --- */
const Cart = {
  key: 'tompar_koszyk',
  get(){ try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch(e){ return []; } },
  set(items){ localStorage.setItem(this.key, JSON.stringify(items)); odswiezLicznik(); },
  add(id, ile = 1){
    const items = this.get();
    const poz = items.find(i => i.id === id);
    if (poz) poz.ile += ile; else items.push({id, ile});
    this.set(items);
  },
  setQty(id, ile){
    let items = this.get();
    if (ile <= 0) items = items.filter(i => i.id !== id);
    else { const p = items.find(i => i.id === id); if (p) p.ile = ile; }
    this.set(items);
  },
  remove(id){ this.set(this.get().filter(i => i.id !== id)); },
  clear(){ this.set([]); },
  count(){ return this.get().reduce((s,i) => s + i.ile, 0); },
  subtotal(){ return this.get().reduce((s,i) => { const p = produkt(i.id); return p ? s + p.cena * i.ile : s; }, 0); }
};


/* --- Ulubione --- */
const Fav = {
  key: 'tompar_ulubione',
  get(){ try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch(e){ return []; } },
  set(ids){ localStorage.setItem(this.key, JSON.stringify(ids)); odswiezLicznik(); },
  has(id){ return this.get().includes(id); },
  toggle(id){
    const ids = this.get();
    const i = ids.indexOf(id);
    if (i === -1) ids.push(id); else ids.splice(i, 1);
    this.set(ids);
    return i === -1;               // true = dodano
  },
  remove(id){ this.set(this.get().filter(x => x !== id)); },
  count(){ return this.get().length; }
};

function odswiezLicznik(){
  const n = Cart.count();
  qsa('[data-cart-count]').forEach(el => { el.textContent = n; el.style.display = n ? '' : 'none'; });
  const f = Fav.count();
  qsa('[data-fav-count]').forEach(el => { el.textContent = f; el.style.display = f ? '' : 'none'; });
}

function toast(txt){
  let t = qs('.toast');
  if (!t){ t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = txt;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* --- Render kart produktów --- */
function kartaHTML(p){
  return `<article class="card">
    <div class="thumb">
      <img src="${foto(p)}" alt="${p.nazwa}" loading="lazy">
      ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
      <button class="fav ${Fav.has(p.id) ? 'on' : ''}" data-fav="${p.id}"
              aria-label="Dodaj do ulubionych" aria-pressed="${Fav.has(p.id)}">♥</button>
    </div>
    <div class="body">
      <h3>${p.nazwa}</h3>
      <p class="desc">${p.opis}</p>
      <div class="price">${zl(p.cena)} <small>/ szt.</small></div>
      <button class="btn block" style="margin-top:14px" data-add="${p.id}">Dodaj do koszyka</button>
    </div>
  </article>`;
}

function renderProdukty(kat = 'all', sel = '#lista-produktow', fraza = ''){
  const box = qs(sel);
  if (!box) return;
  const q = fraza.trim().toLowerCase();
  const lista = PRODUKTY
    .filter(p => kat === 'all' || p.kat === kat)
    .filter(p => !q || (p.nazwa + ' ' + p.opis).toLowerCase().includes(q));

  box.innerHTML = lista.length
    ? lista.map(kartaHTML).join('')
    : `<div class="empty" style="grid-column:1/-1">
         <div style="font-size:2rem">🔎</div>
         <h3 style="margin-top:10px">Brak wyników</h3>
         <p>Nie znaleźliśmy zniczy pasujących do zapytania.</p>
       </div>`;
}

/* --- Globalna obsługa „dodaj do koszyka” --- */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (!btn) return;
  Cart.add(btn.dataset.add, 1);
  toast(`Dodano: ${produkt(btn.dataset.add).nazwa}`);
});

/* --- Ulubione: klik w serduszko --- */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-fav]');
  if (!btn) return;
  const id = btn.dataset.fav;
  const dodano = Fav.toggle(id);
  btn.classList.toggle('on', dodano);
  btn.setAttribute('aria-pressed', dodano);
  toast(dodano ? `Dodano do ulubionych: ${produkt(id).nazwa}` : 'Usunięto z ulubionych');
  document.dispatchEvent(new CustomEvent('fav:zmiana', {detail:{id, dodano}}));
});

/* --- Menu mobilne --- */
document.addEventListener('click', e => {
  if (e.target.closest('.burger')) qs('.nav nav')?.classList.toggle('open');
});


/* --- Przeniesienie zapisów ze starej nazwy sklepu (lumen_* -> tompar_*) --- */
try {
  [['lumen_motyw','tompar_motyw'],['lumen_koszyk','tompar_koszyk'],
   ['lumen_ulubione','tompar_ulubione']].forEach(([stary, nowy]) => {
    const v = localStorage.getItem(stary);
    if (v !== null && localStorage.getItem(nowy) === null) localStorage.setItem(nowy, v);
    if (v !== null) localStorage.removeItem(stary);
  });
} catch(e){}

/* --- Motyw jasny / ciemny --- */
const Motyw = {
  key: 'tompar_motyw',
  zapisany(){ try { return localStorage.getItem(this.key); } catch(e){ return null; } },
  systemowy(){ return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; },
  aktualny(){ return document.documentElement.dataset.theme || 'light'; },
  ustaw(m){
    document.documentElement.dataset.theme = m;
    try { localStorage.setItem(this.key, m); } catch(e){}
    qsa('[data-theme-toggle]').forEach(b => {
      b.querySelector('.ikona').textContent = m === 'dark' ? '☀️' : '🌙';
      b.querySelector('.etykieta').textContent = m === 'dark' ? 'Jasny' : 'Ciemny';
      b.setAttribute('aria-label', m === 'dark' ? 'Włącz tryb jasny' : 'Włącz tryb ciemny');
    });
  },
  przelacz(){ this.ustaw(this.aktualny() === 'dark' ? 'light' : 'dark'); }
};

document.addEventListener('click', e => {
  if (e.target.closest('[data-theme-toggle]')) Motyw.przelacz();
});

/* jeśli użytkownik nic nie wybrał — podążamy za ustawieniem systemu */
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!Motyw.zapisany()) Motyw.ustaw(e.matches ? 'dark' : 'light');
});

/* --- Wyszukiwarka --- */
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-search]');
  if (!f) return;
  e.preventDefault();
  const q = f.querySelector('input').value.trim();
  location.href = 'sklep.html' + (q ? '?q=' + encodeURIComponent(q) : '');
});

document.addEventListener('DOMContentLoaded', () => { odswiezLicznik(); Motyw.ustaw(Motyw.aktualny()); });
