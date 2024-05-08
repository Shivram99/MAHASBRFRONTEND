import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  appService = inject(LoginService);

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

  ngOnInit(): void {
   
   /* if (localStorage.getItem('accessToken') !== '') {
      this.isLoggedIn = true;
      this.setName();
    }*/
    
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.registrationForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
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
}
