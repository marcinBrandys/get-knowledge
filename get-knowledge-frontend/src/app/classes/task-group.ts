export class TaskGroup {
  private _id: string;
  private _taskGroupName: string;
  private _owner: string;
  private _isTestTaskGroup: boolean;
  private _startTs: number;
  private _endTs: number;

  constructor(id: string, taskGroupName: string, owner: string, isTestTaskGroup: boolean, startTs: number, endTs: number) {
    this._id = id;
    this._taskGroupName = taskGroupName;
    this._owner = owner;
    this._isTestTaskGroup = isTestTaskGroup;
    this._startTs = startTs;
    this._endTs = endTs;
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

  get startTs(): number {
    return this._startTs;
  }

  set startTs(value: number) {
    this._startTs = value;
  }

  get endTs(): number {
    return this._endTs;
  }

  set endTs(value: number) {
    this._endTs = value;
  }
}
