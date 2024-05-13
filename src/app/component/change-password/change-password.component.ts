import { Component, OnInit } from '@angular/core';
import { ChangePasswordService } from '../../services/change-password.service';
import { ChangePasswordModel } from '../../model/change-password-model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements  OnInit{

  
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  message: string="";
  errorMessage: string="";

  

  constructor(private changePasswordService: ChangePasswordService,private authService:AuthService,private router: Router) { }
  ngOnInit(): void {
  this.changePasswordModel=new ChangePasswordModel(); 
   // throw new Error('Method not implemented.');
  }



  onSubmit() {



    this.changePasswordService.changePassword(this.changePasswordModel)
      .subscribe(
        response => {
          // Handle successful response
          this.message = response; // Assuming response contains a message
          console.log('Password changed successfully');


          Swal.fire({
            title: "Password Updated!",
            text: "Login again!",
            icon: "success"
          });
         
          this.authService.logout();
          this.router.navigate(['/login']);

        },
         (error: HttpErrorResponse)  => {
          // Handle error response

          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else if (error.status === 409) {
            this.errorMessage = 'Old Password mismatched';
          } 
          else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
          console.error('Error occurred while changing password:', error);
        }
      );
  }

}
