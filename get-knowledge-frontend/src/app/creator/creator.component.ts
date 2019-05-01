import {Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../services/rest.service";
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";
import {NotificationService} from "../services/notification.service";
import {MappingsService} from "../services/mappings.service";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  translations = Translations;
  taskGroupCreationForm: FormGroup;
  taskGroupName = new FormControl('', [Validators.required]);
  isTestTaskGroup: boolean = false;
  taskCreationForm: FormGroup;
  taskTitle = new FormControl('', [Validators.required]);
  selectTaskType = new FormControl('', [Validators.required]);
  selectTaskGroup = new FormControl('', [Validators.required]);
  taskContent = new FormControl('', [Validators.required]);
  taskTip = new FormControl('', [Validators.required]);
  taskCorrectSolution = new FormControl('', [Validators.required]);
  taskCorrectFirstPartOfSolution = new FormControl('', [Validators.required]);
  taskCorrectSecondPartOfSolution = new FormControl('', [Validators.required]);
  taskWeight = new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]);
  taskPoints = new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)]);

  taskGroups: TaskGroup[] = [];
  taskTypes: object[] = this.mappingsService.taskTypes;

  wTypeSolutions: string[] = [];
  wTypeFirstPartOfSolutions: string[] = [];
  wTypeSecondPartOfSolutions: string[] = [];
  wTypeCheckboxSolutions: object[] = [];
  sTypeSolutions: string[] = [];
  gTypeGroups: object = {};

  @ViewChild('createTaskGroupNgForm') createTaskGroupNgForm;
  @ViewChild('createTaskNgForm') createTaskNgForm;

  constructor(private restService: RestService, private notificationService: NotificationService, private fb: FormBuilder, private mappingsService: MappingsService) { }

  ngOnInit() {
    this.taskGroupCreationForm = this.fb.group({
      taskGroupName: this.taskGroupName
    });
    this.initTaskCreationForm();
    this.getTaskGroups();
  }

  createTaskGroup() {
    if (this.taskGroupCreationForm.valid) {
      this.restService.createTaskGroup(this.taskGroupName.value, this.isTestTaskGroup).subscribe(
        data => {
          console.log(data);
          this.getTaskGroups();
          this.resetCreateTaskGroupForm();
          this.notificationService.showNotification(this.translations.CREATE_TASK_GROUP_SUCCESS);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  getTaskGroups() {
    this.restService.getTaskGroups().subscribe(
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
      this.taskGroups.push(new TaskGroup(taskId, taskGroupName, owner, isTestTaskGroup));
    }
  }

  resetCreateTaskGroupForm() {
    this.taskGroupCreationForm.reset();
    this.createTaskGroupNgForm.resetForm();
  }

  resetCreateTaskForm() {
    this.taskCreationForm.reset();
    this.createTaskNgForm.resetForm();
    this.isTestTaskGroup = false;
    this.wTypeSolutions = [];
    this.wTypeFirstPartOfSolutions = [];
    this.wTypeSecondPartOfSolutions = [];
    this.wTypeCheckboxSolutions = [];
    this.sTypeSolutions = [];
    this.gTypeGroups = {};
  }

  createTask() {
    console.log(this.taskCreationForm);
    if (this.taskCreationForm.valid) {
      const taskPresentedValue: string = this.prepareTaskPresentedValue();
      const solution: string = this.taskCorrectSolution.value ? this.taskCorrectSolution.value : this.prepareSolution();
      this.restService.createTask(this.taskTitle.value, this.selectTaskGroup.value, this.selectTaskType.value, this.taskContent.value, this.taskTip.value, taskPresentedValue, solution, this.taskWeight.value, this.taskPoints.value).subscribe(
        data => {
          console.log(data);
          this.notificationService.showNotification(this.translations.TITLE_TASK_ADDED);
          this.resetCreateTaskForm();
        },
        error => {
          console.log(error);
          this.notificationService.showNotification(this.translations.TITLE_TASK_ADDING_ERROR);
        }
      )
    }
  }

  initTaskCreationForm() {
    let config = {
      taskTitle: this.taskTitle,
      taskType: this.selectTaskType,
      taskGroup: this.selectTaskGroup,
      taskContent: this.taskContent,
      taskCorrectSolution: this.taskCorrectSolution
    };
    if (this.selectTaskType.value === 'T_02') {
      config['taskTip'] = this.taskTip;
    }
    if (this.selectTaskType.value === 'W_02' || this.selectTaskType.value === 'W_04' || this.selectTaskType.value === 'S_01' || this.selectTaskType.value === 'S_02' || this.selectTaskType.value === 'G_01') {
      delete config.taskCorrectSolution;
    }
    if (this.selectTaskType.value === 'W_04') {
      config['taskCorrectFirstPartOfSolution'] = this.taskCorrectFirstPartOfSolution;
      config['taskCorrectSecondPartOfSolution'] = this.taskCorrectSecondPartOfSolution;
    }
    this.taskCreationForm = this.fb.group(config);
    this.wTypeSolutions = [];
    this.wTypeFirstPartOfSolutions = [];
    this.wTypeSecondPartOfSolutions = [];
    this.wTypeCheckboxSolutions = [];
    this.sTypeSolutions = [];
    this.gTypeGroups = {};
  }

  onTaskTypeSelect() {
    this.initTaskCreationForm();
  }

  addWTypeSolution(wTypeSolution: string) {
    if (this.selectTaskType.value === 'W_01') {
      this.wTypeSolutions.push(wTypeSolution);
    } else if (this.selectTaskType.value === 'W_02') {
      this.wTypeCheckboxSolutions.push({
        text: wTypeSolution,
        check: false
      });
    }
  }

  addWTypeToPartOfSolution(wTypeSolution: string, partNumber: number) {
    if (partNumber === 1) {
      this.wTypeFirstPartOfSolutions.push(wTypeSolution);
    } else {
      this.wTypeSecondPartOfSolutions.push(wTypeSolution);
    }
  }

  addSTypeSolution(sTypeSolution: string) {
    this.sTypeSolutions.push(sTypeSolution);
  }

  swapSTypeSolution(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sTypeSolutions, event.previousIndex, event.currentIndex);
  }

  addGTypeGroup(gTypeGroupName: string) {
    this.gTypeGroups[gTypeGroupName] = [];
  }

  addGTypeElement(gTypeElementName: string) {
    if (_.has(this.gTypeGroups, this.mappingsService.gTypeAvailableElements)) {
      this.gTypeGroups[this.mappingsService.gTypeAvailableElements].push(gTypeElementName);
    } else {
      this.addGTypeGroup(this.mappingsService.gTypeAvailableElements);
      this.gTypeGroups[this.mappingsService.gTypeAvailableElements].push(gTypeElementName);
    }
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

  prepareSolution(): string {
    let solution: string = '';
    if (this.selectTaskType.value === 'W_02') {
      const checkedSolutions = _.filter(this.wTypeCheckboxSolutions, function (o) {
        return o['check'];
      });
      let checkedTexts: string[] = [];
      for (let solution of checkedSolutions) {
        checkedTexts.push(solution['text']);
      }
      checkedTexts = checkedTexts.sort();
      solution = _.join(checkedTexts, this.mappingsService.wTypeSeparator);
    } else if (this.selectTaskType.value === 'W_04') {
      solution = this.taskCorrectFirstPartOfSolution.value + this.mappingsService.wTypePartsSeparator + this.taskCorrectSecondPartOfSolution.value;
    } else if (this.selectTaskType.value === 'S_01' || this.selectTaskType.value === 'S_02') {
      solution = _.join(this.sTypeSolutions, this.mappingsService.sTypeSeparator);
    } else if (this.selectTaskType.value === 'G_01') {
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
    }

    return solution;
  }

  prepareTaskPresentedValue(): string {
    let taskPresentedValue: string = '';
    if (this.selectTaskType.value === 'W_01') {
      taskPresentedValue = _.join(this.wTypeSolutions, this.mappingsService.wTypeSeparator);
    } else if (this.selectTaskType.value === 'W_02') {
      let texts: string[] = [];
      for (let solution of this.wTypeCheckboxSolutions) {
        texts.push(solution['text']);
      }
      texts = texts.sort();
      taskPresentedValue = _.join(texts, this.mappingsService.wTypeSeparator);
    } else if (this.selectTaskType.value === 'W_04') {
      const firstPartOfSolution: string = _.join(this.wTypeFirstPartOfSolutions, this.mappingsService.wTypeSeparator);
      const secondPartOfSolution: string = _.join(this.wTypeSecondPartOfSolutions, this.mappingsService.wTypeSeparator);
      taskPresentedValue = firstPartOfSolution + this.mappingsService.wTypePartsSeparator + secondPartOfSolution;
    } else if (this.selectTaskType.value === 'S_01' || this.selectTaskType.value === 'S_02') {
      taskPresentedValue = _.join(this.sTypeSolutions, this.mappingsService.sTypeSeparator);
    } else if (this.selectTaskType.value === 'G_01') {
      let groupNames: string[] = [];
      let elementsToGroup: string[] = [];
      for (let groupKey of _.keys(this.gTypeGroups)) {
        if (groupKey !== this.mappingsService.gTypeAvailableElements) {
          groupNames.push(groupKey);
        }
        for (let element of this.gTypeGroups[groupKey]) {
          elementsToGroup.push(element);
        }
      }
      const groupNamesS: string = _.join(groupNames, this.mappingsService.gTypeGroupSeparator);
      const elementsToGroupS: string = _.join(elementsToGroup, this.mappingsService.gTypeElementSeparator);
      taskPresentedValue = groupNamesS + this.mappingsService.gTypeGroupAndElementSeparator + elementsToGroupS;
    }

    return taskPresentedValue;
  }

}
