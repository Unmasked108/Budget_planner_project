import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent {
  incomeForm: any;
  selectedMonth: any;
  januaryIncomes: any[] = [];

  februaryIncomes: any[] = [];
  marchIncomes: any[] = [];

  monthSelected: boolean = false;
  successMessage: string = '';

  constructor(public fb: FormBuilder,public router: Router,public http: HttpClient, private snackBar: MatSnackBar) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', Validators.required],
      investments: ['', Validators.required],  // Changed from 'investment' to 'investments'
    });
  }
  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredIncome();
  }
  calculateTotalIncome(month: string): string {
    let totalIncome = 0;
    for(const income of this.getIncomesForMonth(month)){
      totalIncome += income.amount;
    }
    return this.formatCurrency(totalIncome);
  }

  getIncomesForMonth(month: string): any[] {
    switch(month){
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
    switch(this.selectedMonth){
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
        investments: ''
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
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