import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {catchError, finalize} from "rxjs/operators";
import {LoaderService} from "./loader.service";

@Injectable({
  providedIn: 'root'
})
export class RestInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loaderService.show();

    const reqWithAccessToken = req.clone({
      headers: req.headers.set('x-access-token', this.authService.getToken())
    });

    return next.handle(reqWithAccessToken).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          this.authService.logout();
        } else {
          return throwError(err);
        }
      }),
      finalize(
        () => {
          this.loaderService.hide();
        }
      )
    );
  }
}
