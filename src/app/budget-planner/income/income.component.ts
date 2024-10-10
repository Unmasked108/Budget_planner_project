import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service'; // Adjust the path accordingly

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'], // Corrected property from 'styleUrl' to 'styleUrls'
})
export class IncomeComponent {
  incomeForm: any;
  selectedMonth: any;
  januaryIncomes: any[] = [];
  februaryIncomes: any[] = [];
  marchIncomes: any[] = [];
  monthSelected: boolean = false;
  successMessage: string = '';
  incomes: any[] = []; // Define incomes property


  constructor(
    public fb: FormBuilder,
    public router: Router,

    private snackBar: MatSnackBar,
    private http: HttpClient, private authService: AuthService
  ) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', Validators.required],
      investments: ['', Validators.required],
    });

    // Fetch previous income for the logged-in user
    this.fetchUserIncomes(); // Added to fetch user incomes on init
  }

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredIncome();
  }

  calculateTotalIncome(month: string): string {
    let totalIncome = 0;
    for (const income of this.getIncomesForMonth(month)) {
      totalIncome += income.amount;
    }
    return this.formatCurrency(totalIncome);
  }
  getIncomeData() {
    const token = this.authService.getToken();  // Ensure token is retrieved correctly
    if (!token) {
      console.error('No token found, user is not authenticated');
      this.snackBar.open('You must be logged in to fetch income data.', 'Close', {
        duration: 3000,
      });
      return; // Exit if not authenticated
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Token must be properly included
      'Content-Type': 'application/json',
    });
  
    this.http.get<any>('http://localhost:3000/api/income', { headers })
      .subscribe(
        (response) => {
          // Handle response and set data properly
          console.log('Fetched income data:', response);
          this.incomes = response.data;  // Ensure the data is set correctly to display
        },
        (error) => {
          console.error('Error fetching income data:', error);
          this.snackBar.open('Error fetching income data.', 'Close', {
            duration: 3000,
          });
        }
      );
  }
  
  
  getIncomesForMonth(month: string): any[] {
    switch (month) {
      case 'January':
        return this.januaryIncomes;
      case 'February':
        return this.februaryIncomes;
      case 'March':
        return this.marchIncomes;
      default:
        return [];
    }
  }

  getFilteredIncome() {
    let filteredIncomes: any[] = [];
    switch (this.selectedMonth) {
      case 'January':
        filteredIncomes = [...this.januaryIncomes];
        break;
      case 'February':
        filteredIncomes = [...this.februaryIncomes];
        break;
      case 'March':
        filteredIncomes = [...this.marchIncomes];
        break;
      default:
        break;
    }
    return filteredIncomes;
  }

  onSubmit() {
    if (this.incomeForm.valid) {
      const newIncome = {
        month: this.incomeForm.value.month,
        source: this.incomeForm.value.source,
        amount: parseFloat(this.incomeForm.value.amount),
        investments: this.incomeForm.value.investments,
      };

      // Add to local array immediately to show in the Income List
      this.addIncomeToLocal(newIncome.month, newIncome);

      // Reset form and update selected month
      this.incomeForm.reset();
      this.incomeForm.patchValue({
        month: this.selectedMonth,
        source: '',
        amount: '',
        investments: '',
      });

      // Set success message
      this.successMessage = 'Income added to the list. Click Save to store in the database.';
    }
  }

  saveForm() {
    const currentMonthIncomes = this.getIncomesForMonth(this.selectedMonth);
    if (currentMonthIncomes.length > 0) {
      this.saveIncomes(currentMonthIncomes);
    } else {
      this.snackBar.open('No incomes to save. Add an income first.', 'Close', {
        duration: 3000,
      });
    }
  }

  saveIncomes(incomeDataArray: any[]) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`, // Include the token here
    });
  
    this.http.post('http://localhost:3000/api/income/save-incomes', incomeDataArray, { headers })
      .subscribe(
        (response) => {
          console.log('Incomes saved successfully', response);
          this.snackBar.open('All incomes saved to database successfully!', 'Close', {
            duration: 3000,
          });
          this.successMessage = ''; // Clear the success message
        },
        (error) => {
          console.error('Error saving incomes:', error);
          this.snackBar.open('Error saving incomes to database.', 'Close', {
            duration: 3000,
          });
        }
      );
  }
  
  // New method to fetch previous income data for the logged-in user
  fetchUserIncomes() {
    const token = this.authService.getToken(); // Get token from AuthService
    if (!token) {
      console.error('No token found, user is not authenticated');
      this.snackBar.open('You must be logged in to fetch income data.', 'Close', {
        duration: 3000,
      });
      return; // Exit if not authenticated
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // Include the token in headers
    });
  
    this.http
      .get<{ data: any[] }>('http://localhost:3000/api/income', { headers })
      .subscribe(
        (response) => {
          const incomes = response.data;
          if (Array.isArray(incomes)) {
            incomes.forEach((income: any) => {
              this.addIncomeToLocal(income.month, income);
            });
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching income data:', error);
          this.snackBar.open('Error fetching income data.', 'Close', {
            duration: 3000,
          });
        }
      );
  }
  
  
  

  getLastAddedIncome(): any {
    const currentMonthIncomes = this.getIncomesForMonth(this.selectedMonth);
    return currentMonthIncomes.length > 0 ? currentMonthIncomes[currentMonthIncomes.length - 1] : null;
  }

  addIncomeToLocal(month: string, incomeData: any) {
    switch (month) {
      case 'January':
        this.januaryIncomes.push(incomeData);
        break;
      case 'February':
        this.februaryIncomes.push(incomeData);
        break;
      case 'March':
        this.marchIncomes.push(incomeData);
        break;
    }
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }

  onGetPreviousIncome() {
    this.router.navigate(['/budget-planner/income-list']);
  }

  // Add this method to format currency
  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }
}
