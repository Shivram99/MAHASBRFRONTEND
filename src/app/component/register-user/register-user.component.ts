import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { RegisterUserService } from '../../services/register-user.service';
import { HttpClient } from '@angular/common/http';
import { DepartmentMst } from '../../model/department-mst';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent implements OnInit {
  user: User = {
    username: '', password: '', roles: [],
    id: 0,
    phoneNo: '',
    email: '',
    departmentId: 0
  };


  departments: DepartmentMst[] = []; // Store departments fetched from the backend
  selectedDepartmentId: number=0; 

  roles: any[] = [];
 // roles: string[] = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MODERATOR']; // Replace with actual roles

  constructor(private registerUserService: RegisterUserService,private http: HttpClient) { }




  ngOnInit() {
    debugger
    this.registerUserService.fetchRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.error('Error fetching roles:', error);
        // Handle error
      }
    );


    this.registerUserService.fetchDepartments().subscribe(
      departments => {
        this.departments = departments;
      },
      error => {
        console.error('Error fetching roles:', error);
        // Handle error
      }
    );

  
  }



  register() {
    this.registerUserService.register(this.user).subscribe(() => {
      console.log('User registered successfully');
    }, error => {
      console.error('Error registering user:', error);
    });
  }
}