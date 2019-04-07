export class User {
  private _id: string;
  private _role: string;
  private _firstName: string;
  private _lastName: string;
  private _nick: string;
  private _email: string;
  private _gender: string;
  private _age: number;


  constructor(id: string, role: string, firstName: string, lastName: string, nick: string, email: string, gender: string, age: number) {
    this._id = id;
    this._role = role;
    this._firstName = firstName;
    this._lastName = lastName;
    this._nick = nick;
    this._email = email;
    this._gender = gender;
    this._age = age;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
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

  get nick(): string {
    return this._nick;
  }

  set nick(value: string) {
    this._nick = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get gender(): string {
    return this._gender;
  }

  set gender(value: string) {
    this._gender = value;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }
}
