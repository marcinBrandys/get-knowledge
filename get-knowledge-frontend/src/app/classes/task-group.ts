export class TaskGroup {
  private _id: string;
  private _taskGroupName: string;
  private _owner: string;
  private _isTestTaskGroup: boolean;

  constructor(id: string, taskGroupName: string, owner: string, isTestTaskGroup: boolean) {
    this._id = id;
    this._taskGroupName = taskGroupName;
    this._owner = owner;
    this._isTestTaskGroup = isTestTaskGroup;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get taskGroupName(): string {
    return this._taskGroupName;
  }

  set taskGroupName(value: string) {
    this._taskGroupName = value;
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get isTestTaskGroup(): boolean {
    return this._isTestTaskGroup;
  }

  set isTestTaskGroup(value: boolean) {
    this._isTestTaskGroup = value;
  }
}
