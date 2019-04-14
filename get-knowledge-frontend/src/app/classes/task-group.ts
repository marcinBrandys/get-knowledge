export class TaskGroup {
  private _id: string;
  private _taskGroupName: string;
  private _owner: string;
  private _isTestTask: boolean;

  constructor(id: string, taskGroupName: string, owner: string, isTestTask: boolean) {
    this._id = id;
    this._taskGroupName = taskGroupName;
    this._owner = owner;
    this._isTestTask = isTestTask;
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

  get isTestTask(): boolean {
    return this._isTestTask;
  }

  set isTestTask(value: boolean) {
    this._isTestTask = value;
  }
}
