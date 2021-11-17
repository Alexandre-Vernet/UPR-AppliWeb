export class File {
    private _name: string;
    private _emplacement: string;
    private _date: Date;

    constructor(name: string, emplacement: string, date: Date) {
        this._name = name;
        this._emplacement = emplacement;
        this._date = date;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter emplacement
     * @return {string}
     */
    public get emplacement(): string {
        return this._emplacement;
    }

    /**
     * Getter date
     * @return {Date}
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter emplacement
     * @param {string} value
     */
    public set emplacement(value: string) {
        this._emplacement = value;
    }

    /**
     * Setter date
     * @param {Date} value
     */
    public set date(value: Date) {
        this._date = value;
    }

}
