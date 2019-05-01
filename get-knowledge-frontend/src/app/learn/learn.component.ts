import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";
import {RestService} from "../services/rest.service";
import {Translations} from "../translations/translations.enum";
import {MatListOption, MatSelectionList} from "@angular/material";
import {SelectionModel} from "@angular/cdk/collections";
import {MappingsService} from "../services/mappings.service";
import {Task} from "../classes/task";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Solution} from "../classes/solution";
import {NotificationService} from "../services/notification.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {

  translations = Translations;
  taskGroups: TaskGroup[] = [];
  selectedTaskGroup: TaskGroup = null;
  taskTypes: object[] = this.mappingsService.taskTypes;
  selectedTaskType: string = null;

  task: Task = null;
  form: FormGroup;
  taskSolution = new FormControl('', [Validators.required]);
  taskCorrectFirstPartOfSolution = new FormControl('', [Validators.required]);
  taskCorrectSecondPartOfSolution = new FormControl('', [Validators.required]);

  solution: Solution = null;
  isTaskSubmitted: boolean = false;

  wTypeSolutions: string[] = [];
  wTypeFirstPartOfSolutions: string[] = [];
  wTypeSecondPartOfSolutions: string[] = [];
  wTypeCheckboxSolutions: object[] = [];
  sTypeSolutions: string[] = [];
  gTypeGroups: object = {};
  gSelectElements: object[] = [];
  gSelectGroups: string[] = [];

  @ViewChild('taskGroupSelection') taskGroupSelection: MatSelectionList;
  @ViewChild('taskTypeSelection') taskTypeSelection: MatSelectionList;
  @ViewChild('ngForm') ngForm;

  constructor(private restService: RestService, private mappingsService: MappingsService, private fb: FormBuilder, private notificationService: NotificationService) { }

  ngOnInit() {
    this.taskGroupSelection.selectedOptions = new SelectionModel<MatListOption>(false);
    this.taskTypeSelection.selectedOptions = new SelectionModel<MatListOption>(false);
    this.getTaskGroups();
    this.initTaskForm();
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

  onTaskGroupSelection(e, v){
    this.selectedTaskGroup = e.option.value;
    this.bindTask();
  }

  onTaskTypeSelection(e, v){
    this.selectedTaskType = e.option.value;
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

  getTaskGroups() {
    this.restService.getStudentTaskGroups().subscribe(
      data => {
        console.log(data);
        this.bindTaskGroups(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  bindTaskGroups(data: any) {
    this.taskGroups = [];
    for (let taskGroup of data['taskGroups']) {
      const taskId = _.get(taskGroup, '_id', null);
      const taskGroupName = _.get(taskGroup, 'taskGroupName', null);
      const owner = _.get(taskGroup, 'owner', null);
      const isTestTaskGroup = _.get(taskGroup, 'isTestTaskGroup', null);
      if (!isTestTaskGroup) {
        this.taskGroups.push(new TaskGroup(taskId, taskGroupName, owner, isTestTaskGroup));
      }
    }
  }

  bindTask() {
    this.isTaskSubmitted = false;
    const taskGroup = _.get(this.selectedTaskGroup, 'id', null);
    const taskType = _.get(this.selectedTaskType, 'code', null);
    if (taskGroup && taskType) {
      this.restService.getTask(taskGroup, taskType).subscribe(
        data => {
          const id = _.get(data, 'task._id');
          const taskTitle = _.get(data, 'task.taskTitle');
          const taskGroup = _.get(data, 'task.taskGroup');
          const taskType = _.get(data, 'task.taskType');
          const owner = _.get(data, 'task.owner');
          const creationTs = _.get(data, 'task.creationTs');
          const taskContent = _.get(data, 'task.taskContent');
          const taskTip = _.get(data, 'task.taskTip');
          const taskPresentedValue = _.get(data, 'task.taskPresentedValue');
          const taskCorrectSolution = _.get(data, 'task.taskCorrectSolution');
          const taskWeight = _.get(data, 'task.taskWeight');
          const taskPoints = _.get(data, 'task.taskPoints');

          this.task = new Task(id, taskTitle, taskGroup, taskType, owner, creationTs, taskContent, taskTip, taskPresentedValue, taskCorrectSolution, taskWeight, taskPoints);
          this.solution = new Solution(this.task.id);
          this.initTaskForm();
          this.prepareTaskView();
        },
        error => {
          console.log(error);
        }
      )
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
          const isCorrect = _.get(data, 'solution.isCorrect', false);
          const correctTranslation = this.translations.TITLE_CORRECT_ANSWER;
          const incorrectTranslation = this.translations.TITLE_INCORRECT_ANSWER;
          isCorrect ?
            this.notificationService.showNotification(correctTranslation) :
            this.notificationService.showNotification(incorrectTranslation)
        },
        error => {
          console.log(error);
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
}
