import { Component } from '@angular/core';
import { FormBuilder , Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm : any;
registerForm : any;
activeForm : 'login' | 'register' = 'login';
constructor(private fb: FormBuilder,
  private router: Router,
  private snackBar: MatSnackBar
){}

ngOnInit(): void {
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
    console.log("Login info==>", this.loginForm.value);
    this.router.navigate(['/budget-planner/dashboard']);
  }else{
    this.snackBar.open('Invalid form inputs','Close',{duration: 3000});
  }
}

register() {
  if (this.registerForm.valid) {
    console.log("Register info==>", this.registerForm.value);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    this.router.navigate(['/budget-planner/login']);
  }else{
    this.snackBar.open('Invalid form inputs','Close',{duration: 3000});
  }
}




}