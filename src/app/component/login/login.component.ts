import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from '../../language.service';
import { isPlatformBrowser } from '@angular/common';
import { IdleTimeoutService } from '../../services/idle-timeout.service';
declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  registrationSuccess: boolean = false;
  captchaError: boolean = false;
  errorMessage: string | null = null;
  serverErrors: any = {};
  currentLanguage: string = "en";
  passwordVisible = false;

  constructor(
    private authService: AuthService,
    private appService: LoginService,
    private router: Router,
    private languageService: LanguageService,
    private renderer: Renderer2,
    private idleTimeoutService: IdleTimeoutService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadReCaptchaScript();
    }

    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable().subscribe(language => {
      this.currentLanguage = language;
    });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recaptchaResponse: ['']
    });

    // Clear backend error when the field changes
    Object.keys(this.loginForm.controls).forEach(field => {
      this.loginForm.get(field)?.valueChanges.subscribe(() => {
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

    const response = grecaptcha.getResponse();
    this.loginForm.get('recaptchaResponse')?.setValue(response);

    if (response.length === 0) {
      this.captchaError = true;
      return;
    }

    // Ensure clean state
    this.authService.logout();

    this.authService.login(
      this.loginForm.value.username,
      this.loginForm.value.password,
      this.loginForm.value.recaptchaResponse
    ).subscribe({
      next: () => {
        grecaptcha.reset();

        const roles = this.authService.getUserRoles();
      
        if (roles.includes("ROLE_ADMIN")) {
          this.router.navigate(['/admin/dashboardadmin']);
        } else if (roles.includes("ROLE_MODERATOR")) {
          this.router.navigate(['/moderator/moderatorDashboard']);
        } else if (roles.includes("ROLE_DEVELOPER")) {
          this.router.navigate(['/developer/developerDashboard']);
        } else if (roles.includes("ROLE_DES_REGION")) {
          this.router.navigate(['/des-region']);
        } else if (roles.includes("ROLE_DES_DISTRICT")) {
          this.router.navigate(['/des-district-brn-details']);
        } else if (roles.includes("ROLE_REG_AUTH_API")) {
          this.router.navigate(['/des-district-brn-details']);
        } else if (roles.includes("ROLE_REG_AUTH_CSV")) {
          this.router.navigate(['/common-post-login']);
        } else {
          this.router.navigate(['/des-registry']);
        }

        this.idleTimeoutService.reset();
      },
      error: (err: HttpErrorResponse) => {
        grecaptcha.reset();

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

  loadReCaptchaScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  initializeReCaptcha() {
    if (isPlatformBrowser(this.platformId)) {
      grecaptcha.render('recaptchaElement', {
        'sitekey': '6Le8N_QpAAAAAJBErDqsniTRWKzU9m45WOcnoi7x',
        'callback': this.handleCaptchaResponse.bind(this)
      });
    }
  }

  handleCaptchaResponse(token: string) {
    this.loginForm.get('recaptchaResponse')?.setValue(token);
  }

  ngAfterViewInit() {
    this.initializeReCaptcha();
  }
}
