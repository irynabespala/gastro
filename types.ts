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

    // gettery pro přístup k private vlastnostem
    public get id(): number { return this._id; }
    public get nazev(): string { return this._nazev; }
    public get zakladniCena(): number { return this._zakladniCena; }
    // metoda
    public getNazev(): string {
        return this._nazev;
    }

    // abstraktní metoda, kterou musí každý potomek implementovat po svém
    public abstract vypocitejCenu(): number;
}

//Třída Jidlo (potomek PolozkaMenu)

export class Jidlo extends PolozkaMenu {
    private _hmotnost: number;
    private _cenaKrabicky: number;

    constructor(id: number, nazev: string, zakladniCena: number, hmotnost: number, cenaKrabicky: number) {
        super(id, nazev, zakladniCena); // volání konstruktoru rodiče
        this._hmotnost = hmotnost;
        this._cenaKrabicky = cenaKrabicky;
        // validace dat
        if (hmotnost <= 0) throw new Error("Hmotnost musí být větší než 0.");
        if (cenaKrabicky < 0) throw new Error("Cena krabičky nemůže být záporná.");
    }

    // výpočet ceny pro jídlo (cena jídla + obal)
    public vypocitejCenu(): number {
        return this.zakladniCena + this._cenaKrabicky;
    }
    // getter pro hmotnost
    public get hmotnost(): number { return this._hmotnost; }
}


 // Třída Napoj (potomek PolozkaMenu)
 
export class Napoj extends PolozkaMenu {
    private _objem: number;
    private _vratnaZaloha: number;

    constructor(id: number, nazev: string, zakladniCena: number, objem: number, vratnaZaloha: number) {
        super(id, nazev, zakladniCena);

        if (objem <= 0) throw new Error("Objem musí být větší než 0.");
        if (vratnaZaloha < 0) throw new Error("Záloha nemůže být záporná.");

        this._objem = objem;
        this._vratnaZaloha = vratnaZaloha;
    }

    