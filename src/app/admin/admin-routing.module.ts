import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { authGuard } from '../auth.guard';
import { DepartmentMstComponent } from '../component/department-mst/department-mst.component';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { DashboarddataComponent } from '../component/dashboarddata/dashboarddata/dashboarddata.component';
import { DashboardadminComponent } from '../component/dashboardadmin/dashboardadmin.component';
const routes: Routes = [
    {path:"register",component:RegisterUserComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN'] } },
    {path:"department",component:DepartmentMstComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN'] } },
    { path: "dashboard", component: DashboardComponent, canActivate: [authGuard], data: { expectedRole: ['ROLE_USER'] } }, // Guarded by AuthGuard
    { path: "dashboardadmin", component: DashboardadminComponent, canActivate: [authGuard], data: { expectedRole: ['ROLE_ADMIN',] } }, // Guarded by AuthGuard

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
