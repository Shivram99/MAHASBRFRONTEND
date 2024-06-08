import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth.guard';
import { MenuComponent } from '../component/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';




const routes: Routes = [
  {path:"menu",component:MenuComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_DEVELOPER'] } },
  {path:"developerDashboard",component:MenuComponent,canActivate: [authGuard], data: { expectedRole: ['ROLE_DEVELOPER'] } }
      
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,ReactiveFormsModule]
})
export class DeveloperRoutingModule { }
