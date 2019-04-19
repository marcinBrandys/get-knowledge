import {Component, OnInit, ViewChild} from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../services/rest.service";
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";
import {NotificationService} from "../services/notification.service";

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
  taskType = new FormControl('', [Validators.required]);
  selectTaskGroup = new FormControl('', [Validators.required]);
  taskContent = new FormControl('', [Validators.required]);
  taskElements = new FormControl('');
  taskCorrectSolution = new FormControl('', [Validators.required]);
  taskWeight = new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]);
  taskPoints = new FormControl('', [Validators.required, Validators.min(1), Validators.max(20)]);

  taskGroups: TaskGroup[] = [];

  @ViewChild('createTaskGroupNgForm') createTaskGroupNgForm;

  constructor(private restService: RestService, private notificationService: NotificationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.taskGroupCreationForm = this.fb.group({
      taskGroupName: this.taskGroupName
    });
    this.taskCreationForm = this.fb.group({
      taskTitle: this.taskTitle,
      taskType: this.taskType,
      taskGroup: this.selectTaskGroup,
      taskContent: this.taskContent,
      taskElements: this.taskElements,
      taskCorrectSolution: this.taskCorrectSolution
    });
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

  createTask() {
    console.log(this.taskCreationForm);
  }

  resetCreateTaskGroupForm() {
    this.taskGroupCreationForm.reset();
    this.createTaskGroupNgForm.resetForm();
  }

}
