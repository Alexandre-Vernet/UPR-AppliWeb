import { User } from './user';

export class File {
	private _id: string;
	private _name: string;
	private _url: string;
	private _extension: string;
	private _type: string;
	private _size: number;
	private _addBy: User;
	private _date: string;

	constructor(id: string, name: string, url: string, extension: string, type: string, size: number, addBy: User, date: string) {
		this._id = id;
		this._name = name;
		this._url = url;
		this._extension = extension;
		this._type = type;
		this._size = size;
		this._addBy = addBy;
		this._date = date;
	}


	get id(): string {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get url(): string {
		return this._url;
	}

	set url(value: string) {
		this._url = value;
	}

	get extension(): string {
		return this._extension;
	}

	set extension(value: string) {
		this._extension = value;
	}

	get type(): string {
		return this._type;
	}

	set type(value: string) {
		this._type = value;
	}

	get size(): number {
		return this._size;
	}

	set size(value: number) {
		this._size = value;
	}

	get addBy(): User {
		return this._addBy;
	}

	set addBy(value: User) {
		this._addBy = value;
	}

	get date(): string {
		return this._date;
	}

	set date(value: string) {
		this._date = value;
	}
}
