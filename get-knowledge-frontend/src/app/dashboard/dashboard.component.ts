import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {RestService} from "../services/rest.service";
import {User} from "../classes/user";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {ChartOptions} from "chart.js";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  translations = Translations;
  user: User = null;
  stats: any = {
    points: null,
    correctSolutions: null,
    invalidSolutions: null,
    allSolutions: null,
    avgSolutionDuration: null,
    numberOfAllAvailableTasks: null,
    numberOfTaskGroups: null,
    numberOfTests: null
  };

  public pieChartLabels: string[] = [
    this.translations.TITLE_STATS_CORRECT_SOLUTIONS,
    this.translations.TITLE_STATS_INVALID_SOLUTIONS
  ];
  public pieChartData: number[] = [];
  public pieChartType: any = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgb(92, 184, 92, 0.8)', 'rgb(217, 83, 79, 0.8)']
    },
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return ctx.chart.data.labels[ctx.dataIndex];
        },
      },
    }
  };

  constructor(private restService: RestService, private router: Router) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.restService.getUserInfo().subscribe(
      data => {
        console.log(data);
        this.bindUser(data);
        this.bindStats(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  bindUser(data: any) {
    if (_.has(data, 'user')) {
      const id: string = _.get(data, 'user._id', null);
      const role: string = _.get(data, 'user.role', null);
      const firstName: string = _.get(data, 'user.firstName', null);
      const lastName: string = _.get(data, 'user.lastName', null);
      const nick: string = _.get(data, 'user.nick', null);
      const email: string = _.get(data, 'user.email', null);
      const gender: string = _.get(data, 'user.gender', null);
      const age: number = _.get(data, 'user.age', null);
      this.user = new User(id, role, firstName, lastName, nick, email, gender, age);
    } else {
      this.user = null;
    }
  }

  bindStats(data: any) {
    if (_.has(data, 'stats')) {
      const dataStats = data.stats;
      this.stats.points = _.get(dataStats, 'points', null);
      this.stats.correctSolutions = _.get(dataStats, 'correctSolutions', null);
      this.stats.invalidSolutions = _.get(dataStats, 'invalidSolutions', null);
      this.stats.allSolutions = _.get(dataStats, 'allSolutions', null);
      this.stats.avgSolutionDuration = _.get(dataStats, 'avgSolutionDuration', null);
      this.stats.numberOfAllAvailableTasks = _.get(dataStats, 'numberOfAllAvailableTasks', null);
      this.stats.numberOfTaskGroups = _.get(dataStats, 'numberOfTaskGroups', null);
      this.stats.numberOfTests = _.get(dataStats, 'numberOfTests', null);
      this.pieChartData.push(this.stats.correctSolutions);
      this.pieChartData.push(this.stats.invalidSolutions);
    }
  }

  goToLearn() {
    this.router.navigate(['/learn']);
  }

  goToTest() {
    this.router.navigate(['/test']);
  }

}
