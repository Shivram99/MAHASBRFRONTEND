import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth.guard';
import { MenuComponent } from '../component/menu/menu.component';
import { DeveloperDashboardComponent } from '../component/developer-dashboard/developer-dashboard.component';




const routes: Routes = [
  {path:"menu",component:MenuComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_DEVELOPER'] } },
  {path:"developerDashboard",component:DeveloperDashboardComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_DEVELOPER'] } }
      
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,]
})
export class DeveloperRoutingModule { }
