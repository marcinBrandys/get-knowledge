import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {RestService} from "../services/rest.service";
import * as _ from "lodash";
import {TaskGroup} from "../classes/task-group";
import {Task} from "../classes/task";
import {Solution} from "../classes/solution";
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MappingsService} from "../services/mappings.service";
import {NotificationService} from "../services/notification.service";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss']
})
export class SolverComponent implements OnInit {

  translations = Translations;
  testId: string = null;
  test: TaskGroup = null;
  tasks: Task[] = [];
  task: Task = null;
  solution: Solution = null;

  form: FormGroup;
  taskSolution = new FormControl('', [Validators.required]);
  taskCorrectFirstPartOfSolution = new FormControl('', [Validators.required]);
  taskCorrectSecondPartOfSolution = new FormControl('', [Validators.required]);
  isTaskSubmitted: boolean = false;
  isTestStarted: boolean = false;
  hasTestEnded: boolean = false;

  wTypeSolutions: string[] = [];
  wTypeFirstPartOfSolutions: string[] = [];
  wTypeSecondPartOfSolutions: string[] = [];
  wTypeCheckboxSolutions: object[] = [];
  sTypeSolutions: string[] = [];
  gTypeGroups: object = {};
  gSelectElements: object[] = [];
  gSelectGroups: string[] = [];
  @ViewChild('ngForm') ngForm;

  constructor(private route: ActivatedRoute, private router: Router, private restService: RestService, private fb: FormBuilder, private mappingsService: MappingsService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.initTest();
    this.initTaskForm();
  }

  initTest() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => of(params.get('testId')))
    ).subscribe((testId) => {
      this.testId = testId;
      if (this.testId) {
        this.getTest();
        this.getTestTasks();
      } else {
        this.router.navigate(['/test']);
      }
    });
  }

  getTest() {
    this.restService.getTaskGroup(this.testId).subscribe(
      data => {
        this.bindTest(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  getTestTasks() {
    this.restService.getTestTasks(this.testId).subscribe(
      data => {
        this.bindTasks(data);
        this.checkIfTestEnded();
      },
      error => {
        console.log(error);
      }
    )
  }

  bindTest(data: any) {
    const taskGroup = _.get(data, 'taskGroup', null);
    const taskGroupId = _.get(taskGroup, '_id', null);
    const taskGroupName = _.get(taskGroup, 'taskGroupName', null);
    const owner = _.get(taskGroup, 'owner', null);
    const isTestTaskGroup = _.get(taskGroup, 'isTestTaskGroup', null);
    const startTs = _.get(taskGroup, 'startTs', null);
    const endTs = _.get(taskGroup, 'endTs', null);
    if (taskGroupId) {
      this.test = new TaskGroup(taskGroupId, taskGroupName, owner, isTestTaskGroup, startTs, endTs);
    }
  }

  bindTasks(data: any) {
    const tasks = _.get(data, 'tasks', []);
    for (let task of tasks) {
      const id = _.get(task, '_id');
      const taskTitle = _.get(task, 'taskTitle');
      const taskGroup = _.get(task, 'taskGroup');
      const taskType = _.get(task, 'taskType');
      const owner = _.get(task, 'owner');
      const creationTs = _.get(task, 'creationTs');
      const taskContent = _.get(task, 'taskContent');
      const taskTip = _.get(task, 'taskTip');
      const taskPresentedValue = _.get(task, 'taskPresentedValue');
      const taskCorrectSolution = _.get(task, 'taskCorrectSolution');
      const taskWeight = _.get(task, 'taskWeight');
      const taskPoints = _.get(task, 'taskPoints');

      if (id) {
        this.tasks.push(new Task(id, taskTitle, taskGroup, taskType, owner, creationTs, taskContent, taskTip, taskPresentedValue, taskCorrectSolution, taskWeight, taskPoints));
      }
    }
    console.log(this.tasks);
  }

  startTest() {
    this.bindTask();
    this.isTestStarted = true;
  }

  initTaskForm() {
    let config = {
      taskSolution: this.taskSolution
    };
    if (this.task && (this.task.taskType === 'W_02' || this.task.taskType === 'W_04' || this.task.taskType === 'S_01' || this.task.taskType === 'S_02' || this.task.taskType === 'G_01' || this.task.taskType === 'G_02')) {
      delete config.taskSolution;
    }
    if (this.task && this.task.taskType === 'W_04') {
      config['taskCorrectFirstPartOfSolution'] = this.taskCorrectFirstPartOfSolution;
      config['taskCorrectSecondPartOfSolution'] = this.taskCorrectSecondPartOfSolution;
    }
    this.form = this.fb.group(config);
    this.taskSolution.reset();
  }

  bindTask() {
    this.isTaskSubmitted = false;
    if (this.tasks.length > 0) {
      this.task = this.tasks[0];
      this.solution = new Solution(this.task.id);
      this.initTaskForm();
      this.prepareTaskView();
    } else {
      this.task = null;
      this.solution = null;
    }
  }

  prepareTaskView() {
    if (this.task && this.task.taskType === 'W_01') {
      this.wTypeSolutions = _.split(this.task.taskPresentedValue, this.mappingsService.wTypeSeparator);
      this.wTypeSolutions = _.shuffle(this.wTypeSolutions);
    } else if (this.task && this.task.taskType === 'W_02') {
      let texts: string[] = _.split(this.task.taskPresentedValue, this.mappingsService.wTypeSeparator);
      texts = _.shuffle(texts);
      for (let text of texts) {
        this.wTypeCheckboxSolutions.push({
          text: text,
          check: false
        });
      }
    } else if (this.task && this.task.taskType === 'W_04') {
      const parts: string[] = _.split(this.task.taskPresentedValue, this.mappingsService.wTypePartsSeparator);
      this.wTypeFirstPartOfSolutions = _.split(parts[0], this.mappingsService.wTypeSeparator);
      this.wTypeSecondPartOfSolutions = _.split(parts[1], this.mappingsService.wTypeSeparator);
      this.wTypeFirstPartOfSolutions = _.shuffle(this.wTypeFirstPartOfSolutions);
      this.wTypeSecondPartOfSolutions = _.shuffle(this.wTypeSecondPartOfSolutions);
    } else if (this.task && (this.task.taskType === 'S_01' || this.task.taskType === 'S_02')) {
      this.sTypeSolutions = _.split(this.task.taskPresentedValue, this.mappingsService.sTypeSeparator);
      this.sTypeSolutions = _.shuffle(this.sTypeSolutions);
    } else if (this.task && (this.task.taskType === 'G_01')) {
      const parts: string[] = _.split(this.task.taskPresentedValue, this.mappingsService.gTypeGroupAndElementSeparator);
      let groupNames: string[] = _.split(parts[0], this.mappingsService.gTypeGroupSeparator);
      const elements: string[] = _.split(parts[1], this.mappingsService.gTypeElementSeparator);
      this.gTypeGroups[this.mappingsService.gTypeAvailableElements] = [];
      groupNames = _.shuffle(groupNames);
      for (let groupName of groupNames) {
        this.gTypeGroups[groupName] = [];
      }
      for (let element of elements) {
        this.gTypeGroups[this.mappingsService.gTypeAvailableElements].push(element);
      }
      this.gTypeGroups[this.mappingsService.gTypeAvailableElements] = _.shuffle(this.gTypeGroups[this.mappingsService.gTypeAvailableElements]);
    } else if (this.task && (this.task.taskType === 'G_02')) {
      const parts: string[] = _.split(this.task.taskPresentedValue, this.mappingsService.gTypeGroupAndElementSeparator);
      const groups: string[] = _.split(parts[0], this.mappingsService.gTypeGroupSeparator);
      let elements: string[] = _.split(parts[1], this.mappingsService.gTypeElementSeparator);
      this.gSelectGroups = _.clone(groups);
      elements = _.shuffle(elements);
      for (let element of elements) {
        this.gSelectElements.push({
          name: element,
          value: ''
        });
      }
    }
  }

  prepareSolution(): string {
    let solution: string = '';
    if (this.task && this.task.taskType === 'W_02') {
      const checkedSolutions = _.filter(this.wTypeCheckboxSolutions, function (o) {
        return o['check'];
      });
      let checkedTexts: string[] = [];
      for (let solution of checkedSolutions) {
        checkedTexts.push(solution['text']);
      }
      checkedTexts = checkedTexts.sort();
      solution = _.join(checkedTexts, this.mappingsService.wTypeSeparator);
    } else if (this.task && this.task.taskType === 'W_04') {
      solution = this.taskCorrectFirstPartOfSolution.value + this.mappingsService.wTypePartsSeparator + this.taskCorrectSecondPartOfSolution.value;
    } else if (this.task && (this.task.taskType === 'S_01' || this.task.taskType === 'S_02')) {
      solution = _.join(this.sTypeSolutions, this.mappingsService.sTypeSeparator);
    } else if (this.task && this.task.taskType === 'G_01') {
      let solutions: string[] = [];
      let groupNames: string[] = _.keys(this.gTypeGroups);
      groupNames = groupNames.sort();
      if (_.has(groupNames, this.mappingsService.gTypeAvailableElements)) {
        delete groupNames[this.mappingsService.gTypeAvailableElements];
      }
      for (let groupKey of groupNames) {
        for (let element of this.gTypeGroups[groupKey]) {
          this.gTypeGroups[groupKey] = this.gTypeGroups[groupKey].sort();
        }
      }
      for (let groupKey of groupNames) {
        solutions.push(_.join(this.gTypeGroups[groupKey], this.mappingsService.gTypeElementSeparator));
      }
      solution = _.join(solutions, this.mappingsService.gTypeGroupAndElementSeparator);
    } else if (this.task && this.task.taskType === 'G_02') {
      let elementsToGroup: string[] = [];
      for (let element of this.gSelectElements) {
        elementsToGroup.push(element['value'] + this.mappingsService.gTypeElementSeparator + element['name']);
      }
      elementsToGroup.sort();
      solution = _.join(elementsToGroup, this.mappingsService.gTypeGroupAndElementSeparator);
    }

    return solution;
  }

  submitSolution() {
    console.log(this.form);
    if (this.form.valid) {
      const solution = this.taskSolution.value ? this.taskSolution.value : this.prepareSolution();
      this.solution.prepareToSubmit(solution);
      console.log(this.solution);
      this.restService.submitSolution(this.solution).subscribe(
        data => {
          console.log(data);
          this.notificationService.showNotification(this.translations.TITLE_SOLUTION_SUBMITTED);
          this.tasks.shift();
          this.resetTask();
          this.checkIfTestEnded();
        },
        error => {
          console.log(error);
          const errorCode = _.get(error, 'status');
          if (errorCode === 409) {
            this.notificationService.showNotification(this.translations.ERROR_TEST_TIMEOUT);
            this.router.navigate(['/dashboard']);
          }
        },
        () => {
          this.isTaskSubmitted = true;
        }
      )
    }
  }

  resetTask() {
    this.form.reset();
    this.ngForm.resetForm();
    this.task = null;
    this.solution = null;
    this.wTypeSolutions = [];
    this.wTypeFirstPartOfSolutions = [];
    this.wTypeSecondPartOfSolutions = [];
    this.wTypeCheckboxSolutions = [];
    this.sTypeSolutions = [];
    this.gTypeGroups = {};
    this.gSelectElements = [];
    this.gSelectGroups = [];
    this.isTaskSubmitted = false;
    this.bindTask();
  }

  onTipOpen() {
    if (this.solution) {
      this.solution.useTip();
    }
  }

  swapSTypeSolution(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sTypeSolutions, event.previousIndex, event.currentIndex);
  }

  getGTypeGroupKeys() {
    return _.keys(this.gTypeGroups);
  }

  dropGTypeElement(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  checkIfTestEnded() {
    if (this.tasks.length < 1) {
      this.hasTestEnded = true;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getDate(ts: number): string {
    return formatDate(new Date(ts), 'medium', 'pl-PL');
  }
}
