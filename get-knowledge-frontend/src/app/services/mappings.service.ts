import { Injectable } from '@angular/core';
import {Translations} from "../translations/translations.enum";

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
  ];

  public wTypeSeparator: string = '###';
  public wTypePartsSeparator: string = '$$$';
  public sTypeSeparator: string = '###';

  public successChartColor: string = 'rgb(92, 184, 92, 0.8)';
  public failChartColor: string = 'rgb(217, 83, 79, 0.8)';

  constructor() { }
}
