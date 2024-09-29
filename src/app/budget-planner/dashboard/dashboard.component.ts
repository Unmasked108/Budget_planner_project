import { Component } from '@angular/core';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideNavComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  lastMonthsIncome = ['January : $1000', 'February : $1200', 'March : $1100', 'April : $1300'];
  currentMonthIncome = '$1400';

  //expense
  lastMonthsExpense = ['January : $1000', 'February : $1200', 'March : $1100', 'April : $1300'];
  currentMonthExpense = '$1400';

  //todo
  todoTransactions = [
    { description: 'Pay electricity bill' },
    { description: 'Submit monthly report' },
    { description: 'Buy groceries' },
    { description: 'Call insurance company' }
  ];
  totalCurrentMonthIncome = 2000;
  totalCurrentMonthExpense = 1500;

  constructor(private router: Router) {}
  onIncome(){
    this.router.navigate(['/budget-planner/income']);
  }
  onExpense(){
    this.router.navigate(['/budget-planner/expense']);
  }
  onTodo(){
    this.router.navigate(['/budget-planner/todo']);
  }
  get currentMonthSavings(): number {
    return this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;
  }

}
