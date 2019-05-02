export class User {
  private _id: string;
  private _role: string;
  private _nick: string;
  private _gender: string;
  private _age: number;

  constructor(id: string, role: string, nick: string, gender: string, age: number) {
    this._id = id;
    this._role = role;
    this._nick = nick;
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

  get nick(): string {
    return this._nick;
  }

  set nick(value: string) {
    this._nick = value;
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
