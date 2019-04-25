export class Task {
  private _id: string;
  private _taskTitle: string;
  private _taskGroup: string;
  private _taskType: string;
  private _owner: string;
  private _creationTs: number;
  private _taskContent: string;
  private _taskTip: string;
  private _taskPresentedValue: string;
  private _taskCorrectSolution: string;
  private _taskWeight: number;
  private _taskPoints: number;

  constructor(id: string, taskTitle: string, taskGroup: string, taskType: string, owner: string, creationTs: number, taskContent: string, taskTip: string, taskPresentedValue: string, taskCorrectSolution: string, taskWeight: number, taskPoints: number) {
    this._id = id;
    this._taskTitle = taskTitle;
    this._taskGroup = taskGroup;
    this._taskType = taskType;
    this._owner = owner;
    this._creationTs = creationTs;
    this._taskContent = taskContent;
    this._taskTip = taskTip;
    this._taskPresentedValue = taskPresentedValue;
    this._taskCorrectSolution = taskCorrectSolution;
    this._taskWeight = taskWeight;
    this._taskPoints = taskPoints;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get taskTitle(): string {
    return this._taskTitle;
  }

  set taskTitle(value: string) {
    this._taskTitle = value;
  }

  get taskGroup(): string {
    return this._taskGroup;
  }

  set taskGroup(value: string) {
    this._taskGroup = value;
  }

  get taskType(): string {
    return this._taskType;
  }

  set taskType(value: string) {
    this._taskType = value;
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get creationTs(): number {
    return this._creationTs;
  }

  set creationTs(value: number) {
    this._creationTs = value;
  }

  get taskContent(): string {
    return this._taskContent;
  }

  set taskContent(value: string) {
    this._taskContent = value;
  }

  get taskTip(): string {
    return this._taskTip;
  }

  set taskTip(value: string) {
    this._taskTip = value;
  }

  get taskPresentedValue(): string {
    return this._taskPresentedValue;
  }

  set taskPresentedValue(value: string) {
    this._taskPresentedValue = value;
  }

  get taskCorrectSolution(): string {
    return this._taskCorrectSolution;
  }

  set taskCorrectSolution(value: string) {
    this._taskCorrectSolution = value;
  }

  get taskWeight(): number {
    return this._taskWeight;
  }

  set taskWeight(value: number) {
    this._taskWeight = value;
  }

  get taskPoints(): number {
    return this._taskPoints;
  }

  set taskPoints(value: number) {
    this._taskPoints = value;
  }
}
