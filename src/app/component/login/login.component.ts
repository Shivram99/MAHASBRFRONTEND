import { AfterViewInit, Component, DestroyRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { isPlatformBrowser } from '@angular/common';
import { IdleTimeoutService } from '../../services/idle-timeout.service';
import { MenuService } from '../../services/menu.service';
import { environment } from '../../../environments/environment';
declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent implements OnInit, AfterViewInit {
  private static recaptchaScriptPromise: Promise<void> | null = null;
  private static readonly recaptchaCallbackName = 'mahaSbrRecaptchaReady';
  private static readonly recaptchaScriptId = 'google-recaptcha-script';
  private static readonly recaptchaScriptHosts = [
    'https://www.google.com/recaptcha/api.js',
    'https://www.recaptcha.net/recaptcha/api.js'
  ];
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  registrationSuccess: boolean = false;
  captchaError: boolean = false;
  errorMessage: string | null = null;
  serverErrors: any = {};
  currentLanguage: string = "en";
  passwordVisible = false;
  recaptchaLoadError = false;
  private recaptchaWidgetId: number | null = null;
  private readonly recaptchaSiteKey = environment.recaptchaSiteKey;

  constructor(
    private authService: AuthService,
    private appService: LoginService,
    private router: Router,
    private languageService: LanguageService,
    private renderer: Renderer2,
    private idleTimeoutService: IdleTimeoutService,
    private fb: FormBuilder,
    private menuService: MenuService,
    private destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(language => {
        this.currentLanguage = language;
      });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recaptchaResponse: ['']
    });

    // Clear backend error when the field changes
    Object.keys(this.loginForm.controls).forEach(field => {
      this.loginForm.get(field)?.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const control = this.loginForm.get(field);
          if (control?.hasError('backend')) {
            const newErrors = { ...control.errors };
            delete newErrors['backend'];
            if (Object.keys(newErrors).length === 0) {
              control.setErrors(null);
            } else {
              control.setErrors(newErrors);
            }
          }
        });
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login(): void {
    this.serverErrors = {};
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (!this.isReCaptchaReady() || this.recaptchaWidgetId === null) {
      this.captchaError = true;
      return;
    }

    const response = grecaptcha.getResponse(this.recaptchaWidgetId);
    this.loginForm.get('recaptchaResponse')?.setValue(response);

    if (response.length === 0) {
      this.captchaError = true;
      return;
    }

    this.authService.login(
      this.loginForm.value.username,
      this.loginForm.value.password,
      this.loginForm.value.recaptchaResponse
    ).subscribe({
      next: async () => {
        this.resetReCaptcha();
        this.menuService.loadMyMenus();
        await this.authService.navigateToPostLoginHome();
        this.idleTimeoutService.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.resetReCaptcha();

        if (err.status === 400 && err.error && typeof err.error === 'object') {
          this.serverErrors = err.error;
          Object.keys(this.serverErrors).forEach(field => {
            const control = this.loginForm.get(field);
            if (control) {
              control.setErrors({ backend: this.serverErrors[field] });
            }
          });
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }

  register() {
    this.appService
      .register(
        this.registrationForm.value.username,
        this.registrationForm.value.password
      )
      .pipe(take(1))
      .subscribe(() => {
        this.registrationSuccess = true;
      });
  }

  loadReCaptchaScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this.isReCaptchaReady()) {
      return Promise.resolve();
    }

    if (LoginComponent.recaptchaScriptPromise) {
      return LoginComponent.recaptchaScriptPromise;
    }

    LoginComponent.recaptchaScriptPromise = this.loadReCaptchaScriptFromHost(0);

    return LoginComponent.recaptchaScriptPromise;
  }

  initializeReCaptcha() {
    if (!isPlatformBrowser(this.platformId) || !this.isReCaptchaReady() || this.recaptchaWidgetId !== null) {
      return;
    }

    if (!this.recaptchaSiteKey) {
      this.recaptchaLoadError = true;
      this.captchaError = true;
      return;
    }

    const recaptchaElement = document.getElementById('recaptchaElement');
    if (!recaptchaElement) {
      return;
    }

    try {
      this.recaptchaWidgetId = grecaptcha.render(recaptchaElement, {
        sitekey: this.recaptchaSiteKey,
        callback: this.handleCaptchaResponse.bind(this),
        'expired-callback': this.handleCaptchaExpired.bind(this),
        'error-callback': this.handleCaptchaLoadError.bind(this)
      });
      this.recaptchaLoadError = false;
      this.captchaError = false;
    } catch {
      this.handleCaptchaLoadError();
    }
  }

  handleCaptchaResponse(token: string) {
    this.loginForm.get('recaptchaResponse')?.setValue(token);
    this.captchaError = false;
  }

  handleCaptchaExpired(): void {
    this.loginForm.get('recaptchaResponse')?.setValue('');
  }

  handleCaptchaLoadError(): void {
    this.recaptchaLoadError = true;
    this.captchaError = true;
  }

  ngAfterViewInit() {
    this.loadReCaptchaScript()
      .then(() => this.initializeReCaptcha())
      .catch(() => {
        this.recaptchaLoadError = true;
        this.captchaError = true;
      });
  }

  private isReCaptchaReady(): boolean {
    return typeof grecaptcha !== 'undefined' && typeof grecaptcha.render === 'function';
  }

  private resetReCaptcha(): void {
    if (this.isReCaptchaReady() && this.recaptchaWidgetId !== null) {
      grecaptcha.reset(this.recaptchaWidgetId);
    }
  }

  private waitForReCaptchaReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      const startedAt = Date.now();
      const intervalId = window.setInterval(() => {
        if (this.isReCaptchaReady()) {
          window.clearInterval(intervalId);
          resolve();
          return;
        }

        if (Date.now() - startedAt > 10000) {
          window.clearInterval(intervalId);
          LoginComponent.recaptchaScriptPromise = null;
          reject();
        }
      }, 50);
    });
  }

  private loadReCaptchaScriptFromHost(hostIndex: number): Promise<void> {
    const host = LoginComponent.recaptchaScriptHosts[hostIndex];
    if (!host) {
      LoginComponent.recaptchaScriptPromise = null;
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      const browserWindow = window as any;
      const existingScript = document.getElementById(LoginComponent.recaptchaScriptId);
      let completed = false;

      if (existingScript) {
        existingScript.remove();
      }

      const tryNextHost = () => {
        if (completed) {
          return;
        }

        completed = true;
        const script = document.getElementById(LoginComponent.recaptchaScriptId);
        script?.remove();
        this.loadReCaptchaScriptFromHost(hostIndex + 1).then(resolve).catch(reject);
      };

      const loadTimeoutId = window.setTimeout(tryNextHost, 10000);

      browserWindow[LoginComponent.recaptchaCallbackName] = () => {
        this.waitForReCaptchaReady()
          .then(() => {
            if (completed) {
              return;
            }

            completed = true;
            window.clearTimeout(loadTimeoutId);
            resolve();
          })
          .catch(() => {
            window.clearTimeout(loadTimeoutId);
            tryNextHost();
          });
      };

      const script = this.renderer.createElement('script');
      script.id = LoginComponent.recaptchaScriptId;
      script.src = `${host}?onload=${LoginComponent.recaptchaCallbackName}&render=explicit`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        window.clearTimeout(loadTimeoutId);
        tryNextHost();
      };

      document.body.appendChild(script);
    });
  }
}
