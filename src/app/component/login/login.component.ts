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
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,AfterViewInit {
  appService = inject(LoginService);

 // authService = inject(AuthService);

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  isLoggedIn: boolean = false;
  registrationSuccess: boolean = false;
  name = '';
  roles: string[] = [];
  unsecure!: string;
  secure!: string;
  secureAdmin!: string;
  showRegistration = false;
  responseData: any;

  captchaError: boolean = false;
  username: string = '';
  password: string = '';
  recaptchaResponse:string='';
  errorMessage: string | null = null; // Explicitly define errorMessage property

  currentLanguage: string="en";
  serverErrors: any = {};

 constructor(private authService: AuthService,private router: Router,private languageService:LanguageService,private renderer: Renderer2,@Inject(PLATFORM_ID) private platformId: Object, private idleTimeoutService: IdleTimeoutService,private fb: FormBuilder) { }

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

passwordVisible = false;

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
    this.authService.logout();
    debugger;
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password, this.loginForm.value.recaptchaResponse).subscribe(() => {
      grecaptcha.reset();
       debugger;
       if(this.authService.responseData.isFirstTimeLogin){
        this.router.navigate(['/changePassword']);
        this.idleTimeoutService.reset();
       }
      else if(this.authService.responseData.roles.includes("ROLE_ADMIN")){

        this.router.navigate(['/admin/dashboardadmin']);
        this.idleTimeoutService.reset();

      }else if(this.authService.responseData.roles.includes("ROLE_MODERATOR")){
        this.router.navigate(['/moderator/moderatorDashboard']);
        this.idleTimeoutService.reset();

      }else if(this.authService.responseData.roles.includes("ROLE_DEVELOPER")){
        this.router.navigate(['/developer/developerDashboard']);
        this.idleTimeoutService.reset();

      }else if(this.authService.responseData.roles.includes("ROLE_DES_REGION")){
        this.router.navigate(['/des-region']);
        this.idleTimeoutService.reset();
      }else if(this.authService.responseData.roles.includes("ROLE_DES_DISTRICT")){
        this.router.navigate(['/des-district-brn-details']);
        this.idleTimeoutService.reset();
      } 
      else if(this.authService.responseData.roles.includes("ROLE_REG_AUTH_API")){
        this.router.navigate(['/des-district-brn-details']);
        this.idleTimeoutService.reset();
      }
      else if(this.authService.responseData.roles.includes("ROLE_REG_AUTH_CSV")){
        this.router.navigate(['/des-registry']);
        this.idleTimeoutService.reset();
      }
      else{
        this.router.navigate(['/des-registry']);
        this.idleTimeoutService.reset();

      }

    }, (err: HttpErrorResponse) => {

      debugger
      grecaptcha.reset();
       if (err.status === 400 && err.error && typeof err.error === 'object') {
        // Backend sent field-specific errors
        this.serverErrors = err.error;
        Object.keys(this.serverErrors).forEach(field => {
          const control = this.loginForm.get(field);
          if (control) {
            control.setErrors({ backend: this.serverErrors[field] });
          }
        });
      } 
      else if (err.status === 401) {
        // Invalid credentials
        this.errorMessage = 'Invalid username or password';
      } 
      else {
        // Fallback error
        this.errorMessage = 'An error occurred. Please try again later.';
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
      .subscribe((response) => {
        this.registrationSuccess = true;
      });
  }

  logout() {
    localStorage.setItem('auth-token', '');
    this.isLoggedIn = false;
  }

  fetchUnsecure() {
    this.appService
      .fetchUnsecureEndpoint()
      .pipe(take(1))
      .subscribe((response) => {
        this.unsecure = response.msg;
      });
  }

  fetchSecure() {
    this.appService
      .fetchSecureEndpoint()
      .pipe(take(1))
      .subscribe({
        next: (response) => (this.secure = response.msg),
        error: (err) => {
          this.secure = err.statusText;
        },
      });
  }

  fetchSecureAdmin() {
    this.appService
      .fetchSecureAdminEndpoint()
      .pipe(take(1))
      .subscribe({
        next: (response) => (this.secureAdmin = response.msg),
        error: (err) => {
          this.secureAdmin = err.statusText;
        },
      });
  }

  private setName() {
   // const helper = new JwtHelperService(); 
    this.name = this.responseData.accessToken;
    this.roles = this.responseData.roles[0];

    localStorage.setItem('roles', this.responseData.roles );
    localStorage.setItem('isAuthenticated', "true");
  }

  handleCaptchaResponse(token: string) {
    // Token available here, you can send it to your server for validation
    //console.log('Captcha token:', token);
    
    // You can perform any action with the token here, such as sending it to the server for verification
  }

  ngAfterViewInit() {
    // Initialize reCAPTCHA in the callback function
    this.initializeReCaptcha();
  }

  loadReCaptchaScript() {
   
    const script = this.renderer.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
   
  }

  initializeReCaptcha() {
    // Initialize reCAPTCHA when the script is loaded
    if (isPlatformBrowser(this.platformId)) {
    grecaptcha.render('recaptchaElement', {
      'sitekey': '6Le8N_QpAAAAAJBErDqsniTRWKzU9m45WOcnoi7x',
      'callback': this.handleCaptchaResponse
    });
  }
  }

}
