import { Injectable } from '@angular/core';
import {Translations} from "../translations/translations.enum";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class MappingsService {

  public taskTypes = [
    {code: 'T_01', translation: Translations.TASK_TYPE_T_01},
    {code: 'T_02', translation: Translations.TASK_TYPE_T_02},
    {code: 'W_01', translation: Translations.TASK_TYPE_W_01},
    {code: 'W_02', translation: Translations.TASK_TYPE_W_02},
    {code: 'W_03', translation: Translations.TASK_TYPE_W_03},
    {code: 'W_04', translation: Translations.TASK_TYPE_W_04},
    {code: 'S_01', translation: Translations.TASK_TYPE_S_01},
    {code: 'S_02', translation: Translations.TASK_TYPE_S_02},
    {code: 'G_01', translation: Translations.TASK_TYPE_G_01},
    {code: 'G_02', translation: Translations.TASK_TYPE_G_02},
  ];

  public studentsTaskTypes = [
    {translation: Translations.TASK_TYPE_T, code: 'T'},
    {translation: Translations.TASK_TYPE_W, code: 'W'},
    {translation: Translations.TASK_TYPE_S, code: 'S'},
    {translation: Translations.TASK_TYPE_G, code: 'G'}
  ];

  public httpRoutesWithoutMainLoadingSpinner = [
    'user-management/ranking',
    'user-management/private_ranking',
    'task-group-management/tests_result'
  ];

  public wTypeSeparator: string = '###';
  public wTypePartsSeparator: string = '$$$';
  public sTypeSeparator: string = '###';
  public gTypeGroupSeparator: string = '$$$';
  public gTypeElementSeparator: string = '###';
  public gTypeGroupAndElementSeparator: string = '@@@';

  public gTypeAvailableElements: string = 'availableElements';

  public successChartColor: string = 'rgb(92, 184, 92, 0.8)';
  public failChartColor: string = 'rgb(217, 83, 79, 0.8)';

  constructor() { }

  isHttpRouteWithoutMainLoadingSpinner (httpRoute: string): boolean {
    let result: boolean = false;
    for (let route of this.httpRoutesWithoutMainLoadingSpinner) {
      if (_.includes(httpRoute, route)) result = true;
    }

    return result;
  }
}
