/* ===========================================================
   KASA — wybór dostawy/płatności, walidacja i złożenie zamówienia
   =========================================================== */

const form = qs('#form-kasa');
let wybranaDostawa = 'paczkomat';
let wybranaPlatnosc = 'blik';

/* --- pusty koszyk: nie ma czego zamawiać --- */
if (!Cart.get().length && qs('main .wrap')){
  qs('main .wrap').innerHTML = `<div class="empty">
    <div style="font-size:2.4rem">🕯️</div>
    <h2>Koszyk jest pusty</h2>
    <p>Dodaj produkty, żeby złożyć zamówienie.</p>
    <a class="btn" href="sklep.html" style="margin-top:12px">Przejdź do sklepu</a></div>`;
}

/* --- Opcje dostawy / płatności --- */
function rysujOpcje(){
  if (!form) return;
  qs('#opcje-dostawy').innerHTML = Object.entries(DOSTAWA).map(([k, d]) => `
    <label class="opt ${k === wybranaDostawa ? 'sel' : ''}" data-dostawa="${k}">
      <input type="radio" name="dostawa" value="${k}" ${k === wybranaDostawa ? 'checked' : ''}>
      <span><span class="t">${d.nazwa}</span><span class="d">${d.opis}</span></span>
      <span class="p">${d.cena ? zl(d.cena) : '0,00 zł'}</span>
    </label>`).join('');

  qs('#opcje-platnosci').innerHTML = Object.entries(PLATNOSC)
    .filter(([k]) => k !== 'pobranie' || wybranaDostawa === 'pobranie')
    .map(([k, p]) => `
      <label class="opt ${k === wybranaPlatnosc ? 'sel' : ''}" data-platnosc="${k}">
        <input type="radio" name="platnosc" value="${k}" ${k === wybranaPlatnosc ? 'checked' : ''}>
        <span><span class="t">${p.nazwa}</span><span class="d">${p.opis}</span></span>
      </label>`).join('');

  qs('#box-paczkomat').hidden = wybranaDostawa !== 'paczkomat';
}

form?.addEventListener('change', e => {
  const d = e.target.closest('[data-dostawa]');
  const p = e.target.closest('[data-platnosc]');

  if (d){
    wybranaDostawa = d.dataset.dostawa;
    // przy pobraniu płatność jest wymuszona, przy innych — nie może zostać "pobranie"
    if (wybranaDostawa === 'pobranie') wybranaPlatnosc = 'pobranie';
    else if (wybranaPlatnosc === 'pobranie') wybranaPlatnosc = 'blik';
    rysujOpcje(); rysujSumę();
  }
  if (p){ wybranaPlatnosc = p.dataset.platnosc; rysujOpcje(); }

  if (e.target.id === 'faktura') qs('#box-faktura').hidden = !e.target.checked;
});

/* --- Podsumowanie --- */
function kosztDostawy(){
  const c = DOSTAWA[wybranaDostawa].cena;
  return (Cart.subtotal() >= DARMOWA_OD && wybranaDostawa !== 'pobranie') ? 0 : c;
}

function rysujSumę(){
  const box = qs('#podsumowanie');
  if (!box) return;
  const sub = Cart.subtotal();
  const dost = kosztDostawy();
  const gratis = sub >= DARMOWA_OD && DOSTAWA[wybranaDostawa].cena > 0 && wybranaDostawa !== 'pobranie';

  box.innerHTML = `
    <h3 style="margin-top:0">Twoje zamówienie</h3>
    <div style="margin-bottom:14px">${Cart.get().map(i => {
      const p = produkt(i.id);
      return `<div class="mini-item">
        <span class="mt"><img src="${foto(p)}" alt=""></span>
        <span class="mi">${p.nazwa}<small>${i.ile} × ${zl(p.cena)}</small></span>
        <strong style="white-space:nowrap">${zl(p.cena * i.ile)}</strong>
      </div>`;
    }).join('')}</div>
    <div class="sum-line"><span>Wartość produktów</span><strong>${zl(sub)}</strong></div>
    <div class="sum-line"><span>${DOSTAWA[wybranaDostawa].nazwa}</span><strong>${dost ? zl(dost) : 'gratis'}</strong></div>
    ${gratis ? `<p class="muted" style="font-size:.82rem;margin:4px 0 0">Darmowa dostawa od ${zl(DARMOWA_OD)}. ✓</p>` : ''}
    <div class="sum-total"><span>Do zapłaty</span><span>${zl(sub + dost)}</span></div>
    <p class="muted" style="font-size:.8rem;margin:10px 0 0">Ceny brutto, zawierają 23% VAT.</p>
    <button class="btn block" type="submit" style="margin-top:16px">Zamawiam i płacę</button>
    <a class="btn ghost block" href="koszyk.html" style="margin-top:10px">Wróć do koszyka</a>`;
}

/* --- Walidacja --- */
const rx = {
  email: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
  tel:   /^\d{9}$/,
  kod:   /^\d{2}-\d{3}$/,
  nip:   /^\d{10}$/
};
const cyfry = v => v.replace(/\D/g, '');

function blad(el, jest){
  el.closest('.field')?.classList.toggle('invalid', jest);
  return !jest;
}

function sprawdz(){
  let ok = true;
  const v = id => qs('#' + id).value.trim();

  ok = blad(qs('#imie'),     v('imie').length < 2) && ok;
  ok = blad(qs('#nazwisko'), v('nazwisko').length < 2) && ok;
  ok = blad(qs('#email'),    !rx.email.test(v('email'))) && ok;
  ok = blad(qs('#telefon'),  !rx.tel.test(cyfry(v('telefon')))) && ok;
  ok = blad(qs('#ulica'),    v('ulica').length < 3) && ok;
  ok = blad(qs('#kod'),      !rx.kod.test(v('kod'))) && ok;
  ok = blad(qs('#miasto'),   v('miasto').length < 2) && ok;

  if (qs('#faktura').checked){
    ok = blad(qs('#firma'), v('firma').length < 2) && ok;
    ok = blad(qs('#nip'),   !rx.nip.test(cyfry(v('nip')))) && ok;
  }
  if (wybranaDostawa === 'paczkomat')
    ok = blad(qs('#paczkomat'), v('paczkomat').length < 4) && ok;

  const reg = qs('#regulamin').checked;
  qs('#check-regulamin').classList.toggle('invalid', !reg);
  return ok && reg;
}

/* auto-formatowanie kodu pocztowego */
qs('#kod')?.addEventListener('input', e => {
  const d = cyfry(e.target.value).slice(0, 5);
  e.target.value = d.length > 2 ? d.slice(0, 2) + '-' + d.slice(2) : d;
});

/* walidacja pola po wyjściu z niego */
form?.addEventListener('blur', e => {
  if (e.target.matches('input') && e.target.closest('.field')?.classList.contains('invalid')) sprawdz();
}, true);

/* --- Złożenie zamówienia --- */
form?.addEventListener('submit', e => {
  e.preventDefault();
  if (!sprawdz()){
    const pierwszy = qs('.field.invalid, .check.invalid');
    pierwszy?.scrollIntoView({behavior:'smooth', block:'center'});
    toast('Uzupełnij zaznaczone pola.');
    return;
  }

  const sub = Cart.subtotal();
  const zamowienie = {
    numer: 'LM-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
    data: new Date().toLocaleString('pl-PL'),
    klient: {
      imie: qs('#imie').value.trim(),
      nazwisko: qs('#nazwisko').value.trim(),
      email: qs('#email').value.trim(),
      telefon: qs('#telefon').value.trim()
    },
    adres: {
      ulica: qs('#ulica').value.trim(),
      kod: qs('#kod').value.trim(),
      miasto: qs('#miasto').value.trim(),
      kraj: qs('#kraj').value
    },
    firma: qs('#faktura').checked ? {nazwa: qs('#firma').value.trim(), nip: qs('#nip').value.trim()} : null,
    dostawa: {
      kod: wybranaDostawa,
      nazwa: DOSTAWA[wybranaDostawa].nazwa,
      cena: kosztDostawy(),
      paczkomat: wybranaDostawa === 'paczkomat' ? qs('#paczkomat').value.trim().toUpperCase() : null
    },
    platnosc: PLATNOSC[wybranaPlatnosc].nazwa,
    uwagi: qs('#uwagi').value.trim(),
    pozycje: Cart.get().map(i => {
      const p = produkt(i.id);
      return {nazwa: p.nazwa, ile: i.ile, cena: p.cena, suma: p.cena * i.ile};
    }),
    suma_produkty: sub,
    razem: sub + kosztDostawy()
  };

  localStorage.setItem('lumen_zamowienie', JSON.stringify(zamowienie));
  Cart.clear();
  location.href = 'potwierdzenie.html';
});

if (form){ rysujOpcje(); rysujSumę(); }
