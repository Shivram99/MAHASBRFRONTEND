import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './component/homepage/homepage.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import { LoginComponent } from './component/login/login.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { FaqComponent } from './component/faq/faq.component';
import { ImportantDocumentComponent } from './component/important-document/important-document.component';
import { SearchBrnComponent } from './component/search-brn/search-brn.component';
import { FeedbackComponent } from './component/feedback/feedback.component';
import { CircularComponent } from './component/circular/circular.component';
import { CitizenDashboardComponent } from './component/citizen-dashboard/citizen-dashboard.component';
import { DashboardDetailsComponent } from './component/dashboard-details/dashboard-details.component';
import { DuplicatedeatilsComponent } from './component/duplicatedeatils/duplicatedeatils.component';




const routes: Routes = [
  {path:"",component:HomepageComponent},
  {path:"aboutus",component:AboutusComponent},
  {path:"search-brn",component:SearchBrnComponent},
  {path:"faq",component:FaqComponent},
  {path:"contactus",component:ContactusComponent},
  {path:"login",component:LoginComponent},
  {path:"important-document",component:ImportantDocumentComponent},
  {path:"circular",component:CircularComponent},
  {path:"dashboard",component:DashboardComponent},
  {path:"citizen-dashboard",component:CitizenDashboardComponent,children: [
    
    {
      path: 'dashboard-details/:brnNo',
      component: DashboardDetailsComponent
    },
    {
      path: 'duplicate-details',
      component: DuplicatedeatilsComponent
    },
  ]},
  {path:"feedback",component:FeedbackComponent},
  
  {path:"unauthorized",component:UnauthorizedComponent},
  {path:"common-post-login/changePassword",component:ChangePasswordComponent},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'developer', loadChildren: () => import('./developer/developer.module').then(m => m.DeveloperModule) },
  { path: 'common-post-login', loadChildren: () => import('./common-post-login/common-post-login.module').then(m => m.CommonPostLoginModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 



  
}
