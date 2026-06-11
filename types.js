// ==========================================================================
// RODIČOVSKÁ TŘÍDA PRO POLOŽKU MENU
// ==========================================================================
export class PolozkaMenu {
    _id;
    _nazev;
    _zakladniCena;
    _img;
    constructor(id, nazev, zakladniCena, img) {
        this._id = id;
        this._nazev = nazev;
        this._zakladniCena = zakladniCena;
        this._img = img;
        // Základní kontroly dat
        if (id <= 0)
            throw new Error("ID musí být kladné číslo.");
        if (nazev.trim() === "")
            throw new Error("Název nesmí být prázdný.");
        if (zakladniCena < 0)
            throw new Error("Základní cena nesmí být záporná.");
    }
    // Gettery, aby se k těm private věcem dalo v app.ts dostat
    get id() { return this._id; }
    get nazev() { return this._nazev; }
    get zakladniCena() { return this._zakladniCena; }
    get img() { return this._img; }
    getNazev() {
        return this._nazev;
    }
}
// ==========================================================================
// TŘÍDA JÍDLO (POTOMEK)
// ==========================================================================
export class Jidlo extends PolozkaMenu {
    _hmotnost;
    _cenaKrabicky;
    constructor(id, nazev, zakladniCena, hmotnost, cenaKrabicky, img) {
        // Pomocí super() pošleme společné věci do rodičovské třídy (včetně img)
        super(id, nazev, zakladniCena, img);
        this._hmotnost = hmotnost;
        this._cenaKrabicky = cenaKrabicky;
        if (hmotnost <= 0)
            throw new Error("Hmotnost musí být větší než 0.");
        if (cenaKrabicky < 0)
            throw new Error("Cena krabičky nemůže být záporná.");
    }
    // Výpočet ceny: jídlo + krabička
    vypocitejCenu() {
        return this.zakladniCena + this._cenaKrabicky;
    }
    get hmotnost() { return this._hmotnost; }
}
// ==========================================================================
// TŘÍDA NÁPOJ (POTOMEK)
// ==========================================================================
export class Napoj extends PolozkaMenu {
    _objem;
    _vratnaZaloha;
    constructor(id, nazev, zakladniCena, objem, vratnaZaloha, img) {
        // Zde taky posíláme img do rodiče
        super(id, nazev, zakladniCena, img);
        this._objem = objem;
        this._vratnaZaloha = vratnaZaloha;
        if (objem <= 0)
            throw new Error("Objem musí být větší než 0.");
        if (vratnaZaloha < 0)
            throw new Error("Záloha nemůže být záporná.");
    }
    // Výpočet ceny: nápoj + záloha za flašku/plechovku
    vypocitejCenu() {
        return this.zakladniCena + this._vratnaZaloha;
    }
    get objem() { return this._objem; }
}
// ==========================================================================
// TŘÍDA KOŠÍK
// ==========================================================================
export class Kosik {
    _seznamPolozek = [];
    pridejPolozku(p) {
        this._seznamPolozek.push(p);
    }
    // Spočítá cenu všech věcí v košíku dohromady
    vypocitejCelkovouCenu() {
        let celkem = 0;
        for (const polozka of this._seznamPolozek) {
            celkem += polozka.vypocitejCenu();
        }
        return celkem;
    }
    get seznamPolozek() {
        return this._seznamPolozek;
    }
}
