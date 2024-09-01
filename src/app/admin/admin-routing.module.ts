import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { authGuard } from '../auth.guard';
import { DepartmentMstComponent } from '../component/department-mst/department-mst.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { DashboarddataComponent } from '../component/dashboarddata/dashboarddata/dashboarddata.component';
import { DashboardadminComponent } from '../component/dashboardadmin/dashboardadmin.component';
import { DashboardDetailsComponent } from '../component/dashboard-details/dashboard-details.component';
const routes: Routes = [
    {path:"register",component:RegisterUserComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT'] } },
    {path:"department",component:DepartmentMstComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT'] } },
    { path: "dashboard", component: DashboardComponent, canActivate: [authGuard], data: { expectedRole: ['ROLE_MODERATOR','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT'] } }, // Guarded by AuthGuard
    { path: "dashboardadmin", component: DashboardadminComponent, canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN','ROLE_MODERATOR','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT'] } }, // Guarded by AuthGuard
    //{ path: 'dashboard-details/:brnNo', component: DashboardDetailsComponent, canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN','ROLE_MODERATOR','ROLE_DES_STATE','ROLE_DES_REGION','ROLE_DES_DISTRICT'] }, },
    /*path: '',
    children: [
      { path: 'register', component: RegisterUserComponent},
      // Other child routes...
    ]*/
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
