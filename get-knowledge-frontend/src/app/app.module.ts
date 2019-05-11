import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  MAT_DATE_LOCALE,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RestService} from "./services/rest.service";
import { JwtModule } from '@auth0/angular-jwt';
import { HeaderComponent } from './header/header.component';
import { GroupsComponent } from './groups/groups.component';
import { CreatorComponent } from './creator/creator.component';
import { TestComponent } from './test/test.component';
import { LearnComponent } from './learn/learn.component';
import {RestInterceptorService} from "./services/rest-interceptor.service";
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ChartsModule } from 'ng2-charts';
import localePl from '@angular/common/locales/pl';
import localePlExtra from '@angular/common/locales/extra/pl';
import {registerLocaleData} from "@angular/common";
import { SolverComponent } from './solver/solver.component';
import { LoaderComponent } from './loader/loader.component';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import {environment} from "../environments/environment";

registerLocaleData(localePl, 'pl-PL', localePlExtra);

export function tokenGetter() {
  return localStorage.getItem('auth_token') || '';
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    GroupsComponent,
    CreatorComponent,
    TestComponent,
    LearnComponent,
    SolverComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatSliderModule,
    MatStepperModule,
    MatSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [],
        blacklistedRoutes: []
      }
    }),
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    MatRadioModule,
    DragDropModule,
    MatBadgeModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    Angulartics2Module.forRoot({
      pageTracking: {
        clearIds: true,
      }
    })
  ],
  providers: [
    RestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestInterceptorService,
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'pl-PL'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor () {
    console.log('APP VERSION: ' + environment.VERSION);
  }
}
