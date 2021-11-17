export class File {
    private _id: number;
    private _name: string;
    private _date: Date;

    constructor(name: string) {
        this._name = name;
    }

    /**
     * Getter id
     * @return {number}
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter date
     * @return {Date}
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Setter id
     * @param {number} value
     */
    public set id(value: number) {
        this._id = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter date
     * @param {Date} value
     */
    public set date(value: Date) {
        this._date = value;
    }
}
