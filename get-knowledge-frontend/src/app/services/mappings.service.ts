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
    {code: 'W_03', translation: Translations.TASK_TYPE_W_03}
  ];

  public wTypeSeparator: string = '###';

  constructor() { }
}
