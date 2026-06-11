import { Jidlo, Napoj, Kosik } from "./types.js";
import { surovaJidla, surovaNapoje } from "./data.js";
// Inicializace polí a košíku
const menuPolozky = [];
const mujKosik = new Kosik();
let aktualniTab = "jidla";
// Pomocný stav pro modální okno s detailem produktu
let aktivniPolozkaProDetail = null;
let aktualniPocetKusu = 1;
// Načtení dat z datových polí do instancí tříd a předání vlastnosti img
surovaJidla.forEach(j => {
    try {
        const jidloInstance = new Jidlo(j.id, j.nazev, j.zakladniCena, j.hmotnost, j.cenaKrabicky);
        jidloInstance.img = j.img;
        menuPolozky.push(jidloInstance);
    }
    catch (e) {
        console.error(e.message);
    }
});
surovaNapoje.forEach(n => {
    try {
        const napojInstance = new Napoj(n.id, n.nazev, n.zakladniCena, n.objem, n.vratnaZaloha);
        napojInstance.img = n.img;
        menuPolozky.push(napojInstance);
    }
    catch (e) {
        console.error(e.message);
    }
});
// --- DOM ELEMENTY ---
const menuGrid = document.getElementById("menu-grid");
const tabJidla = document.getElementById("tab-jidla");
const tabNapoje = document.getElementById("tab-napoje");
// Elementy pro Detail Modál
const detailModal = document.getElementById("detail-modal");
const closeDetailBtn = document.getElementById("close-detail-btn");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");
const modalDescription = document.getElementById("modal-description");
const modalImgPlaceholder = document.getElementById("modal-img-placeholder");
const modalQty = document.getElementById("modal-qty");
const modalTotalPrice = document.getElementById("modal-total-price");
const btnMinus = document.getElementById("btn-minus");
const btnPlus = document.getElementById("btn-plus");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");
// Elementy pro Plovoucí Košík
const bottomCart = document.getElementById("bottom-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const orderBtn = document.getElementById("order-btn");
// Elementy pro Success Modál
const successModal = document.getElementById("success-modal");
const orderAgainBtn = document.getElementById("order-again-btn");
// --- FUNKCE: VYKRESLENÍ MENU S REÁLNÝMI FOTKAMI ---
function vykresliMenu() {
    menuGrid.innerHTML = "";
    const zobrazene = menuPolozky.filter(p => aktualniTab === "jidla" ? p instanceof Jidlo : p instanceof Napoj);
    zobrazene.forEach(polozka => {
        const card = document.createElement("div");
        card.className = "menu-card";
        const specifikace = polozka instanceof Jidlo ? `${polozka.hmotnost}g` : `${polozka.objem}l`;
        const cestaKObrazku = polozka.img || "img/fallback.jpg";
        card.innerHTML = `
            <div class="card-img-placeholder">
                <img src="${cestaKObrazku}" alt="${polozka.nazev}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
            </div>
            <div class="card-details">
                <div class="card-header">
                    <h3 class="card-title">${polozka.nazev}</h3>
                    <span class="card-price">${polozka.vypocitejCenu()} Kč</span>
                </div>
                <div class="card-meta">${specifikace}</div>
            </div>
        `;
        card.addEventListener("click", () => otevriDetailProduktu(polozka));
        menuGrid.appendChild(card);
    });
}
// --- FUNKCE: DETAIL PRODUKTU (MODÁL S VELKOU FOTKOU) ---
function otevriDetailProduktu(polozka) {
    aktivniPolozkaProDetail = polozka;
    aktualniPocetKusu = 1;
    modalTitle.innerText = polozka.nazev;
    const cestaKObrazku = polozka.img || "img/fallback.jpg";
    modalImgPlaceholder.innerHTML = `<img src="${cestaKObrazku}" alt="${polozka.nazev}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    if (polozka instanceof Jidlo) {
        modalMeta.innerText = `${polozka.hmotnost}g`;
        modalDescription.innerText = `Autentická gruzínská specialita. Cena jídla zahrnuje i nevratný eko obal (${polozka.vypocitejCenu() - polozka.zakladniCena} Kč).`;
    }
    else if (polozka instanceof Napoj) {
        modalMeta.innerText = `${polozka.objem}l`;
        modalDescription.innerText = `Tradiční nápoj ideální k doplnění výrazných gruzínských chutí.`;
    }
    aktualizujCenuVDetailu();
    detailModal.classList.remove("hidden");
}
function aktualizujCenuVDetailu() {
    if (!aktivniPolozkaProDetail)
        return;
    modalQty.innerText = `${aktualniPocetKusu} ks`;
    const celkovaCenaOkna = aktivniPolozkaProDetail.vypocitejCenu() * aktualniPocetKusu;
    modalTotalPrice.innerText = `${celkovaCenaOkna} Kč`;
}
btnPlus.addEventListener("click", () => {
    aktualniPocetKusu++;
    aktualizujCenuVDetailu();
});
btnMinus.addEventListener("click", () => {
    if (aktualniPocetKusu > 1) {
        aktualniPocetKusu--;
        aktualizujCenuVDetailu();
    }
});
modalAddToCartBtn.addEventListener("click", () => {
    if (aktivniPolozkaProDetail) {
        for (let i = 0; i < aktualniPocetKusu; i++) {
            mujKosik.pridejPolozku(aktivniPolozkaProDetail);
        }
        detailModal.classList.add("hidden");
        vykresliSpodniKosik();
    }
});
// --- FUNKCE: PLOVOUCÍ KOŠÍK (ČISTÝ TEXT, ŽÁDNÉ SMAJLÍKY ANI OBRÁZKY) ---
function vykresliSpodniKosik() {
    cartItemsContainer.innerHTML = "";
    if (mujKosik.seznamPolozek.length === 0) {
        bottomCart.classList.add("hidden");
        document.body.classList.remove("cart-open");
        return;
    }
    bottomCart.classList.remove("hidden");
    document.body.classList.add("cart-open");
    const seskupeno = {};
    mujKosik.seznamPolozek.forEach(p => {
        if (seskupeno[p.id]) {
            seskupeno[p.id].ks++;
        }
        else {
            seskupeno[p.id] = { polozka: p, ks: 1 };
        }
    });
    Object.values(seskupeno).forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item-row";
        const cenaRadku = item.polozka.vypocitejCenu() * item.ks;
        // Kompletně odstraněna ikona/obrázek ze začátku řádku
        row.innerHTML = `
            <div class="item-left">
                <span>${item.polozka.nazev}</span>
                <span class="item-qty-badge">x${item.ks}</span>
            </div>
            <div class="item-right">
                <span>${cenaRadku} Kč</span>
                <button class="btn-remove-item" data-id="${item.polozka.id}">&times;</button>
            </div>
        `;
        const removeBtn = row.querySelector(".btn-remove-item");
        removeBtn.addEventListener("click", () => {
            const idKvymazani = parseInt(removeBtn.getAttribute("data-id") || "0");
            smazPolozkuZKosiku(idKvymazani);
        });
        cartItemsContainer.appendChild(row);
    });
    cartTotal.innerText = `${mujKosik.vypocitejCelkovouCenu()} Kč`;
}
function smazPolozkuZKosiku(id) {
    const list = mujKosik.seznamPolozek;
    for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].id === id) {
            list.splice(i, 1);
        }
    }
    vykresliSpodniKosik();
}
// --- EVENT LISTENERS ---
closeDetailBtn.addEventListener("click", () => {
    detailModal.classList.add("hidden");
});
clearCartBtn.addEventListener("click", () => {
    mujKosik.seznamPolozek.length = 0;
    vykresliSpodniKosik();
});
orderBtn.addEventListener("click", () => {
    successModal.classList.remove("hidden");
    bottomCart.classList.add("hidden");
    document.body.classList.remove("cart-open");
});
orderAgainBtn.addEventListener("click", () => {
    mujKosik.seznamPolozek.length = 0;
    successModal.classList.add("hidden");
    vykresliSpodniKosik();
});
tabJidla.addEventListener("click", () => {
    aktualniTab = "jidla";
    tabJidla.classList.add("active");
    tabNapoje.classList.remove("active");
    vykresliMenu();
});
tabNapoje.addEventListener("click", () => {
    aktualniTab = "napoje";
    tabNapoje.classList.add("active");
    tabJidla.classList.remove("active");
    vykresliMenu();
});
// --- INITIAL START ---
vykresliMenu();
vykresliSpodniKosik();
