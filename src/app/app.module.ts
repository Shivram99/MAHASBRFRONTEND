import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { PrivateHeaderComponent } from './component/private-header/private-header.component';
import { PrivateFooterComponent } from './component/private-footer/private-footer.component';
import { PrivateLayoutComponent } from './component/private-layout/private-layout.component';
import { TopbarComponent } from './component/control/topbar/topbar.component';
import { NavComponent } from './component/control/nav/nav.component';
import { CaroselComponent } from './component/control/carosel/carosel.component';
import { NewsTickerComponent } from './component/control/news-ticker/news-ticker.component';
import { AwardsComponent } from './component/awards/awards.component';
import { CirclularComponent } from './component/circlular/circlular.component';
import { FeedbackComponent } from './component/feedback/feedback.component';
import { OwlCorosalComponent } from './component/control/owl-corosal/owl-corosal.component';
import { FaqComponent } from './component/faq/faq.component';
import { ImportantDocumentComponent } from './component/important-document/important-document.component';
import { SearchBrnComponent } from './component/search-brn/search-brn.component';
import { DashboardNavComponent } from './component/dashboard-nav/dashboard-nav.component';
import { CitizenDashboardComponent } from './component/citizen-dashboard/citizen-dashboard.component';
import { DetailsComponent } from './component/details/details.component';
import { UploadCsvComponent } from './component/upload-csv/upload-csv.component';
import { CircularComponent } from './component/circular/circular.component';
import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { DashboardDetailsComponent } from './component/dashboard-details/dashboard-details.component';
import { BRNregistoryDetailsComponent } from './component/brnregistory-details/brnregistory-details.component';
import { DuplicatedeatilsComponent } from './component/duplicatedeatils/duplicatedeatils.component';
import { ConcerndetailsComponent } from './component/concerndetails/concerndetails.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MultiSelectOptionComponent } from './component/util/multi-select-option/multi-select-option.component';


//import { ChartfilterComponent } from './component/chartfilter/chartfilter.component';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    TopbarComponent,
    NavComponent,
    CaroselComponent,
    NewsTickerComponent,
    AwardsComponent,
    CirclularComponent,
    FeedbackComponent,
    OwlCorosalComponent,
    FaqComponent,
    ImportantDocumentComponent,
    SearchBrnComponent,
    DashboardNavComponent,
    CitizenDashboardComponent,
    DetailsComponent,
    UploadCsvComponent,
    CircularComponent,
    DashboardDetailsComponent,
    BRNregistoryDetailsComponent,
    DuplicatedeatilsComponent,
    ConcerndetailsComponent,
    MultiSelectOptionComponent,
    
   
    

   // ChartfilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule, 
    //RecaptchaModule.forRoot(),
    NgIdleModule.forRoot(), // Initialize NgIdleModule
    NgIdleKeepaliveModule.forRoot(),
   TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient] // If using HttpLoaderFactory
    },
    
  }),
  ],
  providers: [
    provideClientHydration(),provideHttpClient(withFetch()),
    authGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
