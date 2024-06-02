import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { authGuard } from '../auth.guard';
import { DepartmentMstComponent } from '../component/department-mst/department-mst.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { DashboarddataComponent } from '../component/dashboarddata/dashboarddata/dashboarddata.component';

const routes: Routes = [
    {path:"register",component:RegisterUserComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN'] } },
    {path:"department",component:DepartmentMstComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN'] } },
    { path: "dashboard", component: DashboardComponent, canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN','ROLE_DEVELOPER','ROLE_MODRATOR'] } }, // Guarded by AuthGuard

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
