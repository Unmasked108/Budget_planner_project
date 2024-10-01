import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { TodoComponent } from './todo/todo.component';
import { IncomeListComponent } from './income-list/income-list.component';
const routes: Routes = [
 
  {
    path: 'side-nav',
    component: SideNavComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path:'income',
    component:IncomeComponent
  },  
  {
    path:'income-list',
    component:IncomeListComponent
  },
  {
    path:'expense',
    component:ExpenseComponent
  },
  {
    path:'todo',
    component:TodoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetPlannerRoutingModule { }
