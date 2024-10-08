import { Component, OnInit } from '@angular/core';  
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-income-list',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.css'
})
export class IncomeListComponent implements OnInit {
  incomes: any[] = [];
  filteredIncomes: any[] = [];
  selectedMonth: string = '';
  months: string[] = [];
  totalMonthlyIncome: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchIncomes();
  }

  fetchIncomes() {
    this.http.get('http://localhost:3000/api/income').subscribe(
      (response: any) => {
        this.incomes = response.data;
        this.extractMonths();
      },
      error => {
        console.error('Error fetching income data:', error);
      }
    );
  }

  extractMonths() {
    this.months = [...new Set(this.incomes.map(income => income.month))];
  }

  filterIncomes() {
    this.filteredIncomes = this.incomes.filter(income => income.month === this.selectedMonth);
    this.calculateTotalMonthlyIncome();
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  calculateTotalMonthlyIncome() {
    this.totalMonthlyIncome = this.filteredIncomes.reduce((total, income) => total + income.amount, 0);
  }

  goBack() {
    this.location.back();
  }

  goToDashboard() {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}   
