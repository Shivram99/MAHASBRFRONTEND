import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { authGuard } from './auth.guard';

const adminRoles = ['ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_DES_STATE', 'ROLE_DES_REGION', 'ROLE_DES_DISTRICT'];
const commonPostLoginRoles = ['ROLE_ADMIN', 'ROLE_DES_STATE', 'ROLE_DES_REGION', 'ROLE_DES_DISTRICT', 'ROLE_REG_AUTH_API', 'ROLE_REG_AUTH_CSV'];
const developerRoles = ['ROLE_DEVELOPER'];

const routes: Routes = [
  // Any logged-in user may change their own password (also MODERATOR/DEVELOPER, who must do it at first login).
  {path:"common-post-login/changePassword",component:ChangePasswordComponent, canActivate: [authGuard]},
  { path: 'admin', canActivate: [authGuard], data: { expectedRole: adminRoles }, loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'developer', canActivate: [authGuard], data: { expectedRole: developerRoles }, loadChildren: () => import('./developer/developer.module').then(m => m.DeveloperModule) },
  { path: 'common-post-login', canActivate: [authGuard], data: { expectedRole: commonPostLoginRoles }, loadChildren: () => import('./common-post-login/common-post-login.module').then(m => m.CommonPostLoginModule) },
  { path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },
  { path: '**', redirectTo: 'unauthorized' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
