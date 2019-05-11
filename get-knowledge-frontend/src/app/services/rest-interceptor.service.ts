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
import {MappingsService} from "./mappings.service";

@Injectable({
  providedIn: 'root'
})
export class RestInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private loaderService: LoaderService, private mappingsService: MappingsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const reqWithAccessToken = req.clone({
      headers: req.headers.set('x-access-token', this.authService.getToken())
    });

    if (!this.mappingsService.isHttpRouteWithoutMainLoadingSpinner(req.url)) this.loaderService.show();

    return next.handle(reqWithAccessToken).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          this.authService.logout();
          return throwError(err);
        } else {
          return throwError(err);
        }
      }),
      finalize(
        () => {
          if (!this.mappingsService.isHttpRouteWithoutMainLoadingSpinner(req.url)) this.loaderService.hide();
        }
      )
    );
  }
}
