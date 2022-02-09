export class User {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _role: string;
  private _status: boolean;
  private _profilePicture: string;
  private _dateCreation: string;

  constructor(id: string, firstName: string, lastName: string, email: string, role: string, status: boolean, profilePicture: string, dateCreation: string) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._role = role;
    this._status = status;
    this._profilePicture = profilePicture;
    this._dateCreation = dateCreation;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }

  get status(): boolean {
    return this._status;
  }

  set status(value: boolean) {
    this._status = value;
  }

  get profilePicture(): string {
    return this._profilePicture;
  }

  set profilePicture(value: string) {
    this._profilePicture = value;
  }

  get dateCreation(): string {
    return this._dateCreation;
  }

  set dateCreation(value: string) {
    this._dateCreation = value;
  }
}
