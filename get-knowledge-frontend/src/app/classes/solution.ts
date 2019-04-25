export class Solution {
  public taskId: string;
  public startTs: number;
  public endTs: number;
  public answer: string;
  public isTipUsed: boolean;

  constructor(taskId: string) {
    this.taskId = taskId;
    this.startTs = +new Date();
    this.endTs = +new Date();
    this.answer = '';
    this.isTipUsed = false;
  }

  prepareToSubmit(answer: string) {
    this.answer = answer;
    this.endTs = +new Date();
  }

  useTip() {
    this.isTipUsed = true;
  }
}
