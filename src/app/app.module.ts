import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AboutusComponent } from './component/aboutus/aboutus.component';
import { ContactusComponent } from './component/contactus/contactus.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
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
import { TopbarComponent } from './component/control/topbar/topbar.component';
import { NavComponent } from './component/control/nav/nav.component';
import { CaroselComponent } from './component/control/carosel/carosel.component';
import { NewsTickerComponent } from './component/control/news-ticker/news-ticker.component';
import { AwardsComponent } from './component/awards/awards.component';
import { FeedbackComponent } from './component/feedback/feedback.component';
import { OwlCorosalComponent } from './component/control/owl-corosal/owl-corosal.component';
import { FaqComponent } from './component/faq/faq.component';
import { ImportantDocumentComponent } from './component/important-document/important-document.component';
import { SearchBrnComponent } from './component/search-brn/search-brn.component';
import { DashboardNavComponent } from './component/dashboard-nav/dashboard-nav.component';
import { CitizenDashboardComponent } from './component/citizen-dashboard/citizen-dashboard.component';
import { CircularComponent } from './component/circular/circular.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgIdleModule } from '@ng-idle/core';
import { DashboardDetailsComponent } from './component/dashboard-details/dashboard-details.component';
import { DuplicatedeatilsComponent } from './component/duplicatedeatils/duplicatedeatils.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MultiSelectOptionComponent } from './component/util/multi-select-option/multi-select-option.component';
import { PostLoginDashboardComponent } from './component/post-login-dashboard/post-login-dashboard.component';
import { RegionBRNDetailsComponent } from './component/region-brndetails/region-brndetails.component';
import { DistrictBRNDetailsComponent } from './component/district-brndetails/district-brndetails.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { SharedModule } from './shared/shared.module';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { RequestFormComponent } from './component/request-form/request-form.component';
import { AccessibilityService } from './core/services/accessibility.service';
import { LanguageService } from './core/services/language.service';
import { initializeApplicationFactory } from './core/factories/app-initializer.factory';
import { AuthService } from './services/auth.service';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AboutusComponent,
    ContactusComponent,
    LoginComponent,
    UnauthorizedComponent,
    ChangePasswordComponent,
    DepartmentMstComponent,
    RoleComponent,
    DashboardadminComponent,
    ViewDetailsAdminDashBoardComponent,
    TopbarComponent,
    NavComponent,
    CaroselComponent,
    NewsTickerComponent,
    AwardsComponent,
    FeedbackComponent,
    OwlCorosalComponent,
    FaqComponent,
    ImportantDocumentComponent,
    SearchBrnComponent,
    DashboardNavComponent,
    CitizenDashboardComponent,
    CircularComponent,
    DashboardDetailsComponent,
    DuplicatedeatilsComponent,
    PostLoginDashboardComponent,
    RegionBRNDetailsComponent,
    DistrictBRNDetailsComponent,
    CapitalizePipe,
    RequestFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgIdleModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    authGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApplicationFactory,
      deps: [LanguageService, AccessibilityService, AuthService],
      multi: true
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
