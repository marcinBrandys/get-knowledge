import { Injectable } from '@angular/core';
import {Translations} from "../translations/translations.enum";

@Injectable({
  providedIn: 'root'
})
export class MappingsService {

  public taskTypes = [
    {code: 'T_01', translation: Translations.TASK_TYPE_T_01}
  ];

  constructor() { }
}
