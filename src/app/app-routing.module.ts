import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './component/homepage/homepage.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import { LoginComponent } from './component/login/login.component';
import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { RegisterUserComponent } from './component/register-user/register-user.component';
import { ModeratorModule} from './moderator/moderator.module';
import { DeveloperModule } from './developer/developer.module'; 
import { FaqComponent } from './component/faq/faq.component';
import { ImportantDocumentComponent } from './component/important-document/important-document.component';
import { SearchBrnComponent } from './component/search-brn/search-brn.component';


const routes: Routes = [
  {path:"",component:HomepageComponent},
  {path:"aboutus",component:AboutusComponent},
  {path:"contactus",component:ContactusComponent},
  {path:"login",component:LoginComponent},
  {path:"faq",component:FaqComponent},
  {path:"important-document",component:ImportantDocumentComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:"search-brn",component:SearchBrnComponent},
  {path:"unauthorized",component:UnauthorizedComponent},
  {path:"changePassword",component:ChangePasswordComponent},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'moderator', loadChildren: () => import('./moderator/moderator.module').then(m => m.ModeratorModule) },
  { path: 'developer', loadChildren: () => import('./developer/developer.module').then(m => m.DeveloperModule) },
 
 // {path:"register",component:RegisterUserComponent},
  /*{
    path: "admin",
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard], data: { expectedRole: 'ROLE_ADMIN' } // Load only when authenticated
  },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
