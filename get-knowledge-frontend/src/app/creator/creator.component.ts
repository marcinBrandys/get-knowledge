import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RestService} from "../services/rest.service";
import {TaskGroup} from "../classes/task-group";
import * as _ from "lodash";

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

  taskGroups: TaskGroup[] = [];

  constructor(private restService: RestService, private fb: FormBuilder) { }

  ngOnInit() {
    this.taskGroupCreationForm = this.fb.group({
      taskGroupName: this.taskGroupName
    });
    this.getTaskGroups();
  }

  createTaskGroup() {
    if (this.taskGroupCreationForm.valid) {
      this.restService.createTaskGroup(this.taskGroupName.value, this.isTestTaskGroup).subscribe(
        data => {
          console.log(data);
          this.getTaskGroups();
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

}
