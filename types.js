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
    // Gettery pro přístup k private vlastnostem
    get id() { return this._id; }
    get nazev() { return this._nazev; }
    get zakladniCena() { return this._zakladniCena; }
    // metoda
    getNazev() {
        return this._nazev;
    }
}
