import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { RegisterUserService } from '../../services/register-user.service';

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
    email: ''
  };
  roles: string[] = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MODERATOR']; // Replace with actual roles

  constructor(private userService: RegisterUserService) { }

  ngOnInit() {
    // Initialize user roles here if needed
  }

  register() {
    this.userService.register(this.user).subscribe(() => {
      console.log('User registered successfully');
    }, error => {
      console.error('Error registering user:', error);
    });
  }
}