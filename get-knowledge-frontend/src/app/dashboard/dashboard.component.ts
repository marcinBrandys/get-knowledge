import { Component, OnInit } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import {RestService} from "../services/rest.service";
import {User} from "../classes/user";
import * as _ from "lodash";
import {Router} from "@angular/router";
import {ChartOptions} from "chart.js";
import {MappingsService} from "../services/mappings.service";
import {NotificationService} from "../services/notification.service";
import {LoaderService} from "../services/loader.service";

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
    numberOfTaskGroups: null,
    numberOfTests: null
  };
  ranking: any[] = [];
  privateRanking: any[] = [];
  isRankingLoaded: boolean = false;
  isPrivateRankingLoaded: boolean = false;
  displayedColumns: string[] = ['index', 'studentNick', 'studentPoints', 'avgStudentSolutionDuration', 'studentGroupNames'];
  displayedPrivateColumns: string[] = ['index', 'studentNick', 'studentPoints', 'avgStudentSolutionDuration'];

  public pieChartLabels: string[] = [
    this.translations.TITLE_STATS_CORRECT_SOLUTIONS,
    this.translations.TITLE_STATS_INVALID_SOLUTIONS
  ];
  public pieChartData: number[] = [];
  public pieChartType: any = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: [this.mappingService.successChartColor, this.mappingService.failChartColor]
    },
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  constructor(private restService: RestService, private router: Router, private mappingService: MappingsService, private notificationService: NotificationService, public loaderService: LoaderService) { }

  ngOnInit() {
    this.getUserInfo();
    this.getRanking();
    this.getPrivateRanking();
  }

  getUserInfo() {
    this.restService.getUserInfo().subscribe(
      data => {
        this.bindUser(data);
        this.bindStats(data);
      },
      error => {
        this.notificationService.showNotification(this.translations.TITLE_GENERIC_ERROR);
      }
    )
  }

  getRanking() {
    this.restService.getRanking().subscribe(
      data => {
        this.bindRanking(data);
      },
      error => {
        this.notificationService.showNotification(this.translations.TITLE_GENERIC_ERROR);
      },
      () => {
        this.isRankingLoaded = true;
      }
    )
  }

  getPrivateRanking() {
    this.restService.getPrivateRanking().subscribe(
      data => {
        this.bindPrivateRanking(data);
      },
      error => {
        this.notificationService.showNotification(this.translations.TITLE_GENERIC_ERROR);
      },
      () => {
        this.isPrivateRankingLoaded = true;
      }
    )
  }

  bindUser(data: any) {
    if (_.has(data, 'user')) {
      const id: string = _.get(data, 'user._id', null);
      const role: string = _.get(data, 'user.role', null);
      const nick: string = _.get(data, 'user.nick', null);
      const gender: string = _.get(data, 'user.gender', null);
      const age: number = _.get(data, 'user.age', null);
      this.user = new User(id, role, nick, gender, age);
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
      this.stats.numberOfTaskGroups = _.get(dataStats, 'numberOfTaskGroups', null);
      this.stats.numberOfTests = _.get(dataStats, 'numberOfTests', null);
      this.pieChartData.push(this.stats.correctSolutions);
      this.pieChartData.push(this.stats.invalidSolutions);
    }
  }

  bindRanking(data: any) {
    this.ranking = _.get(data, 'ranking', []);
  }

  bindPrivateRanking(data: any) {
    this.privateRanking = _.get(data, 'ranking', []);
  }

  isLoggedUserNick(nick: string): boolean {
    return this.user.nick === nick;
  }

  goToLearn() {
    this.router.navigate(['/learn']);
  }

  goToTest() {
    this.router.navigate(['/test']);
  }

}
