export class User {
  private _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _role: User_Roles;
  private _status: boolean;
  private _profilePicture: string;
  private _dateCreation: string;
  private _validated: boolean;

  constructor(id: string, firstName: string, lastName: string, email: string, role: User_Roles, status: boolean, profilePicture: string, dateCreation: string, validated: boolean) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._role = role;
    this._status = status;
    this._profilePicture = profilePicture;
    this._dateCreation = dateCreation;
    this._validated = validated;
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

  get role(): User_Roles {
    return this._role;
  }

  set role(value: User_Roles) {
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

  get validated(): boolean {
    return this._validated;
  }

  set validated(value: boolean) {
    this._validated = value;
  }
}

export enum User_Roles {
  admin = 'ADMIN',
  board = 'BOARD',
  prod = 'PROD'
}
