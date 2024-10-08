import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';  
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: any;
  registerForm: any;
  forgotPasswordForm: any;
  resetPasswordForm: any;
  activeForm: 'login' | 'register' | 'forgotPassword' | 'resetPassword' = 'login';
  showPassword: boolean = false;  // Add this variable to track password visibility

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private route: ActivatedRoute       // Inject ActivatedRoute here
  ) {}

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

    // Forgot Password Form
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Reset Password Form
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe(params => {
      const resetToken = params['token'];  // Get token from query params
      if (resetToken) {
        // Token exists, open the reset password form
        this.toggleForm('resetPassword');
      }
    });
  }
   // Add this method to toggle the password visibility
   togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  toggleForm(form: 'login' | 'register' | 'forgotPassword' | 'resetPassword') {
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
          if (error.status === 401) {
            this.snackBar.open('Incorrect email or password. Please try again.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Login failed. Please try again.', 'Close', { duration: 3000 });
          }
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:3000/api/users/register', this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful:', response);
          this.snackBar.open('User registered successfully! Please log in.', 'Close', { duration: 3000 });
          this.toggleForm('login');
        },
        error => {
          console.error('Registration error:', error);
          if (error.status === 409) {
            this.snackBar.open('Email already exists. Please use a different email.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
          }
        }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }

  submitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.http.post('http://localhost:3000/api/users/forgot-password', this.forgotPasswordForm.value).subscribe(
        response => {
          console.log('Forgot Password request successful:', response);
          this.snackBar.open('Password reset link sent to email.', 'Close', { duration: 3000 });
          this.toggleForm('resetPassword');
        },
        error => {
          console.error('Forgot Password error:', error);
          this.snackBar.open('Failed to send reset link. Try again.', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please provide a valid email.', 'Close', { duration: 3000 });
    }
  }
  
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
        this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
        return;
      }
  
      const token = this.route.snapshot.queryParamMap.get('token'); // Get token from URL
      if (!token) {
        this.snackBar.open('Invalid or missing reset token.', 'Close', { duration: 3000 });
        return;
      }
  
      this.http.post(`http://localhost:3000/api/users/reset-password/${token}`, this.resetPasswordForm.value)
        .subscribe(
          response => {
            this.snackBar.open('Password reset successfully!', 'Close', { duration: 3000 });
            this.toggleForm('login');  // Redirect to login form after success
          },
          error => {
            console.error('Password reset error:', error);
            this.snackBar.open('Password reset failed. Please try again.', 'Close', { duration: 3000 });
          }
        );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
    }
  }
  
}