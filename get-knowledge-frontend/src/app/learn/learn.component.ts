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

  @ViewChild('taskGroupSelection') taskGroupSelection: MatSelectionList;
  @ViewChild('taskTypeSelection') taskTypeSelection: MatSelectionList;
  @ViewChild('ngForm') ngForm;

  constructor(private restService: RestService, private mappingsService: MappingsService, private fb: FormBuilder) { }

  ngOnInit() {
    this.taskGroupSelection.selectedOptions = new SelectionModel<MatListOption>(false);
    this.taskTypeSelection.selectedOptions = new SelectionModel<MatListOption>(false);
    this.form = this.fb.group({
      taskSolution: this.taskSolution
    });
    this.getTaskGroups();
  }

  onTaskGroupSelection(e, v){
    this.selectedTaskGroup = e.option.value;
    this.bindTask();
  }

  onTaskTypeSelection(e, v){
    this.selectedTaskType = e.option.value;
    this.bindTask();
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
      this.taskGroups.push(new TaskGroup(taskId, taskGroupName, owner, isTestTaskGroup));
    }
  }

  bindTask() {
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
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  submitSolution() {
    console.log(this.form);
  }

  resetTask() {
    this.form.reset();
    this.ngForm.resetForm();
    this.task = null;
    this.bindTask();
  }

}
