// Bazová třída pro položku v menu
 
export abstract class PolozkaMenu {

    private _id: number;
    private _nazev: string;
    private _zakladniCena: number;

    constructor(id: number, nazev: string, zakladniCena: number) {
        // přiřazení hodnot do vlastností
        this._id = id;
        this._nazev = nazev;
        this._zakladniCena = zakladniCena;
        // validace dat
        if (id <= 0) throw new Error("ID musí být kladné číslo.");
        if (nazev.trim() === "") throw new Error("Název nesmí být prázdný.");
        if (zakladniCena < 0) throw new Error("Základní cena nesmí být záporná.");
    
    }

    // Gettery pro přístup k private vlastnostem
    public get id(): number { return this._id; }
    public get nazev(): string { return this._nazev; }
    public get zakladniCena(): number { return this._zakladniCena; }
    // metoda
    public getNazev(): string {
        return this._nazev;
    }

    // Abstraktní metoda, kterou musí každý potomek implementovat po svém
    public abstract vypocitejCenu(): number;
}
