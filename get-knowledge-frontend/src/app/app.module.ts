import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {
  MatButtonModule,
  MatCardModule, MatCheckboxModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatSelectModule, MatSliderModule,
  MatSnackBarModule, MatStepperModule, MatTableModule, MatTabsModule, MatToolbarModule
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
    LearnComponent
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
    DragDropModule
  ],
  providers: [RestService, {
    provide: HTTP_INTERCEPTORS,
    useClass: RestInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
