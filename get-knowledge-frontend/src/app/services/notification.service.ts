import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material";
import {Translations} from "../translations/translations.enum";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  translations = Translations;

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string, actionMessage: string = this.translations.ACTION_CLOSE) {
    this.snackBar.open(message, actionMessage, {duration: 5000});
  }
}
