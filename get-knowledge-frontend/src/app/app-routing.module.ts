import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {LearnComponent} from "./learn/learn.component";
import {TestComponent} from "./test/test.component";
import {GroupsComponent} from "./groups/groups.component";
import {CreatorComponent} from "./creator/creator.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'learn', component: LearnComponent, canActivate: [AuthGuardService] },
  { path: 'test', component: TestComponent, canActivate: [AuthGuardService] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuardService] },
  { path: 'creator', component: CreatorComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
