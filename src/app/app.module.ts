import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
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
import { AuthInterceptor } from './auth-interceptor.interceptor';
import { authGuard } from './auth.guard';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { TopbarComponent } from './component/control/topbar/topbar.component';
import { NavComponent } from './component/control/nav/nav.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgIdleModule } from '@ng-idle/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SharedModule } from './shared/shared.module';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
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
    ChangePasswordComponent,
    TopbarComponent,
    NavComponent
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
