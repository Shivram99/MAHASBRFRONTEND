import { AfterViewInit, Component, OnInit, Renderer2, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from '../../language.service';
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

 constructor(private authService: AuthService,private router: Router,private languageService:LanguageService,private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadReCaptchaScript();
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable().subscribe(language => {
      this.currentLanguage = language;
    });
    
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      recaptchaResponse: new FormControl('', [Validators.required]),
    });

    this.registrationForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      recaptchaResponse: new FormControl('', [Validators.required]),
    });
  }



  login(): void {
    debugger;
   // const tokenInput = document.getElementsByName('g-recaptcha-response')[0] as HTMLInputElement;
    //const token = tokenInput.value;
    //this.recaptchaResponse=token;
    const response = grecaptcha.getResponse();

    this.loginForm.get('recaptchaResponse')?.setValue(response);

    if (response.length === 0) {
      this.captchaError = true;
      return;
    }
    this.authService.logout();
    debugger
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password, this.loginForm.value.recaptchaResponse).subscribe(() => {
      grecaptcha.reset();
      if(this.authService.responseData.roles.includes("ROLE_ADMIN")){

        this.router.navigate(['/admin/dashboardadmin']);

      }else if(this.authService.responseData.roles.includes("ROLE_MODRATOR")){
        this.router.navigate(['/moderator/moderatorDashboard']);

      }else if(this.authService.responseData.roles.includes("ROLE_DEVELOPER")){
        this.router.navigate(['/developer/developerDashboard']);

      }else if(this.authService.responseData.roles.includes("ROLE_USER")){
        this.router.navigate(['/admin/dashboard']);

      }

     
    
    }, (error: HttpErrorResponse) => {
      grecaptcha.reset();
      if (error.status === 401) {
        this.errorMessage = 'Invalid username or password';
      } else {
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    });
  }
  

  /*login() {
    alert(localStorage);
    this.appService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response);
    
        alert(localStorage);
        this.responseData = response.body;
        console.log('Response Data:', this.responseData); // Log the entire response data
        alert('User ID:'+this.responseData.id); 
        alert('Login Successful:');
        this.appService.setRoles(this.responseData.roles);

       localStorage.setItem(
          'accessToken',
          this.responseData.accessToken || ''
        );
        if (localStorage.getItem('accessToken') !== '') {
          this.isLoggedIn = true;
          this.setName();
        }
      });
  }*/

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
    grecaptcha.render('recaptchaElement', {
      'sitekey': '6Le8N_QpAAAAAJBErDqsniTRWKzU9m45WOcnoi7x',
      'callback': this.handleCaptchaResponse
    });
  }

}
