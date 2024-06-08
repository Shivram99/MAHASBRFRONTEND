import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeratorDashboardComponent } from '../component/moderator-dashboard/moderator-dashboard.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {path:"moderatorDashboard",component:ModeratorDashboardComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_MODERATOR'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeratorRoutingModule { }
