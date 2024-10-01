import { Component } from '@angular/core';
import { FormBuilder , Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm : any;
registerForm : any;
activeForm : 'login' | 'register' = 'login';
constructor(private fb: FormBuilder,
  private router: Router,
  private snackBar: MatSnackBar,
  private http: HttpClient
){}

ngOnInit(): void {
  console.log("Login Component Loaded");

  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  this.registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}
toggleForm(form: 'login' | 'register') {
  this.activeForm = form;
}

login() {
  if (this.loginForm.valid) {
    this.http.post('http://localhost:3000/api/users/login', this.loginForm.value).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/budget-planner/dashboard']);
      },
      error => {
        console.error('Login error:', error);
        this.snackBar.open('Invalid credentials', 'Close', { duration: 3000 });
      }
    );
  } else {
    this.snackBar.open('Invalid form inputs', 'Close', { duration: 3000 });
  }
}


register() {
  if (this.registerForm.valid) {
    this.http.post('http://localhost:3000/api/users/register', this.registerForm.value).subscribe(
      response => {
        console.log('Registration successful:', response);
        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        this.toggleForm('login');
      },
      error => {
        console.error('Registration error:', error);
        this.snackBar.open('Registration failed', 'Close', { duration: 3000 });
      }
    );
  } else {
    this.snackBar.open('Invalid form inputs', 'Close', { duration: 3000 });
  }
}
}
