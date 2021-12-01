export class File {
	private _name: string;
	private _url: string;
	private _extension: string;
	private _size: number;
	private _date: Date;

	constructor(
		name: string,
		url: string,
		extension: string,
		size: number,
		date: Date
	) {
		this._name = name;
		this._url = url;
		this._extension = extension;
		this._size = size;
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
	 * Getter url
	 * @return {string}
	 */
	public get url(): string {
		return this._url;
	}

	/**
	 * Getter extension
	 * @return {string}
	 */
	public get extension(): string {
		return this._extension;
	}

	/**
	 * Getter size
	 * @return {number}
	 */
	public get size(): number {
		return this._size;
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
	 * Setter url
	 * @param {string} value
	 */
	public set url(value: string) {
		this._url = value;
	}

	/**
	 * Setter extension
	 * @param {string} value
	 */
	public set extension(value: string) {
		this._extension = value;
	}

	/**
	 * Setter size
	 * @param {number} value
	 */
	public set size(value: number) {
		this._size = value;
	}

	/**
	 * Setter date
	 * @param {Date} value
	 */
	public set date(value: Date) {
		this._date = value;
	}
}
