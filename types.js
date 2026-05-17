// Bazová třída pro položku v menu
export class PolozkaMenu {
    _id;
    _nazev;
    _zakladniCena;
    constructor(id, nazev, zakladniCena) {
        // přiřazení hodnot do vlastností
        this._id = id;
        this._nazev = nazev;
        this._zakladniCena = zakladniCena;
        // validace dat
        if (id <= 0)
            throw new Error("ID musí být kladné číslo.");
        if (nazev.trim() === "")
            throw new Error("Název nesmí být prázdný.");
        if (zakladniCena < 0)
            throw new Error("Základní cena nesmí být záporná.");
    }
    // gettery pro přístup k private vlastnostem
    get id() { return this._id; }
    get nazev() { return this._nazev; }
    get zakladniCena() { return this._zakladniCena; }
    // metoda
    getNazev() {
        return this._nazev;
    }
}
//Třída Jidlo (potomek PolozkaMenu)
export class Jidlo extends PolozkaMenu {
    _hmotnost;
    _cenaKrabicky;
    constructor(id, nazev, zakladniCena, hmotnost, cenaKrabicky) {
        super(id, nazev, zakladniCena); // volání konstruktoru rodiče
        this._hmotnost = hmotnost;
        this._cenaKrabicky = cenaKrabicky;
        // validace dat
        if (hmotnost <= 0)
            throw new Error("Hmotnost musí být větší než 0.");
        if (cenaKrabicky < 0)
            throw new Error("Cena krabičky nemůže být záporná.");
    }
    // výpočet ceny pro jídlo (cena jídla + obal)
    vypocitejCenu() {
        return this.zakladniCena + this._cenaKrabicky;
    }
    // getter pro hmotnost
    get hmotnost() { return this._hmotnost; }
}
// Třída Napoj (potomek PolozkaMenu)
export class Napoj extends PolozkaMenu {
    _objem;
    _vratnaZaloha;
    constructor(id, nazev, zakladniCena, objem, vratnaZaloha) {
        super(id, nazev, zakladniCena);
        if (objem <= 0)
            throw new Error("Objem musí být větší než 0.");
        if (vratnaZaloha < 0)
            throw new Error("Záloha nemůže být záporná.");
        this._objem = objem;
        this._vratnaZaloha = vratnaZaloha;
    }
    // výpočet ceny pro nápoj (cena nápoje + záloha za plechovku)
    vypocitejCenu() {
        return this.zakladniCena + this._vratnaZaloha;
    }
    get objem() { return this._objem; }
}
// Třída Kosik
export class Kosik {
    // Kosik obsahuje pole PolozkaMenu[]
    _seznamPolozek = [];
    //metoda pro přidání položky do košíku
    pridejPolozku(p) {
        this._seznamPolozek.push(p);
        console.log(`Přidáno do košíku: ${p.getNazev()}`);
    }
    // Výpočet celkové ceny košíku 
    vypocitejCelkovouCenu() {
        return this._seznamPolozek.reduce((celkem, polozka) => celkem + polozka.vypocitejCenu(), 0);
    }
    get seznamPolozek() {
        return this._seznamPolozek;
    }
}
