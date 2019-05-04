import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _isLoading: boolean = false;
  private _numberOfPendingRequests: number = 0;

  constructor() { }

  show() {
    this.numberOfPendingRequests++;
    setTimeout(
      () => {
        if (this.numberOfPendingRequests > 0 && !this.isLoading) {
          this.isLoading = true;
        }
      },
      100
    )
  }

  hide() {
    this.numberOfPendingRequests--;
    if (this.numberOfPendingRequests < 1) {
      this.numberOfPendingRequests = 0;
      setTimeout(
        () => {
          if (this.numberOfPendingRequests < 1) {
            this.isLoading = false;
          }
        },
        50
      )
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  get numberOfPendingRequests(): number {
    return this._numberOfPendingRequests;
  }

  set numberOfPendingRequests(value: number) {
    this._numberOfPendingRequests = value;
  }
}
