import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './component/homepage/homepage.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { RegisterUserComponent } from './component/register-user/register-user.component';

const routes: Routes = [
  {path:"",component:HomepageComponent},
  {path:"aboutus",component:AboutusComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { expectedRole: 'ROLE_ADMIN' } }, // Guarded by AuthGuard
  {path:"contactus",component:ContactusComponent},
  {path:"login",component:LoginComponent},
  {path:"unauthorized",component:UnauthorizedComponent},
  {path:"changePassword",component:ChangePasswordComponent},
  {path:"register",component:RegisterUserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
