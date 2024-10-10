import { Component, OnInit } from '@angular/core';  
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';     
import { AuthService } from '../auth.service'; // Adjust the path accordingly

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
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchIncomes();
  }

  fetchIncomes() {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found, user is not authenticated');
      return; // Exit if no token is found
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    this.http.get<any>('http://localhost:3000/api/income', { headers })
      .subscribe(
        (response) => {
          console.log('Income data fetched successfully', response);
          
          // Assign the fetched income data to the incomes array
          this.incomes = response.data;
          
          // Extract months from the fetched incomes
          this.extractMonths();
          
          // Set filteredIncomes initially to display all incomes
          this.filteredIncomes = this.incomes;
  
          // Calculate the total monthly income for all displayed incomes
          this.calculateTotalMonthlyIncome();
        },
        (error) => {
          console.error('Error fetching income data:', error);
        }
      );
  }
  
  

  extractMonths() {
    this.months = [...new Set(this.incomes.map(income => income.month))];
  }

  filterIncomes() {
    this.filteredIncomes = this.selectedMonth
      ? this.incomes.filter(income => income.month === this.selectedMonth)
      : this.incomes;
  
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
