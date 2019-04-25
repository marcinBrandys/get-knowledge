import {Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../services/rest.service";
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";
import {NotificationService} from "../services/notification.service";
import {MappingsService} from "../services/mappings.service";

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
  taskPresentedValue = new FormControl('', [Validators.required]);
  taskCorrectSolution = new FormControl('', [Validators.required]);
  taskWeight = new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]);
  taskPoints = new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)]);

  taskGroups: TaskGroup[] = [];
  taskTypes: object[] = this.mappingsService.taskTypes;

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
  }

  createTask() {
    console.log(this.taskCreationForm);
    if (this.taskCreationForm.valid) {
      this.restService.createTask(this.taskTitle.value, this.selectTaskGroup.value, this.selectTaskType.value, this.taskContent.value, this.taskTip.value, this.taskCorrectSolution.value, this.taskCorrectSolution.value, this.taskWeight.value, this.taskPoints.value).subscribe(
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
    this.taskCreationForm = this.fb.group(config);
  }

  onTaskTypeSelect() {
    this.initTaskCreationForm();
  }

}
