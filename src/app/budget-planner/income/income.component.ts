import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
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
  januaryIncomes: any[] = [
    {source: 'Salary', amount: 5000 ,investment: '401(k)'},
    {source: 'Freelancing', amount: 1000 ,investment: 'Stocks'},
  ];

  februaryIncomes: any[] = [
    {source: 'Salary', amount: 5000 ,investment: '401(k)'},
    {source: 'Rental Property', amount: 1000 ,investment: 'Real Estate'},
  ];
  marchIncomes: any[] = [
    {source: 'Salary', amount: 5000 ,investment: '401(k)'},
    {source: 'Freelancing', amount: 1000 ,investment: 'Stocks'},
    {source: 'Rental Property', amount: 1000 ,investment: 'Real Estate'},
  ];

  monthSelected: boolean = false;
  constructor(public fb: FormBuilder,public router: Router) {
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
  calculateTotalIncome(month: string): number {
    let totalIncome = 0;
    for(const income of this.getIncomesForMonth(month)){
      totalIncome += income.amount;
    }
    return totalIncome;
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
    if(this.incomeForm.valid){
      const newIncome = {
        source: this.incomeForm.value.source,
        amount: parseFloat(this.incomeForm.value.amount),
        investments: this.incomeForm.value.investments  // Changed from 'investment' to 'investments'
      };
      switch(this.selectedMonth){
        case 'January':
          this.januaryIncomes.push(newIncome);
          break;
        case 'February':
          this.februaryIncomes.push(newIncome);
          break;
        case 'March':
          this.marchIncomes.push(newIncome);
          break;
        default:
          break;
      }
      this.incomeForm.reset();
      this.incomeForm.patchValue({
        month: this.selectedMonth,
        source: '',
        amount: '',
        investments: ''  // Changed from 'investment' to 'investments'
      });
    }
  }



  saveForm() {
    console.log("Form Submitted");
  }
onBack() {
  this.router.navigate(['/budget-planner/dashboard']);
}



}
