export class Group {
  private _id: string;
  private _groupName: string;
  private _owner: string;
  private _students: string;


  constructor(id: string, groupName: string, owner: string, students: string) {
    this._id = id;
    this._groupName = groupName;
    this._owner = owner;
    this._students = students;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get groupName(): string {
    return this._groupName;
  }

  set groupName(value: string) {
    this._groupName = value;
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get students(): string {
    return this._students;
  }

  set students(value: string) {
    this._students = value;
  }
}
