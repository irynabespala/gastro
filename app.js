import { Jidlo, Napoj, Kosik } from "./types.js";
import { surovaJidla, surovaNapoje } from "./data.js";
// ==========================================================================
// STAV APLIKACE
// ==========================================================================
// Sem si uloží všechny objekty jídla a nápojů, které vytvoří z dat
const menuPolozky = [];
//instance košíku, do kterého budeme přidávat položky
const mujKosik = new Kosik();
// Proměnná pro hlídání, jaká záložka je zrovna aktivní (výchozí jsou jídla)
let aktualniTab = "jidla";
let aktivniPolozkaProDetail = null;
let aktualniPocetKusu = 1;
// ==========================================================================
// NAČTENÍ DAT A TVORBA INSTANCÍ 
// ==========================================================================
for (const j of surovaJidla) {
    const jidloInstance = new Jidlo(j.id, j.nazev, j.zakladniCena, j.hmotnost, j.cenaKrabicky, j.img);
    menuPolozky.push(jidloInstance); // Přidám hotové jídlo do hlavního seznamu
}
// To samé udělám pro nápoje – projdu data a vytvořím objekty třídy Napoj
for (const n of surovaNapoje) {
    const napojInstance = new Napoj(n.id, n.nazev, n.zakladniCena, n.objem, n.vratnaZaloha, n.img);
    menuPolozky.push(napojInstance); // Přidám hotový nápoj do hlavního seznamu
}
// ==========================================================================
// NAČTENÍ HTML ELEMENTŮ 
// ==========================================================================
const menuGrid = document.getElementById("menu-grid");
const tabJidla = document.getElementById("tab-jidla");
const tabNapoje = document.getElementById("tab-napoje");
// Prvky pro detail produktu (vyskakovací okno)
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
// Prvky pro spodní plovoucí košík
const bottomCart = document.getElementById("bottom-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const orderBtn = document.getElementById("order-btn");
// Prvky pro závěrečné potvrzení objednávky
const successModal = document.getElementById("success-modal");
const orderAgainBtn = document.getElementById("order-again-btn");
// ==========================================================================
// FUNKCE: VYKRESLENÍ MENU NA STRÁNKU
// ==========================================================================
function vykresliMenu() {
    menuGrid.innerHTML = ""; // Nejdřív se vymažou staré karty, aby tam nebyly dvakrát
    // Vyfiltruju si položky podle toho, jaká záložka je zrovna vybraná
    const zobrazene = menuPolozky.filter(p => {
        if (aktualniTab === "jidla") {
            return p instanceof Jidlo; // Pokud chci jídla, beru jen objekty typu Jidlo
        }
        else {
            return p instanceof Napoj; // Jinak beru jen objekty typu Napoj
        }
    });
    for (const polozka of zobrazene) {
        const card = document.createElement("div");
        card.className = "menu-card";
        // prázdna proměnna pro gramy/litry
        let specifikace = "";
        // zjistím, zda pracuji s Jídlem nebo Nápojem 
        if (polozka instanceof Jidlo) {
            specifikace = polozka.hmotnost + "g";
        }
        else if (polozka instanceof Napoj) {
            specifikace = polozka.objem + "l";
        }
        // Naplním kartu HTML kódem a dosadím tam data z objektu
        card.innerHTML = `
            <div class="card-img-placeholder">
                <img src="${polozka.img}" alt="${polozka.nazev}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
            </div>
            <div class="card-details">
                <div class="card-header">
                    <h3 class="card-title">${polozka.nazev}</h3>
                    <span class="card-price">${polozka.vypocitejCenu()} Kč</span>
                </div>
                <div class="card-meta">${specifikace}</div>
            </div>
        `;
        // Když na kartu někdo klikne, zavolá se funkce pro otevření detailu
        card.addEventListener("click", () => otevriDetailProduktu(polozka));
        menuGrid.appendChild(card); // Vložím hotovou kartu do mřížky na stránce
    }
}
// ==========================================================================
// FUNKCE: DETAIL PRODUKTU (VYSKAKOVACÍ OKNO S INFORMACEMI O JÍDLE/NÁPOJI)
// ==========================================================================
function otevriDetailProduktu(polozka) {
    aktivniPolozkaProDetail = polozka; // Uložím si, na co se zrovna koukáme
    aktualniPocetKusu = 1; // Resetuju počet kusů na 1
    // Nastavím texty a obrázek v modálním okně podle vybrané položky
    modalTitle.innerText = polozka.nazev;
    modalImgPlaceholder.innerHTML = `<img src="${polozka.img}" alt="${polozka.nazev}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    // Specifické texty a výpočty pro Jídlo / Nápoj
    if (polozka instanceof Jidlo) {
        modalMeta.innerText = polozka.hmotnost + "g";
        const cenaObalu = polozka.vypocitejCenu() - polozka.zakladniCena;
        modalDescription.innerText = `Autentická gruzínská specialita. Cena jídla zahrnuje i nevratný eko obal (${cenaObalu} Kč).`;
    }
    else if (polozka instanceof Napoj) {
        modalMeta.innerText = polozka.objem + "l";
        modalDescription.innerText = `Tradiční nápoj ideální k doplnění výrazných gruzínských chutí.`;
    }
    aktualizujCenuVDetailu(); // Přepočítám cenu v okně
    detailModal.classList.remove("hidden"); // Zobrazí modální okno (smaže se CSS třída hidden)
}
// Funkce, která počítá cenu přímo uvnitř otevřeného detailu (ks * cena za kus)
function aktualizujCenuVDetailu() {
    if (aktivniPolozkaProDetail === null)
        return; // Kdyby náhodou nic vybraného nebylo, tak funkci ukončím
    modalQty.innerText = aktualniPocetKusu + " ks";
    const celkovaCenaOkna = aktivniPolozkaProDetail.vypocitejCenu() * aktualniPocetKusu;
    modalTotalPrice.innerText = celkovaCenaOkna + " Kč";
}
// ==========================================================================
// FUNKCE: PLOVOUCÍ KOŠÍK 
// ==========================================================================
function vykresliSpodniKosik() {
    cartItemsContainer.innerHTML = ""; // Vyčistím staré položky v košíku
    // Pokud je košík úplně prázdný, schovám ho a odeberu ze stránky posun menu
    if (mujKosik.seznamPolozek.length === 0) {
        bottomCart.classList.add("hidden");
        document.body.classList.remove("cart-open");
        return;
    }
    // Pokud v něm něco je, ukáže se
    bottomCart.classList.remove("hidden");
    document.body.classList.add("cart-open");
    // --- SESKUPENÍ STEJNÝCH POLOŽEK ---
    // aby se místo třikrát pod sebou "Chinkali" ukázalo jednou a u toho "x3"
    const seskupeno = {};
    for (const p of mujKosik.seznamPolozek) {
        if (seskupeno[p.id]) {
            seskupeno[p.id].ks++; // Pokud už položku v objektu mám, zvednu počet kusů
        }
        else {
            seskupeno[p.id] = { polozka: p, ks: 1 }; // Pokud ne, vytvořím nový záznam
        }
    }
    // --- VYKRESLENÍ ŘÁDKŮ KOŠÍKU ---
    for (const klic in seskupeno) {
        const item = seskupeno[klic];
        const row = document.createElement("div");
        row.className = "cart-item-row";
        const cenaRadku = item.polozka.vypocitejCenu() * item.ks;
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
        // Tlačítko pro smazání daného jídla z košíku
        const removeBtn = row.querySelector(".btn-remove-item");
        removeBtn.addEventListener("click", () => {
            smazPolozkuZKosiku(item.polozka.id);
        });
        cartItemsContainer.appendChild(row);
    }
    // Aktualizuju celkovou cenu košíku pomocí metody přímo z naší třídy Kosik
    cartTotal.innerText = mujKosik.vypocitejCelkovouCenu() + " Kč";
}
// Smazání jedné konkrétní položky (všech jejích kusů) z košíku pomocí filtru
function smazPolozkuZKosiku(id) {
    // Použiju metodu filter, která mi vrátí jen ty věci, které nechci smazat
    const filtrovane = mujKosik.seznamPolozek.filter(p => p.id !== id);
    // Vyprázdním staré pole v košíku a naházím do něj ty vyfiltrované položky
    mujKosik.seznamPolozek.length = 0;
    for (const p of filtrovane) {
        mujKosik.seznamPolozek.push(p);
    }
    vykresliSpodniKosik(); // Překreslím košík, aby se změna hned projevila
}
// Pomocná funkce na kompletní vyčištění košíku
function vymazCelyKosik() {
    mujKosik.seznamPolozek.length = 0; // Nastavím délku pole na 0, což ho vymaže
    vykresliSpodniKosik();
}
// ==========================================================================
// REAKCE NA KLIKÁNÍ UŽIVATELE
// ==========================================================================
// Tlačítko PLUS v detailu produktu
btnPlus.addEventListener("click", () => {
    aktualniPocetKusu++;
    aktualizujCenuVDetailu();
});
// Tlačítko MÍNUS v detailu produktu
btnMinus.addEventListener("click", () => {
    if (aktualniPocetKusu > 1) { // Nechci jít pod 1 kus
        aktualniPocetKusu--;
        aktualizujCenuVDetailu();
    }
});
// Tlačítko "Do košíku" v modálním okně
modalAddToCartBtn.addEventListener("click", () => {
    if (aktivniPolozkaProDetail !== null) {
        // Podle toho, kolik je navleno kusů, tolikrát zavolám metodu pridejPolozku
        for (let i = 0; i < aktualniPocetKusu; i++) {
            mujKosik.pridejPolozku(aktivniPolozkaProDetail);
        }
        detailModal.classList.add("hidden"); // Zavřu okno
        vykresliSpodniKosik(); // Aktualizuju košík
    }
});
// Křížek pro zavření detailu
closeDetailBtn.addEventListener("click", () => {
    detailModal.classList.add("hidden");
});
// Tlačítko "Vyčistit košík"
clearCartBtn.addEventListener("click", () => {
    vymazCelyKosik();
});
// Tlačítko "Objednat" 
orderBtn.addEventListener("click", () => {
    successModal.classList.remove("hidden");
    bottomCart.classList.add("hidden");
    document.body.classList.remove("cart-open");
});
// Tlačítko "Objednat znovu" na děkovací obrazovce
orderAgainBtn.addEventListener("click", () => {
    vymazCelyKosik();
    successModal.classList.add("hidden");
});
// Přepínání záložky na JÍDLA
tabJidla.addEventListener("click", () => {
    aktualniTab = "jidla";
    tabJidla.classList.add("active");
    tabNapoje.classList.remove("active");
    vykresliMenu(); // Znovu překreslím menu s novým filtrem
});
// Přepínání záložky na NÁPOJE
tabNapoje.addEventListener("click", () => {
    aktualniTab = "napoje";
    tabNapoje.classList.add("active");
    tabJidla.classList.remove("active");
    vykresliMenu(); // Znovu překreslím menu s novým filtrem
});
// Tyto funkce se spustí hned při načtení stránky, aby uživatel rovnou viděl menu
vykresliMenu();
vykresliSpodniKosik();
