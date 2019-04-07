export class Group {
  private _id: string;
  private _groupName: string;


  constructor(id: string, groupName: string) {
    this._id = id;
    this._groupName = groupName;
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
}
