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
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { DepartmentMstComponent } from './component/department-mst/department-mst.component';
import { RoleComponent } from './component/role/role.component';

import {DataTablesModule} from 'angular-datatables';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    DashboardComponent,
    AboutusComponent,
    ContactusComponent,
    LoginComponent,
    UnauthorizedComponent,
    ChangePasswordComponent,
   // RegisterUserComponent,
    DepartmentMstComponent,
    RoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule, 
    DataTablesModule,
   TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient] // If using HttpLoaderFactory
    }
  }),
  ],
  providers: [
    provideClientHydration(),
    authGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
