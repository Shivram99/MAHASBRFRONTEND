import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './component/login/login.component';
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { DepartmentMstComponent } from './component/department-mst/department-mst.component';
import { RoleComponent } from './component/role/role.component';
import { DashboardadminComponent } from './component/dashboardadmin/dashboardadmin.component';
import { ViewDetailsAdminDashBoardComponent } from './component/view-details-admin-dash-board/view-details-admin-dash-board.component';
import { PrivateHeaderComponent } from './private-header/private-header.component';
import { PrivateFooterComponent } from './private-footer/private-footer.component';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';
//import { ChartfilterComponent } from './component/chartfilter/chartfilter.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    // DashboardComponent,
    AboutusComponent,
    ContactusComponent,
    LoginComponent,
    UnauthorizedComponent,
    ChangePasswordComponent,
   // RegisterUserComponent,
    DepartmentMstComponent,
    RoleComponent,
    DashboardadminComponent,
    ViewDetailsAdminDashBoardComponent,
    PrivateHeaderComponent,
    PrivateFooterComponent,
    PrivateLayoutComponent,
   // ChartfilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule, 
   TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient] // If using HttpLoaderFactory
    }
  }),
  ],
  providers: [
    provideClientHydration(),provideHttpClient(withFetch()),
    authGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
