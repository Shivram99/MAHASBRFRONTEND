import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth.guard';
import { DeveloperDashboardComponent } from '../component/developer-dashboard/developer-dashboard.component';
import { MenuRoleMappingComponent } from '../component/menu-role-mapping/menu-role-mapping.component';
import { LayoutComponent } from '../shared/components/layout/layout.component';




const routes: Routes = [
  {
      path: '',
      component: LayoutComponent, // Parent component
    },
  {path:"menuMapping",component:MenuRoleMappingComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_DEVELOPER'] } },
  {path:"developerDashboard",component:DeveloperDashboardComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_DEVELOPER'] } }
      
 ];
 

@NgModule({
  imports: [RouterModule.forChild(routes),RouterModule],
  exports: [RouterModule,]
})
export class DeveloperRoutingModule { }
