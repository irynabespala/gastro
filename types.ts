// ==========================================================================
// RODIČOVSKÁ TŘÍDA PRO POLOŽKU MENU
// ==========================================================================
export abstract class PolozkaMenu {
    private _id: number;
    private _nazev: string;
    private _zakladniCena: number;
    private _img: string; 

    constructor(id: number, nazev: string, zakladniCena: number, img: string) {
        this._id = id;
        this._nazev = nazev;
        this._zakladniCena = zakladniCena;
        this._img = img;

        // Základní kontroly dat
        if (id <= 0) throw new Error("ID musí být kladné číslo.");
        if (nazev.trim() === "") throw new Error("Název nesmí být prázdný.");
        if (zakladniCena < 0) throw new Error("Základní cena nesmí být záporná.");
    }

    // Gettery, aby se k těm private věcem dalo v app.ts dostat
    public get id(): number { return this._id; }
    public get nazev(): string { return this._nazev; }
    public get zakladniCena(): number { return this._zakladniCena; }
    public get img(): string { return this._img; }

    public getNazev(): string {
        return this._nazev;
    }

    // Tuhle metodu si musí každé jídlo/nápoj spočítat po svém
    public abstract vypocitejCenu(): number;
}

// ==========================================================================
// TŘÍDA JÍDLO (POTOMEK)
// ==========================================================================
export class Jidlo extends PolozkaMenu {
    private _hmotnost: number;
    private _cenaKrabicky: number;

    constructor(id: number, nazev: string, zakladniCena: number, hmotnost: number, cenaKrabicky: number, img: string) {
        // Pomocí super() pošleme společné věci do rodičovské třídy (včetně img)
        super(id, nazev, zakladniCena, img); 
        this._hmotnost = hmotnost;
        this._cenaKrabicky = cenaKrabicky;

        if (hmotnost <= 0) throw new Error("Hmotnost musí být větší než 0.");
        if (cenaKrabicky < 0) throw new Error("Cena krabičky nemůže být záporná.");
    }

    // Výpočet ceny: jídlo + krabička
    public vypocitejCenu(): number {
        return this.zakladniCena + this._cenaKrabicky;
    }

    public get hmotnost(): number { return this._hmotnost; }
}

// ==========================================================================
// TŘÍDA NÁPOJ (POTOMEK)
// ==========================================================================
export class Napoj extends PolozkaMenu {
    private _objem: number;
    private _vratnaZaloha: number;

    constructor(id: number, nazev: string, zakladniCena: number, objem: number, vratnaZaloha: number, img: string) {
        // Zde taky posíláme img do rodiče
        super(id, nazev, zakladniCena, img);
        this._objem = objem;
        this._vratnaZaloha = vratnaZaloha;

        if (objem <= 0) throw new Error("Objem musí být větší než 0.");
        if (vratnaZaloha < 0) throw new Error("Záloha nemůže být záporná.");
    }

    // Výpočet ceny: nápoj + záloha za flašku/plechovku
    public vypocitejCenu(): number {
        return this.zakladniCena + this._vratnaZaloha;
    }

    public get objem(): number { return this._objem; }
}

// ==========================================================================
// TŘÍDA KOŠÍK
// ==========================================================================
export class Kosik {
    private _seznamPolozek: PolozkaMenu[] = [];

    public pridejPolozku(p: PolozkaMenu): void {
        this._seznamPolozek.push(p);
    }

    // Spočítá cenu všech věcí v košíku dohromady
    public vypocitejCelkovouCenu(): number {
        let celkem = 0; 
        for (const polozka of this._seznamPolozek) {
            celkem += polozka.vypocitejCenu();
        }
        return celkem;
    }

    public get seznamPolozek(): PolozkaMenu[] {
        return this._seznamPolozek;
    }
}